export interface RequestOptions {
  cache?: boolean | number;
  skipRateLimit?: boolean;
  timeoutMs?: number;
}

interface CacheEntry<T = unknown> {
  data: T;
  expiresAt: number;
}

type LoadingSubscriber = (isLoading: boolean, activeCount: number) => void;

class HttpClient {
  private authorization: string = "";

  // In-memory cache for API responses (primarily GET / idempotent requests)
  private cache = new Map<string, CacheEntry>();

  // In-flight request deduplication map to prevent multiple identical pending requests
  private inFlightRequests = new Map<string, Promise<unknown>>();

  // Rate Limiting & Concurrency controls
  private activeRequestsCount: number = 0;
  private readonly maxConcurrentRequests: number = 8;
  private readonly maxRequestsPerSecond: number = 25;
  private requestTimestamps: number[] = [];
  private requestQueue: Array<() => void> = [];

  // Loading subscribers
  private loadingSubscribers = new Set<LoadingSubscriber>();

  getAuthorizationToken(): string {
    return this.authorization;
  }

  setAuthorizationToken(token: string): void {
    this.authorization = token;
  }

  /**
   * Subscribe to global API loading state changes
   */
  public subscribeToLoading(callback: LoadingSubscriber): () => void {
    this.loadingSubscribers.add(callback);
    callback(this.activeRequestsCount > 0, this.activeRequestsCount);
    return () => {
      this.loadingSubscribers.delete(callback);
    };
  }

  private notifyLoadingChange(): void {
    const isLoading = this.activeRequestsCount > 0;
    this.loadingSubscribers.forEach((subscriber) => {
      try {
        subscriber(isLoading, this.activeRequestsCount);
      } catch {
        // Prevent subscriber errors from affecting HTTP client flow
      }
    });
  }

  /**
   * Clear all cached API responses (e.g. on logout or user switch)
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Invalidate specific cached URLs matching a string or pattern
   */
  public invalidateCache(urlPattern?: string | RegExp): void {
    if (!urlPattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (typeof urlPattern === "string") {
        if (key.includes(urlPattern)) {
          this.cache.delete(key);
        }
      } else if (urlPattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Determine default cache TTL for specific important endpoints
   */
  private getDefaultCacheTTL(method: string, url: string): number | null {
    if (method.toUpperCase() !== "GET") {
      return null;
    }

    // Endpoints that are relatively static and benefit heavily from caching
    const lowerUrl = url.toLowerCase();
    if (
      lowerUrl.includes("/status") ||
      lowerUrl.includes("postatus") ||
      lowerUrl.includes("invoicestatus") ||
      lowerUrl.includes("shipmentstatus") ||
      lowerUrl.includes("delforstatus") ||
      lowerUrl.includes("partnerdetails") ||
      lowerUrl.includes("modulesetting")
    ) {
      // 5 minutes TTL for metadata and status lists
      return 5 * 60 * 1000;
    }

    // 60 seconds default cache TTL for other GET requests
    return 60 * 1000;
  }

  /**
   * Rate limiting and concurrency scheduler
   */
  private async acquireRateLimitSlot(
    skipRateLimit: boolean,
  ): Promise<() => void> {
    if (skipRateLimit) {
      this.activeRequestsCount++;
      this.notifyLoadingChange();
      return () => {
        this.activeRequestsCount = Math.max(0, this.activeRequestsCount - 1);
        this.notifyLoadingChange();
        this.processQueue();
      };
    }

    return new Promise<() => void>((resolve) => {
      const runTask = () => {
        const now = Date.now();
        // Remove timestamps older than 1 second (sliding window)
        this.requestTimestamps = this.requestTimestamps.filter(
          (ts) => now - ts < 1000,
        );

        const canRunNow =
          this.activeRequestsCount < this.maxConcurrentRequests &&
          this.requestTimestamps.length < this.maxRequestsPerSecond;

        if (canRunNow) {
          this.requestTimestamps.push(now);
          this.activeRequestsCount++;
          this.notifyLoadingChange();

          resolve(() => {
            this.activeRequestsCount = Math.max(
              0,
              this.activeRequestsCount - 1,
            );
            this.notifyLoadingChange();
            this.processQueue();
          });
        } else {
          // Put back in queue to try on next tick or slot release
          this.requestQueue.unshift(runTask);
          const oldest = this.requestTimestamps[0] ?? now;
          const waitMs = Math.max(25, 1000 - (now - oldest));
          setTimeout(() => this.processQueue(), waitMs);
        }
      };

      this.requestQueue.push(runTask);
      this.processQueue();
    });
  }

  private processQueue(): void {
    if (this.requestQueue.length === 0) return;
    if (this.activeRequestsCount >= this.maxConcurrentRequests) return;

    const task = this.requestQueue.shift();
    if (task) {
      task();
    }
  }

  public apihelper = async <T = any>(
    method: string,
    url: string,
    authorization: boolean = true,
    payload?: unknown,
    extraHeaders: Record<string, string> = {},
    responseType: "json" | "blob" | "text" = "json",
    options: RequestOptions = {},
  ): Promise<T> => {
    const upperMethod = method.toUpperCase();

    // Cache key for GET requests
    const isGet = upperMethod === "GET";
    const cacheKey = isGet
      ? `${url}:${authorization ? this.getAuthorizationToken() : "no-auth"}`
      : null;

    // Check cache
    const customTTL =
      typeof options.cache === "number"
        ? options.cache
        : options.cache === false
          ? null
          : this.getDefaultCacheTTL(upperMethod, url);

    if (cacheKey && customTTL !== null) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.data as T;
      }
      if (cached) {
        this.cache.delete(cacheKey);
      }
    }

    // In-flight deduplication for identical concurrent GET requests
    if (cacheKey && this.inFlightRequests.has(cacheKey)) {
      return this.inFlightRequests.get(cacheKey) as Promise<T>;
    }

    const executionPromise = (async (): Promise<T> => {
      // Invalidate cache on mutations
      if (!isGet) {
        // If modifying data, invalidate potentially affected cache
        this.invalidateCache();
      }

      const releaseSlot = await this.acquireRateLimitSlot(
        Boolean(options.skipRateLimit),
      );

      // Max retry attempts for HTTP 429
      const maxRetries = 2;
      let attempt = 0;

      while (attempt <= maxRetries) {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const controller = new AbortController();
        const timeoutMs = options.timeoutMs ?? 60000;

        if (timeoutMs > 0) {
          timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        }

        try {
          const headers: Record<string, string> = {
            ...extraHeaders,
          };

          if (authorization) {
            headers["Authorization"] = `Bearer ${this.getAuthorizationToken()}`;
          }

          const requestOptions: RequestInit = {
            method: upperMethod,
            headers,
            signal: controller.signal,
          };

          if (payload !== undefined) {
            if (payload instanceof FormData) {
              requestOptions.body = payload;
            } else {
              headers["Content-Type"] = "application/json";
              requestOptions.body = JSON.stringify(payload);
            }
          }

          const response = await fetch(url, requestOptions);

          // Handle rate limit (HTTP 429) gracefully with backoff & retry
          if (response.status === 429 && attempt < maxRetries) {
            attempt++;
            const retryAfterHeader = response.headers.get("Retry-After");
            const backoffMs = retryAfterHeader
              ? parseInt(retryAfterHeader, 10) * 1000 || 1500
              : 1000 * Math.pow(2, attempt);

            await new Promise((resolve) => setTimeout(resolve, backoffMs));
            continue;
          }

          if (responseType === "blob") {
            if (!response.ok) {
              const errorBody = await response.text();
              throw new Error(
                `HTTP error! status: ${response.status} - ${errorBody}`,
              );
            }

            const blobData = (await response.blob()) as unknown as T;
            return blobData;
          }

          const responseText = await response.text();

          if (responseType === "text") {
            if (!response.ok) {
              throw new Error(
                responseText || `Request failed with status ${response.status}`,
              );
            }
            return responseText as unknown as T;
          }

          let data: unknown = null;

          if (responseText.trim()) {
            try {
              data = JSON.parse(responseText);
            } catch {
              if (response.ok) {
                data = responseText;
              } else {
                throw new Error(responseText);
              }
            }
          }

          if (!response.ok) {
            const errorMessage =
              typeof data === "string"
                ? data
                : `Request failed with status ${response.status}`;

            throw new Error(errorMessage);
          }

          const result = data as T;

          // Save to cache if applicable
          if (cacheKey && customTTL !== null && customTTL > 0) {
            this.cache.set(cacheKey, {
              data: result,
              expiresAt: Date.now() + customTTL,
            });
          }

          return result;
        } catch (error: unknown) {
          if (controller.signal.aborted) {
            throw new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
          }
          if (attempt >= maxRetries) {
            throw error;
          }
          throw error;
        } finally {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          if (attempt >= maxRetries || attempt === 0) {
            releaseSlot();
          }
        }
      }

      throw new Error(`Request failed after retries: ${url}`);
    })();

    if (cacheKey) {
      this.inFlightRequests.set(cacheKey, executionPromise);
      executionPromise.finally(() => {
        this.inFlightRequests.delete(cacheKey);
      });
    }

    return executionPromise;
  };
}

export const httpClient = new HttpClient();

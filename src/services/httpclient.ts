class HttpClient {
  private authorization: string = "";

  getAuthorizationToken(): string {
    return this.authorization;
  }

  setAuthorizationToken(token: string): void {
    this.authorization = token;
  }

  public apihelper = async <T = any>(
    method: string,
    url: string,
    authorization: boolean = true,
    payload?: unknown,
    extraHeaders: Record<string, string> = {},
    responseType: "json" | "blob" | "text" = "json",
  ): Promise<T> => {
    const headers: Record<string, string> = {
      ...extraHeaders,
    };

    if (authorization) {
      headers["Authorization"] = `Bearer ${this.getAuthorizationToken()}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (payload !== undefined) {
      if (payload instanceof FormData) {
        requestOptions.body = payload;
      } else {
        headers["Content-Type"] = "application/json";
        requestOptions.body = JSON.stringify(payload);
      }
    }

    try {
      const response = await fetch(url, requestOptions);

      if (responseType === "blob") {
        if (!response.ok) {
          const errorBody = await response.text();

          console.error("API Error Status:", response.status);
          console.error("API Error Response:", errorBody);

          throw new Error(
            `HTTP error! status: ${response.status} - ${errorBody}`,
          );
        }

        return (await response.blob()) as unknown as T;
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
          // A successful API response may contain plain text instead of JSON.
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

      return data as T;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
}

export const httpClient = new HttpClient();

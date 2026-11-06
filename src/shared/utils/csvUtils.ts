/**
 * Escapes a single CSV cell value according to RFC 4180
 */
export const escapeCsvCell = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
  }

  const stringValue = String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

/**
 * Extracts rows array from various API response shapes
 */
const extractRowsFromResponse = (data: unknown): Record<string, unknown>[] => {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data;
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;

    if (Array.isArray(obj.data)) {
      return obj.data;
    }
    if (Array.isArray(obj.result)) {
      return obj.result;
    }
    if (Array.isArray(obj.items)) {
      return obj.items;
    }
    if (Array.isArray(obj.records)) {
      return obj.records;
    }
    if (Array.isArray(obj.Response)) {
      return obj.Response;
    }
    if (obj.Response && typeof obj.Response === "object") {
      const resp = obj.Response as Record<string, unknown>;
      if (Array.isArray(resp.data)) return resp.data;
      if (Array.isArray(resp.items)) return resp.items;
    }

    // Single object response
    return [obj];
  }

  return [];
};

/**
 * Converts JSON or API response to CSV format and triggers a file download in the browser
 */
export const downloadJsonAsCsv = (
  response: unknown,
  fileName: string = "report.csv",
): void => {
  const normalizedFileName = fileName.toLowerCase().endsWith(".csv")
    ? fileName
    : `${fileName}.csv`;

  // 1. If response is already a Blob
  if (response instanceof Blob) {
    const url = window.URL.createObjectURL(response);
    const link = document.createElement("a");
    link.href = url;
    link.download = normalizedFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return;
  }

  // 2. If response is a string
  if (typeof response === "string") {
    const trimmed = response.trim();
    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        return downloadJsonAsCsv(parsed, normalizedFileName);
      } catch {
        // Fall back to plain string CSV
      }
    }

    const blob = new Blob(["\uFEFF" + response], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = normalizedFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return;
  }

  // 3. Extract rows from array or wrapped object
  const rows = extractRowsFromResponse(response);

  if (!rows.length) {
    throw new Error("No data found to generate CSV report.");
  }

  // Gather unique headers from all rows
  const headerSet = new Set<string>();
  for (const row of rows) {
    if (typeof row === "object" && row !== null) {
      Object.keys(row).forEach((key) => headerSet.add(key));
    }
  }

  const headers = Array.from(headerSet);
  if (!headers.length) {
    throw new Error("No column headers found to generate CSV report.");
  }

  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.map(escapeCsvCell).join(","));

  // Data rows
  for (const row of rows) {
    const rowValues = headers.map((header) =>
      row ? escapeCsvCell(row[header]) : "",
    );
    csvRows.push(rowValues.join(","));
  }

  const csvContent = "\uFEFF" + csvRows.join("\n");
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = normalizedFileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

import { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc";

export function useSort<T extends object>(
  data: T[],
  initialColumn?: keyof T,
  initialDirection: SortDirection = "asc",
) {
  const [sortColumn, setSortColumn] = useState<keyof T | "">(
    initialColumn ?? "",
  );

  const [sortDirection, setSortDirection] =
    useState<SortDirection>(initialDirection);

  const handleSort = (column: keyof T) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, sortColumn, sortDirection]);

  return {
    sortedData,
    sortColumn,
    sortDirection,
    handleSort,
  };
}

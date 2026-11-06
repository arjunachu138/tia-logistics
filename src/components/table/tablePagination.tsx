import React from "react";
import styles from "./table.module.css";
import AppImage from "../appimage/appimage";
import { icons } from "../../assets/icons";

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  totalPages,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
}) => {
  const getVisiblePages = (): Array<number | "..."> => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: Array<number | "..."> = [];

    // First section
    if (page <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    }
    // Last section
    else if (page >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    }
    // Middle section
    else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.pagination}>
      <div className={styles.pageSize}>
        <span>Showing</span>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
        >
          {[10, 20, 50].map((size) => (
            <option key={size}>{size}</option>
          ))}
        </select>

        <span>of {totalRecords} records</span>
      </div>

      <div className={styles.pageControls}>
        <button onClick={() => onPageChange?.(1)} disabled={page === 1}>
          <AppImage width="20" height="20" iconPath={icons.FirstPageIcon} />
        </button>

        <button onClick={() => onPageChange?.(page - 1)} disabled={page === 1}>
          <AppImage width="20" height="20" iconPath={icons.PreviousPageIcon} />
        </button>

        {visiblePages.map((item, index) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }

          return (
            <button
              key={`page-${item}`}
              type="button"
              className={page === item ? styles.activePage : styles.pageButton}
              onClick={() => onPageChange?.(item)}
            >
              {item}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange?.(page + 1)}
          disabled={page === totalPages}
        >
          <AppImage width="20" height="20" iconPath={icons.NextPageIcon} />
        </button>

        <button
          onClick={() => onPageChange?.(totalPages)}
          disabled={page === totalPages}
        >
          <AppImage width="20" height="20" iconPath={icons.LastPageIcon} />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;

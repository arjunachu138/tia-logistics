import React from "react";
import styles from "./table.module.css";
import TablePagination from "./tablePagination";
import { type ColumnType } from "./Cell Renderer/renderValue";
import RenderValue from "./Cell Renderer/renderValue";
import { icons } from "../../assets/icons";
import AppImage from "../appimage/appimage";
import ActionRenderer from "./Cell Renderer/ActionRenderer";

// ─── Column definition ────────────────────────────────────────────────────────
export interface ActionItem<T> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  actionClass?: string;
  onClick: (row: T, index: number) => void;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}
export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  type?: ColumnType;
  actions?: ActionItem<T>[];
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];

  loading?: boolean;

  // Dashboard header (title + view-all link)
  title?: string;
  count?: number;
  onViewAllClick?: () => void;

  // Checkbox selection
  showCheckbox?: boolean;
  selectedRows?: number[];
  onRowSelect?: (index: number) => void;
  onSelectAll?: (checked: boolean) => void;

  // Sorting
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: keyof T) => void;

  // Pagination
  showPagination?: boolean;
  page?: number;
  totalPages?: number;
  pageSize?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  stickyActionColumn?: boolean;

  actionColumnKey?: string;
  className?: string;

  // Row expandable & click handlers
  onRowClick?: (row: T, index: number) => void;
  renderExpandedRow?: (row: T, index: number) => React.ReactNode;
  isRowExpanded?: (row: T, index: number) => boolean;
  rowClassName?: (row: T, index: number) => string;
}

// ─── Component ────────────────────────────────────────────────────────────────

function Table<T extends object>({
  columns,
  data,

  loading = false,

  title,
  count,
  onViewAllClick,

  showCheckbox = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,

  onSort,

  showPagination = false,
  page = 1,
  totalPages = 1,
  pageSize = 10,
  totalRecords = data.length,
  onPageChange,
  onPageSizeChange,
  stickyActionColumn = false,
  actionColumnKey = "actions",
  className = "",

  onRowClick,
  renderExpandedRow,
  isRowExpanded,
  rowClassName,
}: TableProps<T>) {
  const allSelected = data.length > 0 && selectedRows.length === data.length;

  return (
    <div className={`${styles.tableContainer} ${className}`}>
      {/* ── Dashboard-style header ── */}
      {title && (
        <div className={styles.headerRow}>
          <h2 className={styles.title}>
            {title}{" "}
            {count !== undefined && (
              <span className={styles.count}>({count})</span>
            )}
          </h2>
          {onViewAllClick && (
            <button
              type="button"
              className={styles.viewAllLink}
              onClick={onViewAllClick}
            >
              View All
            </button>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {showCheckbox && (
                <th className={styles.checkboxColumn}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((column) => {
                const isSticky =
                  stickyActionColumn && String(column.key) === actionColumnKey;

                return (
                  <th
                    key={String(column.key)}
                    style={{
                      width: column.width,
                      textAlign: column.align ?? "left",
                    }}
                    className={isSticky ? styles.stickyRight : ""}
                  >
                    <button
                      type="button"
                      className={styles.headerButton}
                      disabled={!column.sortable}
                      onClick={() =>
                        column.sortable && onSort?.(column.key as keyof T)
                      }
                    >
                      {column.title}

                      {column.sortable && (
                        <AppImage
                          width="20"
                          height="20"
                          iconPath={icons.SortIcon}
                        />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (showCheckbox ? 1 : 0)}
                  className={styles.emptyState}
                >
                  Loading…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showCheckbox ? 1 : 0)}
                  className={styles.emptyState}
                >
                  No Records Found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const isSelected = selectedRows.includes(rowIndex);
                const expanded = isRowExpanded ? isRowExpanded(row, rowIndex) : false;
                const customRowClass = rowClassName ? rowClassName(row, rowIndex) : "";
                const totalColumns = columns.length + (showCheckbox ? 1 : 0);

                return (
                  <React.Fragment key={rowIndex}>
                    <tr
                      className={`${isSelected ? styles.rowSelected : ""} ${onRowClick ? styles.clickableRow : ""} ${expanded ? styles.parentExpandedRow : ""} ${customRowClass}`}
                      onClick={() => onRowClick?.(row, rowIndex)}
                    >
                      {showCheckbox && (
                        <td
                          className={styles.checkboxColumn}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onRowSelect?.(rowIndex)}
                          />
                        </td>
                      )}
                      {columns.map((column) => {
                        const value = (row as Record<string, unknown>)[column.key as string];
                        return (
                          <td
                            key={String(column.key)}
                            style={{ textAlign: column.align ?? "left" }}
                            className={
                              stickyActionColumn && column.key === actionColumnKey
                                ? styles.stickyRight
                                : ""
                            }
                          >
                            {column.render ? (
                              column.render(value, row, rowIndex)
                            ) : column.type === "action" ? (
                              <ActionRenderer
                                row={row}
                                index={rowIndex}
                                actions={column.actions ?? []}
                              />
                            ) : (
                              <RenderValue value={value} type={column.type} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {expanded && renderExpandedRow && (
                      <tr className={styles.expandedRow}>
                        <td
                          colSpan={totalColumns}
                          className={styles.expandedCell}
                        >
                          {renderExpandedRow(row, rowIndex)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {showPagination && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}

export default Table;

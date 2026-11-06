import type { ActionItem } from "../table";
import styles from "../table.module.css";

interface Props<T> {
  row: T;
  index: number;
  actions: ActionItem<T>[];
}

export default function ActionRenderer<T>({ row, index, actions }: Props<T>) {
  return (
    <div className={styles.actions}>
      {actions
        .filter((a) => !a.hidden?.(row))
        .map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={action.disabled?.(row)}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(row, index);
            }}
            className={`${styles.actionBtn} ${action.actionClass ?? ""}`}
          >
            {action.icon}
            {!action.icon && action.label}
          </button>
        ))}
    </div>
  );
}

import React from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  type SelectChangeEvent,
} from "@mui/material";
import { icons } from "../../assets/icons";
import styles from "./multiSelectDropdown.module.css";

export interface MultiSelectDropdownOption {
  label: string;
  value: string;
}

export interface MultiSelectDropdownProps {
  label?: string;
  required?: boolean;
  height?: string;
  width?: string;
  placeholder?: string;
  options: MultiSelectDropdownOption[];
  value?: string[];
  onChange?: (selectedValues: string[]) => void;
  onSelect?: (selectedOptions: MultiSelectDropdownOption[]) => void;
  variant?: "light" | "primary" | "dark";
  menuAlign?: "left" | "right";
  menuPosition?: "top" | "bottom";
  className?: string;
  disabled?: boolean;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  renderSummary?: (
    selected: string[],
    options: MultiSelectDropdownOption[],
  ) => React.ReactNode;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  required,
  height = "40px",
  width = "100%",
  placeholder = "Select...",
  options = [],
  value = [],
  onChange,
  onSelect,
  variant = "light",
  menuAlign = "left",
  menuPosition = "bottom",
  className = "",
  disabled = false,
  showSelectAll = true,
  selectAllLabel = "Select All",
  renderSummary,
}) => {
  const isPrimary = variant === "primary" || variant === "dark";

  const allSelected =
    options.length > 0 &&
    options.every((option) => value.includes(option.value));
  const isIndeterminate =
    value.length > 0 && !allSelected && options.some((o) => value.includes(o.value));

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const rawValue = event.target.value;
    const newValues =
      typeof rawValue === "string" ? rawValue.split(",") : rawValue;

    if (newValues.includes("__SELECT_ALL__")) {
      const updatedValues = allSelected ? [] : options.map((opt) => opt.value);
      onChange?.(updatedValues);
      if (onSelect) {
        const selectedOpts = options.filter((opt) =>
          updatedValues.includes(opt.value),
        );
        onSelect(selectedOpts);
      }
      return;
    }

    onChange?.(newValues);
    if (onSelect) {
      const selectedOpts = options.filter((opt) =>
        newValues.includes(opt.value),
      );
      onSelect(selectedOpts);
    }
  };

  const renderDisplayValue = (selected: string[]) => {
    if (!selected || selected.length === 0) {
      return <span className={styles.placeholder}>{placeholder}</span>;
    }

    if (renderSummary) {
      return renderSummary(selected, options);
    }

    if (allSelected && options.length > 1) {
      return (
        <span className={styles.displayValue}>
          All Selected ({options.length})
        </span>
      );
    }

    const selectedLabels = selected
      .map((val) => options.find((opt) => opt.value === val)?.label ?? val)
      .filter(Boolean);

    return (
      <span className={styles.displayValue} title={selectedLabels.join(", ")}>
        {selectedLabels.join(", ")}
      </span>
    );
  };

  const ArrowIcon = (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span
      {...props}
      className={`${styles.arrowIconWrapper} ${props.className || ""}`}
    >
      <img
        src={isPrimary ? icons.downArrowIcon : icons.downArrowIconB}
        alt="Arrow"
        className={styles.customArrow}
      />
    </span>
  );

  return (
    <div
      className={`${styles.wrapper} ${className}`}
      style={{ width, minWidth: width }}
    >
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      <FormControl
        fullWidth
        disabled={disabled}
        className={`${styles.formControl} ${isPrimary ? styles.primary : ""}`}
      >
        <Select
          multiple
          value={value}
          onChange={handleChange}
          displayEmpty
          disabled={disabled}
          className={styles.select}
          IconComponent={ArrowIcon}
          MenuProps={{
            classes: {
              paper: styles.menu,
            },
            anchorOrigin: {
              vertical: menuPosition === "top" ? "top" : "bottom",
              horizontal: menuAlign === "right" ? "right" : "left",
            },
            transformOrigin: {
              vertical: menuPosition === "top" ? "bottom" : "top",
              horizontal: menuAlign === "right" ? "right" : "left",
            },
          }}
          sx={{
            height,
            width,
          }}
          renderValue={(selected) => renderDisplayValue(selected as string[])}
        >
          {showSelectAll && options.length > 0 && (
            <MenuItem
              value="__SELECT_ALL__"
              className={`${styles.menuItem} ${styles.selectAllItem}`}
            >
              <Checkbox
                checked={allSelected}
                indeterminate={isIndeterminate}
                size="small"
                className={styles.checkbox}
                disableRipple
              />
              <ListItemText
                primary={selectAllLabel}
                className={styles.itemText}
              />
            </MenuItem>
          )}

          {options.map((option) => {
            const isChecked = value.includes(option.value);
            return (
              <MenuItem
                key={option.value}
                value={option.value}
                className={styles.menuItem}
              >
                <Checkbox
                  checked={isChecked}
                  size="small"
                  className={styles.checkbox}
                  disableRipple
                />
                <ListItemText
                  primary={option.label}
                  className={styles.itemText}
                />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultiSelectDropdown;

import React from "react";
import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { icons } from "../../assets/icons";
import styles from "./dropdown.module.css";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  label?: string;
  required?: boolean;
  height?: string;
  width?: string;
  mobileWidth?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  onSelect?: (option: DropdownOption) => void;
  triggerLabel?: string;
  variant?: "light" | "primary" | "dark";
  menuAlign?: "left" | "right";
  menuPosition?: "top" | "bottom";
  className?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  required,
  height = "40px",
  width = "100%",
  mobileWidth,
  placeholder,
  options = [],
  value,
  onSelect,
  triggerLabel,
  variant = "light",
  menuAlign = "left",
  menuPosition = "bottom",
  className = "",
  disabled = false,
}) => {
  const selectedOption = options.find((option) => option.value === value);

  const displayPlaceholder =
    placeholder ?? triggerLabel ?? options[0]?.label ?? "";

  const isPrimary = variant === "primary" || variant === "dark";

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    const selected = options.find((option) => option.value === selectedValue);
    if (selected) {
      onSelect?.(selected);
    }
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
      className={`${styles.wrapper} ${mobileWidth ? styles.hasMobileWidth : ""} ${className}`}
      style={
        {
          "--dropdown-width": width,
          "--dropdown-mobile-width": mobileWidth || width,
        } as React.CSSProperties
      }
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
          value={value ?? ""}
          displayEmpty
          onChange={handleChange}
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
            width: "100%",
          }}
          renderValue={(selected) => {
            if (!selected && selected !== "0") {
              return (
                <span className={styles.placeholder}>{displayPlaceholder}</span>
              );
            }

            return (
              <span className={styles.displayValue}>
                {selectedOption?.label ?? displayPlaceholder}
              </span>
            );
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <MenuItem
                key={option.value}
                value={option.value}
                className={styles.menuItem}
              >
                <span>{option.label}</span>
                {isSelected && <span className={styles.checkIcon}>✓</span>}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default Dropdown;

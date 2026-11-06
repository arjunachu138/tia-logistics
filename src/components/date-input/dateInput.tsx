import React from "react";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { SxProps, Theme } from "@mui/material";

import styles from "./dateInput.module.css";
import { icons } from "../../assets/icons";
import AppImage from "../appimage/appimage";

export interface DateInputProps {
  label?: string;

  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;

  placeholder?: string;
  helperText?: string;
  error?: string;

  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  fullWidth?: boolean;

  minDate?: Dayjs;
  maxDate?: Dayjs;

  disablePast?: boolean;
  disableFuture?: boolean;

  format?: string;

  height?: number | string;
  fontSize?: number | string;
  fontColor?: string;
  inputFontSize?: number | string;
  placeholderFontSize?: number | string;

  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<Theme>;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select date",
  helperText,
  error,
  disabled = false,
  required = false,
  fullWidth = true,
  readonly = false,
  minDate,
  maxDate,
  disablePast,
  disableFuture,
  format = "DD/MM/YYYY",
  height,
  fontSize,
  fontColor,
  inputFontSize,
  placeholderFontSize,
  className = "",
  style,
  sx,
}) => {
  const CalendarIcon = () => (
    <AppImage iconPath={icons.CalenderIcon} width="18" height="18" />
  );

  const formatSize = (val?: number | string) => {
    if (val === undefined || val === null) return undefined;
    return typeof val === "number" ? `${val}px` : val;
  };

  const heightValue = formatSize(height) || "40px";
  const effectiveFontSize =
    formatSize(fontSize || inputFontSize) || "var(--font-size-sm, 14px)";
  const effectivePlaceholderFontSize =
    formatSize(placeholderFontSize) || effectiveFontSize;

  return (
    <div
      className={`${styles.wrapper} ${
        fullWidth ? styles.fullWidth : ""
      } ${className}`}
      style={style}
    >
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value}
          onChange={onChange}
          format={format}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          disablePast={disablePast}
          disableFuture={disableFuture}
          slots={{
            openPickerIcon: CalendarIcon,
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              readOnly: readonly,
              helperText: error || helperText,
              size: "small",
              slotProps: {
                htmlInput: {
                  placeholder,
                },
              },

              sx: [
                {
                  "& .MuiInputBase-root, & .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root":
                    {
                      height: heightValue,
                      minHeight: heightValue ? heightValue : undefined,
                      borderRadius: "8px",
                      boxSizing: "border-box",

                      "& fieldset": {
                        borderColor: "var(--color-border-primary)",
                        borderRadius: "8px",
                      },

                      "&:hover fieldset": {
                        borderColor: "var(--color-input-hover)",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-input-focus)",
                        borderWidth: "1px",
                      },

                      "& .MuiInputAdornment-root": {
                        height: "100%",
                        maxHeight: "100%",
                      },

                      "& .MuiIconButton-root": {
                        padding: "4px",
                      },
                    },

                  "& .MuiInputBase-input, & .MuiOutlinedInput-input, & input, & .MuiPickersSectionList-root, & .MuiPickersSection-root":
                    {
                      fontSize: effectiveFontSize,
                      color: fontColor || "var(--color-text-primary)",
                      height: heightValue ? "100%" : undefined,
                      boxSizing: "border-box",
                      padding: heightValue ? "0 10px" : undefined,
                      display: "flex",
                      alignItems: "center",
                    },

                  "& .MuiInputBase-input::placeholder, & .MuiOutlinedInput-input::placeholder, & input::placeholder, & .MuiPickersSectionList-section[data-section-type='empty'], & .MuiPickersSection-placeholder":
                    {
                      fontSize: effectivePlaceholderFontSize,
                      color: "var(--color-text-secondary, #64748b)",
                      opacity: 1,
                    },
                },
                ...(Array.isArray(sx) ? sx : [sx]),
              ],
            },
            popper: {
              className: "date-input-picker-popper",
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default DateInput;

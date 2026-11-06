import React from "react";
import styles from "./input.module.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  inputContainerClass?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  disableMessage?: boolean;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  inputContainerClass = "",
  startIcon,
  endIcon,
  fullWidth = true,
  disableMessage = false,
  required = false,
  className = "",
  id,
  type,
  onKeyDown,
  onPaste,
  ...props
}) => {
  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ""}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      <div
        className={`
          ${styles.inputContainer}
          ${inputContainerClass}
          ${error ? styles.error : ""}
        `}
      >
        {startIcon && <span className={styles.icon}>{startIcon}</span>}

        <input
          {...props}
          id={id}
          type={type}
          className={`${styles.input} ${className}`}
          onKeyDown={(e) => {
            if (type === "number" && ["+", "-", "e", "E"].includes(e.key)) {
              e.preventDefault();
            }

            onKeyDown?.(e);
          }}
          onPaste={(e) => {
            if (type === "number") {
              const pastedValue = e.clipboardData.getData("text");

              if (!/^\d*\.?\d*$/.test(pastedValue)) {
                e.preventDefault();
              }
            }

            onPaste?.(e);
          }}
        />

        {endIcon && <span className={styles.icon}>{endIcon}</span>}
      </div>

      {!disableMessage && (
        <div className={styles.message}>
          {error ? (
            <span className={styles.errorText}>{error}</span>
          ) : helperText ? (
            <span className={styles.helperText}>{helperText}</span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Input;

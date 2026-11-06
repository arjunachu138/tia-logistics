import React from "react";
import styles from "./button.module.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  iconPosition?: "left" | "right";
  color?: "dark" | "light" | "outline" | "gray" | "ghost" | "green" | string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  icon,
  endIcon,
  iconPosition = "left",
  color = "primary",
  type = "button",
  onClick,
  className = "",
  children,
  style,
  ...restProps
}) => {
  const isPreset = [
    "primary",
    "secondary",
    "outline",
    "gray",
    "ghost",
    "green",
    "black",
  ].includes(color);
  const colorClass = isPreset ? styles[color as keyof typeof styles] : "";

  const customStyle: React.CSSProperties = {
    ...style,
    ...(!isPreset && color
      ? { backgroundColor: color, borderColor: color }
      : {}),
  };

  const leftIcon = iconPosition === "left" ? icon : null;
  const rightIcon = iconPosition === "right" ? icon : endIcon;

  return (
    <button
      type={type}
      className={`${styles.button} ${colorClass} ${className}`}
      style={customStyle}
      onClick={onClick}
      {...restProps}
    >
      {leftIcon && <span className={styles.iconWrapper}>{leftIcon}</span>}
      {title || children}
      {rightIcon && <span className={styles.iconWrapper}>{rightIcon}</span>}
    </button>
  );
};

export default Button;

import React from "react";
import { CircularProgress } from "@mui/material";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Loading...",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "360px",
        width: "100%",
        padding: "32px",
        boxSizing: "border-box",
        gap: "16px",
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: "var(--color-primary, #0052cc)",
        }}
      />
      {message && (
        <span
          style={{
            color: "var(--color-text-secondary, #6b7280)",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "var(--font-primary, sans-serif)",
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
};

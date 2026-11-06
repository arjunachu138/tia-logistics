import React from "react";

import styles from "./confirmModal.module.css";
import AppImage from "../appimage/appimage";
import { icons } from "../../assets/icons";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;

  buttons: React.ReactNode;

  onClose?: () => void;

  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title,
  message,
  buttons,
  onClose,
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  if (!open) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      closeOnOverlayClick &&
      event.target === event.currentTarget &&
      onClose
    ) {
      onClose();
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="confirmation-modal-title" className={styles.title}>
            {title}
          </h2>

          {showCloseButton && onClose && (
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
            >
              <AppImage iconPath={icons.CloseBlue} width="18" height="18" />
            </button>
          )}
        </div>

        {/* Message */}
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
          <div className={styles.footer}>{buttons}</div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

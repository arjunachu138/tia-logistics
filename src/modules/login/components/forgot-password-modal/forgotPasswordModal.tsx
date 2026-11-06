import React, { useState } from "react";
import styles from "./forgotPasswordModal.module.css";
import { icons } from "../../../../assets/icons";
import { AppImage, Button } from "../../../../components";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail("");
    setError(null);
    setIsSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("We couldn't find any account with this email id");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("We couldn't find any account with this email id");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (
        email.toLowerCase().includes("notfound") ||
        email.toLowerCase().includes("invalid")
      ) {
        setError("We couldn't find any account with this email id");
      } else {
        setIsSuccess(true);
      }
    }, 400);
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <Button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close modal"
          color="gost"
          icon={<AppImage iconPath={icons.X} width="24px" height="24px" />}
        />

        {isSuccess ? (
          <div className={styles.successContainer}>
            <div className={styles.successIconWrapper}>
              <AppImage
                iconPath={icons.GreenCheckIcon}
                height="24px"
                width="24px"
              />
            </div>
            <p className={styles.successMessage}>
              Password reset link has been sent successfully
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.title}>Forgot Password ?</h2>
            <p className={styles.subtitle}>
              Enter registered email address and we will mail you the password
              reset link
            </p>

            <div className={styles.fieldGroup}>
              <label htmlFor="forgot-email" className={styles.label}>
                Email ID
              </label>
              <input
                id="forgot-email"
                type="text"
                className={`${styles.input} ${error ? styles.inputError : ""}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder=""
                autoComplete="email"
                autoFocus
              />
              {error && (
                <div className={styles.errorAlert}>
                  <AppImage
                    iconPath={icons.ErrorIcon}
                    height="20px"
                    width="20px"
                  />
                  <span className={styles.errorText}>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

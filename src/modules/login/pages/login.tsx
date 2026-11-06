import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { images } from "../../../assets/images";
import ForgotPasswordModal from "../components/forgot-password-modal/forgotPasswordModal";
import styles from "./login.module.css";

import { AppImage, Button } from "../../../components";
import { FIELD_TYPES } from "../../../shared/form/fieldTypes";
import type { FieldData } from "../../../shared/form/types";
import AppFieldRender from "../../../components/formFields/AppFieldRender";
import { authService } from "../../../services/auth.service";
import { httpClient } from "../../../services/httpclient";
import { useAppDispatch } from "../../../store/hooks";
import { setUserDetails } from "../../../store/user/userSlice";
import { useToast } from "../../../components/toast/ToastProvider";

export interface FieldRef {
  runValidation: () => boolean;
}

const avatars = [
  {
    src: images.user1,
    alt: "User 1",
  },
  {
    src: images.user2,
    alt: "User 2",
  },
  {
    src: images.user3,
    alt: "User 3",
  },
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const emailRef = useRef<FieldRef>(null);
  const passwordRef = useRef<FieldRef>(null);

  const emailField: FieldData = {
    name: "username",
    type: FIELD_TYPES.TEXT,
    label: "Username or Email",
    placeholder: "Enter username or email",
    isRequired: true,
    checkValidation: [FIELD_TYPES.EMAIL],
    value: username,
  };

  const passwordField: FieldData = {
    name: "password",
    type: FIELD_TYPES.PASSWORD,
    label: "Password",
    placeholder: "Enter password",
    isRequired: true,
    errorLabel: "Password",
    value: password,
  };

  const handleFieldChange = (name: string, value: unknown) => {
    if (name === "username") {
      setUsername(String(value));
    }

    if (name === "password") {
      setPassword(String(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = emailRef.current?.runValidation() ?? false;
    const isPasswordValid = passwordRef.current?.runValidation() ?? false;

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await authService.login({ username, password });
      dispatch(setUserDetails(response));
      httpClient.setAuthorizationToken(response.token);
      navigate("/logistics/load-tenders");
    } catch (error) {
      setError("Invalid username or password");
      showToast(
        `${error instanceof Error ? error.message : "Login failed"}`,
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMicrosoftLogin = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      {/* ========================================
          LEFT / BOTTOM - LOGIN FORM
          ======================================== */}
      <main className={styles.loginPanel}>
        <div className={styles.loginContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Sign In</h1>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* Username / Email */}
            <div className={styles.formGroup}>
              <AppFieldRender
                field={emailField}
                onChange={handleFieldChange}
                ref={emailRef}
              />
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <AppFieldRender
                field={passwordField}
                onChange={handleFieldChange}
                ref={passwordRef}
              />
            </div>

            {/* Error */}
            {error && (
              <div className={styles.errorAlert}>
                <span className={styles.errorText}>{error}</span>
              </div>
            )}

            {/* Login */}
            <Button
              type="submit"
              color="primary"
              title={isSubmitting ? "Logging in..." : "Login"}
              className={styles.loginBtn}
              disabled={isSubmitting}
            />

            {/* Forgot Password */}
            <div className={styles.forgotPasswordRow}>
              <button
                type="button"
                className={styles.forgotPasswordLink}
                onClick={() => setIsForgotModalOpen(true)}
              >
                Forgot Password?
              </button>
            </div>

            {/* Divider */}
            <div className={styles.dividerContainer}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>Or sign in with</span>
              <div className={styles.dividerLineRight} />
            </div>

            {/* Microsoft Login */}
            <Button
              color="black"
              title="Login via Microsoft"
              className={styles.ssoBtn}
              onClick={handleMicrosoftLogin}
              icon={
                <AppImage
                  iconPath={images.microsoftLogo}
                  height="16px"
                  width="16px"
                />
              }
            />
          </form>
        </div>
      </main>

      {/* ========================================
          RIGHT / TOP - WELCOME / HERO
          ======================================== */}
      <aside className={styles.welcomePanel}>
        <img
          src={images.backgroundIllust}
          alt=""
          className={styles.welcomeBackground}
        />

        <div className={styles.welcomeContent}>
          <h2 className={styles.welcomeTitle}>Welcome to TiA</h2>

          <p className={styles.welcomeDescription}>
            Adopt an autonomous business model powered by agentic AI, where
            systems focus on goals and work with people to deliver measurable
            value - partner with Tangentia today.
          </p>

          <svg
            width="0"
            height="0"
            aria-hidden="true"
            style={{ position: "absolute" }}
          >
            <defs>
              <clipPath id="testimonialClip" clipPathUnits="objectBoundingBox">
                <path
                  d="
                    M 0.028 0
                    H 0.833

                    C 0.861 0 0.880 0.030 0.880 0.083
                    V 0.150

                    C 0.880 0.196 0.896 0.225 0.921 0.225
                    H 0.958
                    C 0.984 0.225 1 0.254 1 0.300

                    V 0.950
                    C 1 0.978 0.984 1 0.972 1

                    H 0.028
                    C 0.012 1 0 0.978 0 0.950

                    V 0.050
                    C 0 0.022 0.012 0 0.028 0
                    Z"
                />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.testimonialCard}>
            <p className={styles.quote}>
              “If you are looking for EDI, I would recommend Tangentia Gateway ”
            </p>

            <div className={styles.cardFooter}>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>
                  Ron Perry, General Manager,
                </span>
                <span className={styles.designation}>
                  National Home Products
                </span>
              </div>

              {/* Avatar Stack */}
              <div className={styles.avatarStack}>
                {avatars.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar.src}
                    alt={avatar.alt}
                    className={styles.avatarImg}
                    loading="lazy"
                  />
                ))}
                <div className={styles.avatarBadge}>+4</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};

export default Login;

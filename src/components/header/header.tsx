import React, { useState, useRef, useEffect } from "react";
import styles from "./header.module.css";
import {
  AppImage,
  AppText,
  Button,
  ConfirmationModal,
  ProfileModal,
} from "../index";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/logout";
import { icons } from "../../assets/icons";

export interface HeaderProps {
  title?: string;
  onLogout?: () => void;
  onToggleMobile?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = "Dashboard",
  onToggleMobile,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userDetails = useAppSelector((state) => state.user.userDetails);

  const handleOpenProfile = () => {
    setIsProfileModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setIsMenuOpen(false);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hideMenu = false;

  return (
    <header className={styles.header}>
      <div className={styles.titleWrapper}>
        <button
          type="button"
          className={styles.mobileMenuBtn}
          onClick={onToggleMobile}
          aria-label="Open navigation menu"
        >
          <AppImage width="24" height="24" iconPath={icons.Menu} />
        </button>
        <AppText type="maintitle">{title}</AppText>
      </div>

      <div className={styles.userMenuContainer} ref={containerRef}>
        <div
          className={styles.userButton}
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleMenu();
            }
          }}
        >
          <span className={styles.userAvatar}>
            <img src={icons.userProfile} alt="User profile" />
          </span>
          <span className={styles.userGroup}>
            {userDetails?.username || ""}
          </span>
          <span
            className={`${styles.chevron} ${isMenuOpen ? styles.chevronOpen : ""}`}
          >
            <AppImage width="20" height="20" iconPath={icons.downArrowIconB} />
          </span>
        </div>

        {isMenuOpen && !hideMenu && (
          <div className={styles.dropdownMenu}>
            <button
              type="button"
              className={styles.menuItemBtn}
              onClick={handleOpenProfile}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </button>

            <button
              type="button"
              className={`${styles.menuItemBtn} ${styles.logoutBtn}`}
              onClick={handleLogout}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <ProfileModal
        open={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onClose={() => setShowLogoutConfirm(false)}
        buttons={
          <>
            <Button
              title="Cancel"
              color="outline"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <Button title="Logout" color="primary" onClick={confirmLogout} />
          </>
        }
      />
    </header>
  );
};

export default Header;

import React, { useEffect } from "react";
import styles from "./ProfileModal.module.css";
import { useAppSelector } from "../../store/hooks";
import AppImage from "../appimage/appimage";
import { icons } from "../../assets/icons";
import { images } from "../../assets/images";

const SETTINGS_CONFIG: Record<
  string,
  { icon: string; width: string; height: string }
> = {
  "Advance Ship Notice": {
    icon: icons.shippingIconB,
    width: "20px",
    height: "20px",
  },
  "Purchase Order": {
    icon: icons.documentIconB,
    width: "16px",
    height: "20px",
  },
  "Supply Invoice": {
    icon: icons.invoiceDark,
    width: "20px",
    height: "20px",
  },
  "Delivery Forecast": {
    icon: icons.fileClockIconB,
    width: "20px",
    height: "20px",
  },
  "Load tender": {
    icon: icons.logiMenuB,
    width: "20px",
    height: "20px",
  },
};

export interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  userDetails?: {
    name?: string;
    subOrgName?: string;
    username?: string;
    headPersonName?: string;
    email?: string;
  };
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  onClose,
  userDetails: propUserDetails,
}) => {
  const reduxUserDetails = useAppSelector((state) => state.user.userDetails);
  console.log("user Details ", reduxUserDetails);

  const availableSettings = (reduxUserDetails?.settings ?? []).filter(
    (setting) => SETTINGS_CONFIG[setting.moduleName],
  );

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const displayName =
    propUserDetails?.name ||
    reduxUserDetails?.subOrglocation?.orgName ||
    reduxUserDetails?.name ||
    "Tangentia User";

  const displaySubName =
    propUserDetails?.subOrgName ||
    reduxUserDetails?.subOrglocation?.sOname ||
    displayName;

  const displayUsername =
    propUserDetails?.username ||
    reduxUserDetails?.username ||
    "Tangentia User Name";
  const contactName =
    propUserDetails?.headPersonName ||
    reduxUserDetails?.name ||
    reduxUserDetails?.subOrglocation?.headPersonName ||
    "Tangentia User";

  const displayEmail =
    propUserDetails?.email || reduxUserDetails?.email || "user@tangentia.com";

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-user-name"
      >
        {/* Close Button */}
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          <AppImage iconPath={icons.CloseBlue} width="14px" height="14px" />
        </button>

        {/* Hero Banner */}
        <div
          className={styles.heroBanner}
          style={{ backgroundImage: `url(${images.profileBanner})` }}
        >
          {/* Avatar Illustration */}
          <div className={styles.avatarContainer}>
            {reduxUserDetails?.subOrglocation?.orgLogo ? (
              <div className={styles.orgLogoContainer}>
                <AppImage
                  iconPath={reduxUserDetails.subOrglocation.soLogo}
                  width="80px"
                  height="80px"
                />
              </div>
            ) : (
              <AppImage
                iconPath={images.userAvatar}
                width="80px"
                height="80px"
              />
            )}
          </div>

          {/* User & Company Name */}
          <div className={styles.bannerText}>
            <h2 id="profile-user-name" className={styles.bannerName}>
              {contactName.trim().toUpperCase() === "NA"
                ? "Tangentia User"
                : contactName.toUpperCase()}
            </h2>
            <h3 className={styles.bannerName}>{displaySubName}</h3>
          </div>
        </div>

        {/* Contact Details */}
        <h4 className={styles.sectionTitle}>Contact Details</h4>
        <div className={styles.contactRow}>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>
              <AppImage
                iconPath={icons.userProfile}
                width="19px"
                height="19px"
              />
            </span>
            <span className={styles.contactText}>
              {displayUsername.trim().toUpperCase() === "NA"
                ? "Tangentia User"
                : displayUsername}
            </span>
          </div>

          <span className={styles.contactDivider}>|</span>

          <div className={styles.contactItem}>
            <AppImage iconPath={icons.emailIcon} width="19px" height="19px" />
            <span className={styles.contactEmailText}>{displayEmail}</span>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Settings */}

        <h4 className={styles.sectionTitle}>Settings</h4>

        <div className={styles.settingsList}>
          {availableSettings.map((setting, index) => {
            const config = SETTINGS_CONFIG[setting.moduleName];

            return (
              <div
                key={`${setting.moduleName}-${index}`}
                className={styles.settingItem}
              >
                <AppImage
                  iconPath={config.icon}
                  width={config.width}
                  height={config.height}
                />

                <span className={styles.settingText}>{setting.moduleName}</span>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Footer */}
        <div className={styles.footer}>
          <span>© Tangentia Gateway. </span>
          <a
            href="https://tangentia.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            -Tangentia.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

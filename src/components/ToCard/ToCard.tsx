import { icons } from "../../assets/icons";
import AppImage from "../appimage/appimage";
import styles from "./ToCard.module.css";

interface ToCardProps {
  title: string;
  subtitle?: string;
  details?: string;
}

const ToCard = ({ title, subtitle, details }: ToCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>
          <AppImage iconPath={icons.CarGreen} width="24" height="24" />
        </span>
        <span className={styles.cardTitle}>{title}</span>
      </div>
      <div className={styles.cardBody}>
        {subtitle && <p className={styles.name}>{subtitle}</p>}
        <p className={styles.address}>{details}</p>
      </div>
    </div>
  );
};

export default ToCard;

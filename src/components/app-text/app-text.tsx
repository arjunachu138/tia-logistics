import styles from "./app-text.module.css";

interface AppTextProps {
  type: "maintitle" | "pagetitle";
  children: React.ReactNode;
}

const AppText = ({ type, children }: AppTextProps) => {
  switch (type) {
    case "maintitle":
      return <h1 className={styles.title}>{children}</h1>;

    case "pagetitle":
      return <h2 className={styles.pagetitle}>{children}</h2>;

    default:
      return <p>{children}</p>;
  }
};

export default AppText;
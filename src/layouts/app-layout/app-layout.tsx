import { useState, useEffect } from "react";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import { Sidebar, Header } from "../../components";
import styles from "./app-layout.module.css";
import { icons } from "../../assets/icons";
import buttonBg from "../../assets/images/talktoeddie.svg";

interface MenuItem {
  id: string;
  label: string;
  path?: string;
  children?: MenuItem[];
  type?: "item" | "divider";
}
const navTitleMap: Record<string, string> = {
  "/logistics/load-tenders": "Load Tenders",
  "/logistics/load-tenders/probills/:id": "Probills",

  "/logistics/load-tenders/shipment-status/:id": "Shipment Status",
  "/logistics/load-tenders/shipment-status/:id/update": "Update Status",
  "/logistics/invoices": "Invoices",
  "/logistics/invoices/:id": "Invoice Details",
  "/logistics/configuration": "Trading Partner Configuration",
};
const menuIcons = {
  invoices: icons.invoiceIcon,
  "load-tenders": icons.logiMenu,
  configuration: icons.fileReportIcon,
};
const AppLayout = () => {
  // api data
  const apiResponse: MenuItem[] = [
    {
      id: "load-tenders",
      label: "Load Tenders",
      path: "/logistics/load-tenders",
    },
    {
      id: "invoices",
      label: "Invoices",
      path: "/logistics/invoices",
    },
    {
      id: "configuration",
      label: "Configuration",
      path: "/logistics/configuration",
    },
  ];
  // Menu Data with icons
  const menuData = apiResponse.map((item) => ({
    ...item,
    icon: menuIcons[item.id as keyof typeof menuIcons] ?? null,
    children:
      item.children && item.children.length > 0
        ? item.children.map((child) => ({
            ...child,
            icon: menuIcons[child.id as keyof typeof menuIcons] ?? null,
          }))
        : undefined,
  }));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const mainContent = document.querySelector(`.${styles.content}`);
    if (mainContent) {
      mainContent.scrollTop = 0;
    }

    setIsMobileDrawerOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen((prev) => !prev);
  };

  // const currentTitle = navTitleMap[location.pathname] || "";
  const currentTitle =
    navTitleMap[location.pathname] ??
    Object.entries(navTitleMap).find(
      ([pattern]) =>
        pattern.includes(":") &&
        matchPath({ path: pattern, end: true }, location.pathname),
    )?.[1] ??
    "";

  return (
    <div className={styles.layout}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        menuData={menuData}
        isMobileOpen={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
      />
      <div className={styles.mainContainer}>
        <Header title={currentTitle} onToggleMobile={toggleMobileDrawer} />
        <main className={styles.content}>
          <Outlet />
        </main>

        <button className={styles.outerCircle}>
          <div className={styles.innerCircle}>
            <div className={styles.innermostCircle}>
              <img src={buttonBg} alt="Glow" className={styles.bgImage} />
              <span className={styles.text}>Talk to Eddie</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AppLayout;

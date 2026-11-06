import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import styles from "./sidebar.module.css";
import { images } from "../../assets/images";
import { icons } from "../../assets/icons";

export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string | null;
  children?: MenuItem[];
  type?: "item" | "divider";
}

export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  menuData: MenuItem[];
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  menuData,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const location = useLocation();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    menuData.forEach((item) => {
      if (item.children?.some((child) => child.path === location.pathname)) {
        setOpenMenuId(item.id);
      }
    });

    setSelectedMenuId(null);
    setAnchorEl(null);
  }, [location.pathname, menuData]);

  const handleToggle = (id: string, event?: React.MouseEvent<HTMLElement>) => {
    if (isCollapsed && !isMobileOpen) {
      const clickedElement = event?.currentTarget;

      if (openMenuId === id) {
        setOpenMenuId(null);
        setSelectedMenuId(null);
        setAnchorEl(null);
      } else {
        setOpenMenuId(id);
        setSelectedMenuId(id);
        setAnchorEl(clickedElement ?? null);
      }

      return;
    }

    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleItemClick = () => {
    if (isMobileOpen) {
      onCloseMobile?.();
      return;
    }

    if (!isCollapsed) {
      onToggle();
    }
  };

  const showTooltip = isCollapsed && !isMobileOpen;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${styles.sidebar} ${
          isCollapsed ? styles.collapsed : ""
        } ${isMobileOpen ? styles.mobileOpen : ""}`}
      >
        <div className={styles.header}>
          {(!isCollapsed || isMobileOpen) && (
            <div className={styles.logoContainer}>
              <img src={images.primaryLogo} alt="tia" className={styles.logo} />
            </div>
          )}

          <button
            type="button"
            className={styles.toggleBtn}
            onClick={isMobileOpen ? onCloseMobile : onToggle}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <img
              src={icons.sidebarToggleIcon}
              className={styles.menuIcon}
              alt="Toggle Sidebar"
            />
          </button>
        </div>

        <div className={styles.divider} />

        <nav className={styles.nav}>
          {menuData.map((item) => {
            const isOpen = openMenuId === item.id;

            const hasActiveChild = item.children?.some(
              (child) => child.path === location.pathname,
            );

            const isAccordionActive =
              !!hasActiveChild || selectedMenuId === item.id;

            if (item.type === "divider") {
              return <div key={item.id} className={styles.divider} />;
            }

            if (item.children?.length) {
              const accordionButton = (
                <button
                  type="button"
                  className={`${styles.navItem} ${
                    isAccordionActive ? styles.accordionActive : ""
                  }`}
                  onClick={(event) => handleToggle(item.id, event)}
                >
                  <div className={styles.itemMain}>
                    <span className={styles.iconWrapper}>
                      {item.icon && (
                        <img
                          src={item.icon}
                          alt={item.label}
                          className={styles.menuIcon}
                        />
                      )}
                    </span>

                    {(!isCollapsed || isMobileOpen) && (
                      <span className={styles.label}>{item.label}</span>
                    )}
                  </div>

                  {(!isCollapsed || isMobileOpen) && (
                    <span
                      className={`${styles.chevron} ${
                        isOpen ? styles.chevronOpen : ""
                      }`}
                    >
                      <img
                        src={icons.downArrowIcon}
                        className={styles.iconWrapper}
                        alt=""
                      />
                    </span>
                  )}
                </button>
              );

              const accordionButtonWithTooltip = showTooltip ? (
                <Tooltip
                  title={item.label}
                  placement="right"
                  arrow
                  classes={{
                    tooltip: styles.tooltip,
                    arrow: styles.tooltipArrow,
                  }}
                >
                  <span className={styles.tooltipTrigger}>
                    {accordionButton}
                  </span>
                </Tooltip>
              ) : (
                accordionButton
              );

              return (
                <div key={item.id} className={styles.accordionGroup}>
                  {accordionButtonWithTooltip}

                  {isOpen && (!isCollapsed || isMobileOpen) && (
                    <div className={styles.subMenu}>
                      {item.children.map((child) => (
                        <NavLink
                          key={child.id}
                          to={child.path!}
                          className={({ isActive }) =>
                            `${styles.subNavItem} ${
                              isActive ? styles.subActive : ""
                            }`
                          }
                          onClick={handleItemClick}
                        >
                          <span className={styles.subLabel}>{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}

                  {isCollapsed && !isMobileOpen && isOpen && anchorEl && (
                    <Popper
                      open
                      anchorEl={anchorEl}
                      placement="right-start"
                      modifiers={[
                        {
                          name: "offset",
                          options: {
                            offset: [12, 0],
                          },
                        },
                      ]}
                      style={{ zIndex: 1500 }}
                    >
                      <ClickAwayListener
                        onClickAway={() => {
                          setOpenMenuId(null);
                          setSelectedMenuId(null);
                          setAnchorEl(null);
                        }}
                      >
                        <Paper
                          className={styles.collapsedSubMenu}
                          elevation={8}
                        >
                          <div className={styles.collapsedSubMenuHeader}>
                            {item.label}
                          </div>

                          {/* Divider */}
                          <div className={styles.collapsedSubMenuDivider} />

                          {item.children.map((child) => (
                            <NavLink
                              key={child.id}
                              to={child.path!}
                              className={({ isActive }) =>
                                `${styles.collapsedSubNavItem} ${
                                  isActive ? styles.collapsedSubActive : ""
                                }`
                              }
                              onClick={handleItemClick}
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </Paper>
                      </ClickAwayListener>
                    </Popper>
                  )}
                </div>
              );
            }

            const navItem = (
              <NavLink
                key={item.id}
                to={item.path!}
                end={item.path === "/"}
                className={({ isActive }) => {
                  const shouldBeActive = isActive && !selectedMenuId;
                  return `${styles.navItem} ${
                    shouldBeActive ? styles.active : ""
                  }`;
                }}
                onClick={handleItemClick}
              >
                <div className={styles.itemMain}>
                  <span className={styles.iconWrapper}>
                    {item.icon && (
                      <img
                        src={item.icon}
                        alt={item.label}
                        className={styles.menuIcon}
                      />
                    )}
                  </span>

                  {(!isCollapsed || isMobileOpen) && (
                    <span className={styles.label}>{item.label}</span>
                  )}
                </div>
              </NavLink>
            );

            if (showTooltip) {
              return (
                <Tooltip
                  key={item.id}
                  title={item.label}
                  placement="right"
                  arrow
                  classes={{
                    tooltip: styles.tooltip,
                    arrow: styles.tooltipArrow,
                  }}
                >
                  <span className={styles.tooltipTrigger}>{navItem}</span>
                </Tooltip>
              );
            }
            return navItem;
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

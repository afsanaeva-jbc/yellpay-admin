import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { SideBarItems } from "./sidebarItems";
import { useState, useEffect } from "react";

const expandedWidth = 250;
const collapsedWidth = 70;

interface SideBarProps {
  open: boolean;
}

const SideBar = ({ open }: SideBarProps) => {
  const sideBarItems = SideBarItems();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const handleParentListItemClick = (
    index: number,
    route: string | undefined,
    hasChildren: boolean,
    name: string,
    type: string,
  ) => {
    if (hasChildren) {
      setExpandedIndex(expandedIndex === index ? null : index);
    } else {
      if (route && name !== "" && type !== "") {
        navigate(route, { state: { type: type, name: name } });
      } else if (route) {
        navigate(route);
      }
      setSelectedIndex(index);
    }
  };

  const handleChildListItemClick = (
    parentIndex: number,
    route: string | undefined,
  ) => {
    if (route) {
      navigate(route);
    }
    setSelectedIndex(parentIndex);
  };

  const findRouteMatch = () => {
    for (let index = 0; index < sideBarItems.length; index++) {
      const item = sideBarItems[index];
      if (item.route === location.pathname) {
        return { parentIndex: index, isChild: false };
      }

      if (item.children && item.children.length > 0) {
        const childMatch = item.children.find(
          (child) => child.route === location.pathname,
        );
        if (childMatch) {
          return { parentIndex: index, isChild: true };
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const match = findRouteMatch();
    if (match) {
      setSelectedIndex(match.parentIndex);
      setExpandedIndex(match.isChild ? match.parentIndex : expandedIndex);
    } else {
      setSelectedIndex(null);
      setExpandedIndex(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Group items by section
  const mainMenuItems = sideBarItems.filter((item) => item.section === "main");
  const managementItems = sideBarItems.filter(
    (item) => item.section === "management",
  );
  const supportItems = sideBarItems.filter(
    (item) => item.section === "support",
  );
  const documentItems = sideBarItems.filter(
    (item) => item.section === "documents",
  );

  const renderMenuItems = (items: typeof sideBarItems, startIndex: number) => {
    return items.map((item, idx) => {
      const index = startIndex + idx;
      const isSelected = selectedIndex === index;

      return (
        <Box key={index}>
          <ListItem
            sx={{
              cursor: "pointer",
              position: "relative",
              borderRadius: "6px",
              mx: 1,
              ml: 0,
              pl: 1,
              mr: isSelected ? 2.5 : 1,
              mb: 0.5,
              backgroundColor: isSelected ? "#f3f4f6" : "transparent",
              "&:hover": {
                backgroundColor: isSelected ? "#e5e7eb" : "#f3f4f6",
              },
            }}
            onClick={() =>
              handleParentListItemClick(
                index,
                item.route,
                !!item.children,
                item?.name ?? "",
                item?.type ?? "",
              )
            }
          >
            <ListItemIcon
              sx={{
                color: isSelected ? "#111827" : "#1f2937",
                minWidth: "15px",
                mr: open ? 2 : 0,
              }}
            >
              {item.icon}
            </ListItemIcon>
            {open && (
              <Typography
                variant="body2"
                sx={{
                  color: isSelected ? "#111827" : "#1f2937",
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: "14px",
                }}
              >
                {item.text}
              </Typography>
            )}
          </ListItem>

          {item.children && item.children.length > 0 && (
            <Collapse
              in={expandedIndex === index && open}
              timeout="auto"
              unmountOnExit
            >
              {item.children.map((childItem, childIndex) => (
                <ListItem
                  key={childIndex}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    backgroundColor:
                      location.pathname === childItem.route
                        ? "#e5e7eb"
                        : "transparent",
                    borderRadius: "6px",
                    mx: 1,
                    mb: 0.5,
                    ml: 3,
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                  onClick={() =>
                    handleChildListItemClick(index, childItem.route)
                  }
                >
                  <ListItemIcon
                    sx={{
                      color:
                        location.pathname === childItem.route
                          ? "#111827"
                          : "#6b7280",
                      minWidth: "20px",
                      mr: 2,
                    }}
                  >
                    {childItem.icon}
                  </ListItemIcon>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        location.pathname === childItem.route
                          ? "#111827"
                          : "#4b5563",
                      fontWeight:
                        location.pathname === childItem.route ? 600 : 500,
                      fontSize: "13px",
                    }}
                  >
                    {childItem.text}
                  </Typography>
                </ListItem>
              ))}
            </Collapse>
          )}
        </Box>
      );
    });
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? expandedWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? expandedWidth : collapsedWidth,
          transition: "width 0.3s",
          boxSizing: "border-box",
          overflowX: "hidden",
          border: 0,
          backgroundColor: "#f9fafb",
          borderRight: "1px solid #e5e7eb",
          position: "fixed",
          height: "100vh",
          zIndex: 1200,
        },
      }}
    >
      {/* Logo Section  */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-start" : "center",
          py: 2,
          px: open ? 2 : 0,
          borderBottom: "1px solid #e5e7eb",
          minHeight: "64px", // Match navbar height
        }}
      >
        {open ? (
          <Box
            component="img"
            src="src/assets/loginBanner.png"
            alt="YellPay Logo"
            sx={{
              height: 70,
              width: "auto",
            }}
          />
        ) : (
          <Box
            component="img"
            src="src/assets/yellpayLogo.png"
            alt="YellPay Logo"
            sx={{
              height: 35,
              width: 35,
            }}
          />
        )}
      </Box>

      <List sx={{ mt: 1, px: 0, mx: 2 }}>
        {/* Main Menu Section */}
        <br />
        {open && (
          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 1,
              color: "#6b7280",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.05em",
            }}
          >
            Main Menu
          </Typography>
        )}
        {renderMenuItems(mainMenuItems, 0)}
        <br />
        {/* Management Section */}
        {managementItems.length > 0 && (
          <>
            {open && (
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 1,
                  color: "#6b7280",
                  fontWeight: 600,
                  fontSize: "12px",
                  letterSpacing: "0.05em",
                }}
              >
                Management
              </Typography>
            )}
            {renderMenuItems(managementItems, mainMenuItems.length)}
          </>
        )}
        <br />

        {/* Support Section */}
        {supportItems.length > 0 && (
          <>
            {open && (
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 1,
                  color: "#6b7280",
                  fontWeight: 600,
                  fontSize: "12px",
                  letterSpacing: "0.05em",
                }}
              >
                Support
              </Typography>
            )}
            {renderMenuItems(
              supportItems,
              mainMenuItems.length +
                managementItems.length +
                documentItems.length,
            )}
          </>
        )}
      </List>
      <Box>
        {open ? (
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              borderTop: "1px solid #e5e7eb",
              bottom: 0,
              left: 0,
              px: 2,
              py: 1,
              color: "#6b7280",
              fontWeight: 500,
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            v1.0.0 - Merchant Portal
          </Typography>
        ) : (
          <Typography variant="caption"></Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default SideBar;

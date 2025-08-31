import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import SideBar from "./Sidebar";
import { Box } from "@mui/material";
import theme from "../theme";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      {/* Sidebar*/}
      <SideBar open={sidebarOpen} />
      
      {/* Main content adjusts to sidebar */}
      <Box
        sx={{
          ml: sidebarOpen ? 30 : 7,
          transition: "margin 0.3s",
          minHeight: "100vh",
        }}
      >
        {/* Navbar */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Header */}
        <Box
          sx={{
            backgroundColor: theme.palette.grey[300],
            // py: 2,
            px: 6,
          }}
        >
          {/* <Typography variant="h5" component="h1" fontWeight="bold">
            Page Title
          </Typography> */}
        </Box>
        
        {/* Main content */}
        <Box
          sx={{
            pb: 5,
            pl: 3,
            pr: 3,
            minHeight: `calc(100vh - 13.3rem)`,
          }}
        >
          {children}
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
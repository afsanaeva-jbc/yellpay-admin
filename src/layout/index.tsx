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
      
      {/* Main content area that adjusts to sidebar */}
      <Box
        sx={{
          ml: sidebarOpen ? 25 : 7,
          transition: "margin 0.3s",
          minHeight: "100vh",
        }}
      >
        {/* Navbar - positioned relative to the main content area */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Header/Title area */}
        <Box
          sx={{
            backgroundColor: theme.palette.grey[300],
            py: 2,
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
            pb: 11.625,
            pt: 4,
            px: 3, // Add some padding for content
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
import React from "react";
import { FaBell } from "react-icons/fa";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <nav className="mx-auto">
      <div 
        className="relative flex h-16 items-center justify-between" 
        style={{ 
          
          padding: '0 1rem',
          borderBottom: '1px solid #e5e7eb' 
        }}
      >
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={handleSidebarToggle}
            aria-label="Toggle Sidebar"
            className="flex items-center justify-center w-8 h-8 text-gray-600  hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <TbLayoutSidebarLeftCollapse className="w-5 h-5" />
          </button>
        
        </div>

        {/* Language Dropdown */}
        <div className="flex items-center justify-end gap-4">
          <div className="relative flex items-center rounded-full bg-white text-[#D5242A] hover:text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none">
            <select
              title="Change Language"
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="border-none bg-transparent text-[#D5242A] focus:ring-0 focus:outline-none cursor-pointer hover:text-gray-900 uppercase font-bold"
              aria-label="Select Language"
            >
              <option value="en">EN</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pr-2">
            <button
              aria-label="Notifications"
              type="button"
              className="relative flex gap-2 items-center rounded-full bg-white py-2 px-4 text-[#D5242A] hover:text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none cursor-pointer"
            >
              <FaBell />
              <span className="hidden md:block">{t("notification")}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
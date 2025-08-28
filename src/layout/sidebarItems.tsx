import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard,
  BarChart3,
  Receipt,
  Users,
  FileBarChart,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useDispatch } from "react-redux";
import { ImExit } from "react-icons/im";
import {useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import { LuBuilding2 } from "react-icons/lu";

interface SideBarItem {
  icon: React.ReactNode;
  text: string;
  route?: string;
  isExpendable?: boolean;
  children?: SideBarItem[];
  type?: string;
  name?: string;
  section?: string;
}

export const SideBarItems = (): SideBarItem[] => {
  const { t } = useTranslation("sideBar");
   const dispatch = useDispatch();
  const navigate = useNavigate();
    const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return [
    // Main Menu Section
    {
      icon: <LayoutDashboard className="w-4 h-4"/>,
      text: t("dashboard"),
      route: '/dashboard',
      section: 'main'
    },
    {
      icon: <LuBuilding2 className="w-4 h-4"/>,
      text: t("merchants"),
      route: '/merchants',
      section: 'main'
    },
    {
      icon: <BarChart3 className="w-4 h-4"/>,
      text: t("analytics"),
      route: '/analytics',
      section: 'main'
    },
    {
      icon: <Receipt className="w-4 h-4"/>,
      text: t("transactions"),
      route: '/transactions',
      section: 'main'
    },
    
    // Management Section
    {
      icon: <Users className="w-4 h-4"/>,
      text: t("users"),
      route: '/users',
      section: 'management'
    },
    {
      icon: <FileBarChart className="w-4 h-4"/>,
      text: t("reports"),
      route: '/reports',
      section: 'management'
    },
    {
      icon: <Settings className="w-4 h-4"/>,
      text: t("settings"),
      route: '/settings',
      section: 'management'
    },
    
    // Support Section
    {
      icon: <HelpCircle className="w-4 h-4"/>,
      text: t("help_center"),
      route: '/help',
      section: 'support'
    },

     {
      icon: <ImExit className="w-4 h-4"   onClick={handleLogout}/>,
      text: t("logout"),
      route: '/help',
      section: 'support'
    }
  ];
}
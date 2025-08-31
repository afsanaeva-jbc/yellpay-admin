import React from "react";
import DashboardCards from "./DashboardCards";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

const Dashboard: React.FC = () => {
const { t } = useTranslation("sideBar");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("dashboard")}</h1>
        <Typography className="text-gray-600">
         Welcome back! Here's an overview of your merchant portal.
        </Typography>
      </div>
      
     <DashboardCards />
    </div>
  );
};

export default Dashboard;

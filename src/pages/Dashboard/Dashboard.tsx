import React from "react";
import DashboardTable from "./DashboardTable";
import { useTranslation } from "react-i18next";

// Define the data type based on what DashboardTable expects
type DashboardData = {
  name: string;
  description: string;
  advisor: { name: string };
  membersCount: number;
  established: string;
  category: string;
};

const Dashboard: React.FC = () => {
const { t } = useTranslation("sideBar");

  // Dummy data for the table
  const dummyDashboardData: DashboardData[] = [
    {
      name: "Photography Dashboard",
      description: "A Dashboard dedicated to capturing beautiful moments and learning photography techniques.",
      advisor: { name: "John Smith" },
      membersCount: 45,
      established: "2020",
      category: "Arts"
    },
    {
      name: "Debate Society",
      description: "Enhancing critical thinking and public speaking skills through competitive debates.",
      advisor: { name: "Sarah Johnson" },
      membersCount: 32,
      established: "2018",
      category: "Academic"
    },
    {
      name: "Environmental Dashboard",
      description: "Promoting sustainability and environmental awareness on campus.",
      advisor: { name: "Mike Davis" },
      membersCount: 28,
      established: "2019",
      category: "Service"
    },
    {
      name: "Chess Dashboard",
      description: "Strategic thinking and competitive chess playing for all skill levels.",
      advisor: { name: "Emma Wilson" },
      membersCount: 18,
      established: "2021",
      category: "Games"
    },
    {
      name: "Robotics Team",
      description: "Building and programming robots for competitions and learning.",
      advisor: { name: "Dr. Robert Lee" },
      membersCount: 25,
      established: "2017",
      category: "Technology"
    },
    {
      name: "Drama Dashboard",
      description: "Performing arts, theater productions, and creative expression through acting.",
      advisor: { name: "Lisa Brown" },
      membersCount: 38,
      established: "2016",
      category: "Arts"
    }
  ];

  // Define table headers
  const tableHeaders = [
    { text: "Name", key: "name" as keyof DashboardData },
    { text: "Description", key: "description" as keyof DashboardData },
    { text: "Advisor", key: "advisor" as keyof DashboardData },
    { text: "Members", key: "membersCount" as keyof DashboardData },
    { text: "Established", key: "established" as keyof DashboardData },
    { text: "Category", key: "category" as keyof DashboardData }
  ];

  // Define actions for each row
  const Actions = (item: DashboardData) => [
    <button
      key="view"
      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
      onClick={() => console.log("View", item.name)}
    >
      View
    </button>,
    <button
      key="edit"
      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
      onClick={() => console.log("Edit", item.name)}
    >
      Edit
    </button>,
    <button
      key="delete"
      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
      onClick={() => console.log("Delete", item.name)}
    >
      Delete
    </button>
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("dashboard")}</h1>
      </div>
      
      <DashboardTable
        tableHead={tableHeaders}
        data={dummyDashboardData}
        Actions={Actions}
        loading={false} 
      />
    </div>
  );
};

export default Dashboard;

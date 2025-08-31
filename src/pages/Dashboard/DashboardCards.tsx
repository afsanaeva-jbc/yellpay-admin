import { LuBuilding2 } from "react-icons/lu";
import DynamicCard, { ActivityItem, ActionItem } from "../../components/common/DynamicCard";
import {
  Users,
  BarChart3,TrendingUp
} from "lucide-react";

export default function DashboardCards() {
  // Sample data for activity card
  const recentActivities: ActivityItem[] = [
    {
      title: "New merchant registration: TechCorp Solutions",
      time: "2 minutes ago",
      status: "new" as const,
    },
    {
      title: "Payment processed for Order #12845",
      time: "5 minutes ago",
      status: "completed" as const,
    },
    {
      title: "User profile updated: john.doe@example.com",
      time: "12 minutes ago",
      status: "updated" as const,
    },
    {
      title: "New subscription activated: Premium Plan",
      time: "1 hour ago",
      status: "new" as const,
    },
    {
      title: "System maintenance completed",
      time: "3 hours ago",
      status: "completed" as const,
    },
  ];

  // Sample data for actions card
  const quickActions: ActionItem[] = [
    {
      title: "Add New Merchant",
      description: "Register a new merchant in the system",
    },
    {
      title: "Generate Report",
      description: "Create monthly performance report",
    },
    {
      title: "Review Pending",
      description: "Check merchants awaiting approval",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DynamicCard
          type="metric"
          title="Total Merchants"
          value="156"
          change="+12%"
          changeType="positive"
          icon={<LuBuilding2 className="w-5 h-5" />}
        />

        <DynamicCard
          type="metric"
          title="Active Users"
          value="2,432"
          change="+8%"
          changeType="positive"
          icon={<Users className="w-5 h-5" />}
        />

        <DynamicCard
          type="metric"
          title="Revenue"
          value="$45,231"
          change="+23%"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
        />

        <DynamicCard
          type="metric"
          title="Growth Rate"
          value="15.3%"
          change="+2.1%"
          changeType="positive"
          icon={<BarChart3 className="w-5 h-5" />}
        />
      </div>

      {/* Activity and Actions Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Card */}
        <DynamicCard
          type="activity"
          title="Recent Activity"
          items={recentActivities}
        />

        {/* Actions Card */}
        <DynamicCard
          type="actions"
          title="Quick Actions"
          actions={quickActions}
        />
      </div>
    </div>
  );
}
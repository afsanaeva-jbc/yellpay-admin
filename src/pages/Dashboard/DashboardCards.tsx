import { LuBuilding2 } from "react-icons/lu";
import DynamicCard, {
  ActivityItem,
  ActionItem,
} from "../../components/common/DynamicCard";
import { Users, BarChart3, TrendingUp } from "lucide-react";
import PageWrapper from "../../layout/PageWrapper";
import { useTranslation } from "react-i18next";

export default function DashboardCards() {
  const { t } = useTranslation("dashBoard");
  // Sample data for activity card
  const recentActivities: ActivityItem[] = [
    {
      title: "加盟店が更新されました: フレッシュマーケット",
      time: `5 ${t("hour-ago")}`,
      status: "completed" as const,
    },
    {
      title: "加盟店が無効化されました: 旧商店会社",
      time: `12 ${t("hour-ago")}`,
      status: "updated" as const,
    },
    {
      title: "新しい加盟店が登録されました: 株式会社テックソリューションズ",
      time: `12 ${t("day-ago")}`,
      status: "new" as const,
    },
  ];

  // Sample data for actions card
  const quickActions: ActionItem[] = [
    {
      title: t("add-new-merchant"),
      description: t("register-new-merchant"),
    },
    {
      title: t("generate-report"),
      description: t("create-performance-reports"),
    },
    {
      title: t("review-pending"),
      description: t("review-pending-approvals"),
    },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Metrics Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DynamicCard
            type="metric"
            title={t("total-merchants")}
            value="156"
            change="+12%"
            changeType="positive"
            timeframe={t("from-last-month")}
            icon={<LuBuilding2 className="w-5 h-5" />}
          />

          <DynamicCard
            type="metric"
            title={t("active-users")}
            value="2,432"
            change="+8%"
            changeType="positive"
            timeframe={t("from-last-month")}
            icon={<Users className="w-5 h-5" />}
          />

          <DynamicCard
            type="metric"
            title={t("revenue")}
            value="¥45,231"
            change="+23%"
            changeType="positive"
            timeframe={t("from-last-month")}
            icon={<TrendingUp className="w-5 h-5" />}
          />

          <DynamicCard
            type="metric"
            title={t("growth-rate")}
            value="15.3%"
            change="+2.1%"
            changeType="positive"
            timeframe={t("from-last-month")}
            icon={<BarChart3 className="w-5 h-5" />}
          />
        </div>

        {/* Activity and Actions Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Card */}
          <DynamicCard
            type="activity"
            title={t("recent-activity")}
            items={recentActivities}
          />

          {/* Actions Card */}
          <DynamicCard
            type="actions"
            title={t("quick-actions")}
            actions={quickActions}
          />
        </div>
      </div>
    </PageWrapper>
  );
}

import React from 'react';
import {  LucideIcon } from 'lucide-react';

export interface ActivityItem {
  title: string;
  time: string;
  status: 'new' | 'updated' | 'completed';
}

export interface ActionItem {
  title: string;
  description?: string;
}

interface DynamicCardProps {
  type?: 'metric' | 'activity' | 'actions';
  title: string;
  value?: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  timeframe?: string;
  icon?: React.ReactElement<LucideIcon>;
  items?: ActivityItem[];
  actions?: ActionItem[];
  className?: string;
  width?: string;
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  type = 'metric',
  title,
  value,
  change,
  // changeType = 'positive',
  timeframe = 'from last month',
  icon,
  items = [],
  actions = [],
  className = '',
  width = 'w-full'
}) => {
  // const getChangeColor = (changeType: 'positive' | 'negative' | 'neutral'): string => {
  //   switch (changeType) {
  //     case 'positive':
  //       return 'text-green-600';
  //     case 'negative':
  //       return 'text-red-600';
  //     default:
  //       return 'text-gray-600';
  //   }
  // };

  // const getTrendIcon = (changeType: 'positive' | 'negative' | 'neutral'): React.ReactElement => {
  //   return changeType === 'positive' ? 
  //     <TrendingUp className="w-3 h-3" /> : 
  //     <TrendingDown className="w-3 h-3" />;
  // };

  const getStatusColor = (status: ActivityItem['status']): string => {
    switch (status) {
      case 'new':
      case 'updated':
        return 'bg-red-500';
      case 'completed':
      default:
        return 'bg-gray-300';
    }
  };

  // Metric Card Design (for Total Merchants, Active Users, Revenue, Growth Rate)
  const renderMetricCard = (): React.ReactElement => (
    <div className={`${width} bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {change && (
          <div className={`flex items-center gap-1 text-sm`}>
            <span className="font-medium bg-gray-200 px-2 py-0.5 rounded">{change}</span>
            <span className="text-gray-500 font-normal">{timeframe}</span>
          </div>
        )}
      </div>
    </div>
  );

  // Activity Card Design (for Recent Activity)
  const renderActivityCard = (): React.ReactElement => (
    <div className={`${width} bg-white rounded-xl  border border-gray-200 p-6 hover:shadow-sm transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getStatusColor(item.status)}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 leading-relaxed">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Actions Card Design (for Quick Actions)
  const renderActionsCard = (): React.ReactElement => (
    <div className={`${width} bg-white rounded-xl  border border-gray-200 p-6 hover:shadow-sm transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <div 
            key={index} 
            className="group cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="text-md font-semibold text-gray-900 ">
                  {action.title}
                </h4>
                {action.description && (
                  <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  switch (type) {
    case 'activity':
      return renderActivityCard();
    case 'actions':
      return renderActionsCard();
    default:
      return renderMetricCard();
  }
};

export default DynamicCard;
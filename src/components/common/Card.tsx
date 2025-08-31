import { TrendingUp, TrendingDown } from 'lucide-react';

const DynamicCard = ({
  type = 'metric',
  title,
  value,
  change,
  changeType = 'positive',
  timeframe = 'from last month',
  icon,
  items = [],
  actions = [],
  className = '',
  width = 'w-full'
}) => {
  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (changeType) => {
    return changeType === 'positive' ? 
      <TrendingUp className="w-3 h-3" /> : 
      <TrendingDown className="w-3 h-3" />;
  };

  // Metric Card Design (for Total Merchants, Active Users, Revenue, Growth Rate)
  const renderMetricCard = () => (
    <div className={`${width} bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-sm font-normal text-gray-500">{title}</h3>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
      <div className="space-y-3">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${getChangeColor(changeType)}`}>
            <span className="font-medium">{change}</span>
            <span className="text-gray-400 font-normal">{timeframe}</span>
          </div>
        )}
      </div>
    </div>
  );

  // Activity Card Design (for Recent Activity)
  const renderActivityCard = () => (
    <div className={`${width} bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${className}`}>
      <h3 className="text-base font-medium text-gray-900 mb-6">{title}</h3>
      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              item.status === 'new' ? 'bg-red-500' : 
              item.status === 'updated' ? 'bg-red-500' : 
              'bg-gray-300'
            }`} />
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
  const renderActionsCard = () => (
    <div className={`${width} bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${className}`}>
      <h3 className="text-base font-medium text-gray-900 mb-6">{title}</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <div key={index} className="group cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h4>
                {action.description && (
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
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
import React from 'react';
import { Button, Avatar, Chip } from '@mui/material';
import BackButton from "../common/Button"

// Dynamic field interfaces
export interface DynamicField {
  key: string;
  label: string;
  value: string | number | boolean;
  type?: 'text' | 'email' | 'phone' | 'url' | 'date' | 'currency';
  displayFormat?: (value: any) => string;
}

export interface ContactInfo {
  fields: DynamicField[];
}

export interface Address {
  fields: DynamicField[];
}

export interface BusinessInfo {
  fields: DynamicField[];
}

export interface QuickStat {
  key: string;
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  displayFormat?: (value: any) => string;
  icon?: React.ReactElement;
  showAsChip?: boolean; // New property to control chip display
}

export interface DetailsField {
  key: string;
  label: string;
  value: string | number | boolean;
  type?: 'text' | 'email' | 'phone' | 'url' | 'date' | 'currency' | 'boolean';
  displayFormat?: (value: any) => string;
  copyable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export interface DetailsSection {
  key: string;
  title: string;
  icon?: React.ReactElement;
  fields: DetailsField[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

interface DetailsViewProps {
  // Header props
  onBack: () => void;
  backButtonLabel?: string;
  title: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactElement;
    variant?: 'contained' | 'outlined' | 'text';
    color?: string;
  };
  secondaryActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactElement;
    variant?: 'contained' | 'outlined' | 'text';
  }>;
  
  // Entity info
  entityName: string;
  entityInitials?: string;
  entityAvatar?: string;
  status?: {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'error';
    icon?: React.ReactElement;
  };
  tags?: Array<{
    key: string;
    label: string;
    variant?: 'default' | 'primary' | 'secondary';
    color?: string;
    icon?: React.ReactElement;
    removable?: boolean;
    onRemove?: () => void;
  }>;
  
  quickStats?: QuickStat[];
  sections: DetailsSection[];
  description?: string;
  contactInfo?: ContactInfo;
  address?: Address;
  businessInfo?: BusinessInfo;
  
  // Layout options
  layout?: 'default' | 'compact' | 'wide';
  showQuickStats?: boolean;
  
  className?: string;
}

const DetailsView: React.FC<DetailsViewProps> = ({
  onBack,
  backButtonLabel = "Back",
  title,
  primaryAction,
  secondaryActions = [],
  entityName,
  entityInitials,
  entityAvatar,
  status,
  tags = [],
  quickStats = [],
  sections = [],
  description,
  contactInfo,
  address,
  businessInfo,
  layout = 'default',
  showQuickStats = true,
  className = ""
}) => {
  const getStatusColor = (variant: string): ChipColor => {
    switch (variant) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getQuickStatChipColor = (variant: string): string => {
    switch (variant) {
      case 'success':
        return '!bg-green-100 !text-green-800';
      case 'warning':
        return '!bg-yellow-100 !text-yellow-800';
      case 'error':
        return '!bg-red-100 !text-red-800';
      default:
        return '!bg-gray-100 !text-gray-800';
    }
  };

  const formatFieldValue = (field: DetailsField | DynamicField): string => {
    if (field.displayFormat) {
      return field.displayFormat(field.value);
    }

    switch (field.type) {
      case 'email':
        return String(field.value);
      case 'phone':
        return String(field.value);
      case 'url':
        return String(field.value);
      case 'date':
        return new Date(field.value as string).toLocaleDateString();
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(Number(field.value));
      case 'boolean':
        return field.value ? 'Yes' : 'No';
      default:
        return String(field.value);
    }
  };

  const handleFieldClick = (field: DetailsField) => {
    if (field.onClick) {
      field.onClick();
    } else if (field.type === 'email') {
      window.open(`mailto:${field.value}`);
    } else if (field.type === 'phone') {
      window.open(`tel:${field.value}`);
    } else if (field.type === 'url') {
      window.open(String(field.value), '_blank');
    }
  };

  const isFieldClickable = (field: DetailsField): boolean => {
    return field.clickable || field.onClick !== undefined || ['email', 'phone', 'url'].includes(field.type || '');
  };

  const gridCols = layout === 'wide' ? 'lg:grid-cols-5' : showQuickStats ? 'lg:grid-cols-4' : 'lg:grid-cols-1';
  const mainContentCols = layout === 'wide' ? 'lg:col-span-4' : showQuickStats ? 'lg:col-span-3' : 'lg:col-span-1';

  // Create built-in sections from dynamic data
  const builtInSections: DetailsSection[] = [];
  
  if (contactInfo?.fields.length) {
    builtInSections.push({
      key: 'contact-info',
      title: 'Contact Information',
      fields: contactInfo.fields.map(field => ({
        key: field.key,
        label: field.label,
        value: field.value,
        type: field.type,
        displayFormat: field.displayFormat,
        clickable: ['email', 'phone'].includes(field.type || '')
      }))
    });
  }

  if (address?.fields.length) {
    builtInSections.push({
      key: 'address',
      title: 'Address',
      fields: address.fields.map(field => ({
        key: field.key,
        label: field.label,
        value: field.value,
        type: field.type,
        displayFormat: field.displayFormat
      }))
    });
  }

  if (businessInfo?.fields.length) {
    builtInSections.push({
      key: 'business-info',
      title: 'Business Information',
      fields: businessInfo.fields.map(field => ({
        key: field.key,
        label: field.label,
        value: field.value,
        type: field.type,
        displayFormat: field.displayFormat
      }))
    });
  }

  const allSections = [...builtInSections, ...sections];

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Header */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} label={backButtonLabel} type={'Back'} />
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {secondaryActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  startIcon={action.icon}
                  variant={action.variant || 'outlined'}
                  className="!normal-case !font-medium !rounded-lg"
                >
                  {action.label}
                </Button>
              ))}
              {primaryAction && (
                <Button
                  onClick={primaryAction.onClick}
                  startIcon={primaryAction.icon}
                  variant={primaryAction.variant || 'contained'}
                  className={`${primaryAction.color || '!bg-red-600 hover:!bg-red-700'} !normal-case !font-medium !rounded-lg`}
                >
                  {primaryAction.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {/* Main Content */}
          <div className={`${mainContentCols} space-y-2 border-gray-200 border rounded-xl`}>
            {/* Entity Header */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <Avatar
                  src={entityAvatar}
                  className="!w-16 !h-16 !text-xl !font-semibold !bg-gray-200 !text-gray-700"
                >
                  {entityInitials || entityName.charAt(0)}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {entityName}
                      </h2>
                      <div className="flex items-center gap-2 flex-wrap">
                        {status && (
                          <div className="flex items-center gap-1">
                            {status.icon}
                            <Chip
                              label={status.label}
                              color={getStatusColor(status.variant)}
                              size="small"
                              className="!font-medium"
                            />
                          </div>
                        )}
                        {tags.map((tag) => (
                          <div key={tag.key} className="flex items-center gap-1">
                            {tag.icon}
                            <Chip
                              label={tag.label}
                              variant="outlined"
                              size="small"
                              className="!border-gray-300"
                              onDelete={tag.removable ? tag.onRemove : undefined}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections */}
            {allSections.map((section) => (
              <div key={section.key} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  {section.icon && (
                    <div className="text-gray-400">
                      {section.icon}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field) => (
                    <div key={field.key}>
                      <dt className="text-sm font-medium text-gray-500 mb-1">
                        {field.label}
                      </dt>
                      <dd 
                        className={`text-base text-gray-900 font-medium ${
                          isFieldClickable(field) ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''
                        }`}
                        onClick={() => isFieldClickable(field) && handleFieldClick(field)}
                      >
                        {formatFieldValue(field)}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Description */}
            {description && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Description
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {showQuickStats && quickStats.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  {quickStats.map((stat) => (
                    <div key={stat.key} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {stat.icon && <div className="text-gray-400">{stat.icon}</div>}
                        <span className="text-sm text-gray-500">{stat.label}</span>
                      </div>
                      {stat.showAsChip ? (
                        <Chip
                          label={stat.displayFormat ? stat.displayFormat(stat.value) : stat.value}
                          size="small"
                          className={`!font-medium ${getQuickStatChipColor(stat.variant || 'default')}`}
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {stat.displayFormat ? stat.displayFormat(stat.value) : stat.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsView;
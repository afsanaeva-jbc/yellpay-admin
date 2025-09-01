import React from 'react';
import { Button, Avatar, Chip } from '@mui/material';
import BackButton from "../common/Button"

export interface ContactInfo {
  email?: string;
  phone?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  full?: string;
}

export interface BusinessInfo {
  type?: string;
  registrationDate?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface QuickStat {
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export interface DetailsField {
  label: string;
  value: string | number;
}

export interface DetailsSection {
  title: string;
  icon?: React.ReactElement;
  fields: DetailsField[];
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
  };
  
  // Entity info
  entityName: string;
  entityInitials?: string;
  entityAvatar?: string;
  status?: {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'error';
  };
  tags?: Array<{
    label: string;
    variant?: 'default' | 'primary' | 'secondary';
  }>;
  
  // Quick stats (right sidebar)
  quickStats?: QuickStat[];
  
  // Main content sections
  sections: DetailsSection[];
  
  // Description
  description?: string;
  
  className?: string;
}

const DetailsView: React.FC<DetailsViewProps> = ({
  onBack,
  backButtonLabel = "Back",
  title,
  primaryAction,
  entityName,
  entityInitials,
  entityAvatar,
  status,
  tags = [],
  quickStats = [],
  sections = [],
  description,
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

  return (
    <div className={`min-h-screen${className}` }>
      {/* Header */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 ">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} label={backButtonLabel} type={'Back'} />
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                startIcon={primaryAction.icon}
                variant="contained"
                className="!bg-red-600 hover:!bg-red-700 !normal-case !font-medium !rounded-lg"
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-2 border-gray-200 border-1 rounded-xl ">
            {/* Entity Header */}
            <div className=" p-6">
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
                          <Chip
                            label={status.label}
                            color={getStatusColor(status.variant)}
                            size="small"
                            className="!font-medium"
                          />
                        )}
                        {tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag.label}
                            variant="outlined"
                            size="small"
                            className="!border-gray-300"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections */}
            {sections.map((section, index) => (
              <div key={index} className="p-6">
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
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex}>
                      <dt className="text-sm font-medium text-gray-500 mb-1">
                        {field.label}
                      </dt>
                      <dd className="text-base text-gray-900 font-medium">
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Description */}
            {description && (
              <div className=" p-6">
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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Quick Stats
              </h3>
              <div className="space-y-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <Chip
                      label={stat.value}
                      size="small"
                      className={`!font-medium ${getQuickStatChipColor(stat.variant || 'default')}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;
import React from 'react';
import { Mail, MapPin, Building, Edit } from 'lucide-react';
import DetailsView from "../../components/common/DetailsViewComponent"
import { useNavigate } from "react-router-dom";

const MerchantDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/merchants"); 
    console.log('Navigating back to merchants');
  };

  const handleEdit = () => {
    // Navigate to edit merchant page
    console.log('Navigating to edit merchant');
  };

  // Sample data for the merchant
  const merchantData = {
    entityName: "Tech Solutions Inc.",
    entityInitials: "TS",
    status: {
      label: "active",
      variant: "success" as const
    },
    tags: [
      { 
        key: "service-tag",
        label: "Service" 
      }
    ],
    quickStats: [
      {
        key: "status",
        label: "Status",
        value: "active",
        variant: "success" as const,
        showAsChip: true // This will show as a chip
      },
      {
        key: "member-since",
        label: "Member Since",
        value: "January 15, 2024",
        showAsChip: false // This will show as plain text
      },
      {
        key: "business-type",
        label: "Business Type",
        value: "Service",
        showAsChip: false // This will show as plain text
      }
    ],
    sections: [
      {
        key: "contact-info",
        title: "Contact Information",
        icon: <Mail className="w-5 h-5" />,
        fields: [
          {
            key: "email",
            label: "Email",
            value: "contact@techsolutions.com",
            type: "email" as const
          },
          {
            key: "phone",
            label: "Phone",
            value: "+1 (555) 123-4567",
            type: "phone" as const
          }
        ]
      },
      {
        key: "address",
        title: "Address",
        icon: <MapPin className="w-5 h-5" />,
        fields: [
          {
            key: "street-address",
            label: "Street Address",
            value: "123 Business Ave, Tech City, TC 12345",
            type: "text" as const
          }
        ]
      },
      {
        key: "business-info",
        title: "Business Information",
        icon: <Building className="w-5 h-5" />,
        fields: [
          {
            key: "business-type",
            label: "Business Type",
            value: "Service",
            type: "text" as const
          },
          {
            key: "registration-date",
            label: "Registration Date",
            value: "January 15, 2024",
            type: "date" as const
          }
        ]
      }
    ],
    description: "Leading provider of IT solutions and consulting services for small and medium businesses."
  };

  return (
    <DetailsView
      onBack={handleBack}
      backButtonLabel="Back to Merchants"
      title="Merchant Details"
      primaryAction={{
        label: "Edit Merchant",
        onClick: handleEdit,
        icon: <Edit className="w-4 h-4" />
      }}
      entityName={merchantData.entityName}
      entityInitials={merchantData.entityInitials}
      status={merchantData.status}
      tags={merchantData.tags}
      quickStats={merchantData.quickStats}
      sections={merchantData.sections}
      description={merchantData.description}
    />
  );
};

export default MerchantDetailsPage;
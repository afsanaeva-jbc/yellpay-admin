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
      { label: "Service" }
    ],
    quickStats: [
      {
        label: "Status",
        value: "active",
        variant: "success" as const
      },
      {
        label: "Member Since",
        value: "January 15, 2024"
      },
      {
        label: "Business Type",
        value: "Service"
      }
    ],
    sections: [
      {
        title: "Contact Information",
        icon: <Mail className="w-5 h-5" />,
        fields: [
          {
            label: "Email",
            value: "contact@techsolutions.com"
          },
          {
            label: "Phone",
            value: "+1 (555) 123-4567"
          }
        ]
      },
      {
        title: "Address",
        icon: <MapPin className="w-5 h-5" />,
        fields: [
          {
            label: "Street Address",
            value: "123 Business Ave, Tech City, TC 12345"
          }
        ]
      },
      {
        title: "Business Information",
        icon: <Building className="w-5 h-5" />,
        fields: [
          {
            label: "Business Type",
            value: "Service"
          },
          {
            label: "Registration Date",
            value: "January 15, 2024"
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
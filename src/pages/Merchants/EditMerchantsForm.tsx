import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';
import { PropagateLoader } from 'react-spinners';
import DynamicForm, { FormConfig } from "../../components/common/DynamicForm";
import axiosInstance from "../../axios/axiosInstance"
import Loading from '../../components/common/Loading';

// Merchant interface
interface Merchant {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  address: string;
  status: string;
  description?: string;
  logoUrl?: string;
}

// Form data interface
interface MerchantFormData {
  logo?: FileList;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  address: string;
  status: string;
  description: string;
}

interface EditMerchantFormProps {
  merchantId: string;
  merchantData?: Merchant | null;
}

const EditMerchantForm: React.FC<EditMerchantFormProps> = ({ 
  merchantId, 
  merchantData 
}) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!merchantData);
  const [merchant, setMerchant] = useState<Merchant | null>(merchantData || null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState, setValue, reset } = useForm<MerchantFormData>({
    defaultValues: {
      businessName: '',
      email: '',
      phone: '',
      businessType: '',
      address: '',
      status: 'active',
      description: ''
    },
    mode: 'onChange'
  });
  
  const { errors, isValid } = formState;

  // Fetch merchant data if not provided
  useEffect(() => {
    const fetchMerchant = async () => {
      if (merchantData) {
        setMerchant(merchantData);
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);
        const response = await axiosInstance.get(`/merchants/${merchantId}`);
        setMerchant(response.data.merchant || response.data);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const apiError = error.response?.data;
          toast.error(apiError?.message || 'Failed to fetch merchant data');
        } else {
          console.error('Unexpected error:', error);
          toast.error('Failed to fetch merchant data');
        }
        navigate('/merchants'); // Redirect on error
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMerchant();
  }, [merchantId, merchantData, navigate]);

  // Populate form when merchant data is available
  useEffect(() => {
    if (merchant) {
      reset({
        businessName: merchant.businessName || '',
        email: merchant.email || '',
        phone: merchant.phone || '',
        businessType: merchant.businessType || '',
        address: merchant.address || '',
        status: merchant.status || 'active',
        description: merchant.description || ''
      });
    }
  }, [merchant, reset]);

  // Show loading spinner while fetching initial data
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <PropagateLoader color="#32479C" />
      </div>
    );
  }

  // Show error if merchant not found
  if (!merchant) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Merchant Not Found</h2>
          <p className="text-gray-600 mb-6">The merchant you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/merchants')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Merchants
          </button>
        </div>
      </div>
    );
  }

  // Form configuration
  const editMerchantConfig: FormConfig = {
    title: `Edit ${merchant.businessName}`,
    submitButtonText: "Update Merchant",
    cancelButtonText: "Cancel",
    isLoading: loading,
    isValid: isValid,
    fields: [
      {
        name: 'logo',
        label: 'Business Logo',
        type: 'file',
        accept: '.jpg,.jpeg,.png',
        maxSize: '5MB',
        recommended: '200x200px',
        gridCol: 'full',
        onFileChange: (file) => {
          console.log('File selected:', file);
        }
      } as any,
      {
        name: 'businessName',
        label: 'Business Name',
        type: 'text',
        placeholder: 'Enter business name',
        required: true,
        gridCol: 'half',
        validation: { 
          required: 'Business name is required',
          minLength: {
            value: 2,
            message: 'Business name must be at least 2 characters'
          }
        }
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter email address',
        required: true,
        gridCol: 'half',
        validation: {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email address'
          }
        }
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'tel',
        placeholder: 'Enter phone number',
        required: true,
        gridCol: 'half',
        validation: { 
          required: 'Phone is required',
          pattern: {
            value: /^[0-9+\-\s()]+$/,
            message: 'Invalid phone number format'
          }
        }
      },
      {
        name: 'businessType',
        label: 'Business Type',
        type: 'select',
        placeholder: 'Select business type',
        required: true,
        gridCol: 'half',
        options: [
          { value: 'restaurant', label: 'Restaurant' },
          { value: 'retail', label: 'Retail Store' },
          { value: 'service', label: 'Service Provider' },
          { value: 'technology', label: 'Technology' },
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'education', label: 'Education' },
          { value: 'finance', label: 'Finance' },
          { value: 'manufacturing', label: 'Manufacturing' },
          { value: 'other', label: 'Other' }
        ],
        validation: { required: 'Business type is required' }
      } as any,
      {
        name: 'address',
        label: 'Address',
        type: 'text',
        placeholder: 'Enter business address',
        required: true,
        gridCol: 'full',
        validation: { 
          required: 'Address is required',
          minLength: {
            value: 5,
            message: 'Address must be at least 5 characters'
          }
        }
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        gridCol: 'full',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'pending', label: 'Pending' },
          { value: 'suspended', label: 'Suspended' }
        ],
        validation: { required: 'Status is required' }
      } as any,
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Enter business description (optional)',
        rows: 4,
        gridCol: 'full'
      } as any
    ],
    onSubmit: handleSubmit(async (data) => {
      setLoading(true);
      try {
        // Prepare form data for file upload
        const formData = new FormData();
        
        // Add method for Laravel/PHP backends that need method override
        formData.append('_method', 'PUT');
        
        // Append all form fields
        Object.keys(data).forEach(key => {
          if (key === 'logo' && data[key]?.length > 0) {
            formData.append('logo', data[key][0]);
          } else if (key !== 'logo') {
            formData.append(key, data[key] as string);
          }
        });

        const response = await axiosInstance.post(`/merchants/${merchantId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Success handling
        toast.success(response.data?.message || 'Merchant updated successfully!');
        
        // Navigate back after a short delay
        setTimeout(() => {
          navigate('/merchants');
        }, 1000);
        
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const apiError = error.response?.data;
          
          // Handle validation errors
          if (error.response?.status === 422 && apiError?.errors) {
            Object.keys(apiError.errors).forEach(field => {
              toast.error(`${field}: ${apiError.errors[field][0]}`);
            });
          } else {
            toast.error(apiError?.message || 'Failed to update merchant');
          }
        } else {
          console.error('Unexpected error:', error);
          toast.error('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }),
    onCancel: () => {
      // Check for unsaved changes
      const hasChanges = Object.values(formState.dirtyFields).some(Boolean);
      
      if (hasChanges && !window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        return;
      }
      
      navigate(-1); // Go back to previous page
    },
    customContent: merchant.logoUrl ? (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Logo
        </label>
        <div className="flex items-center space-x-4">
          <img 
            src={merchant.logoUrl} 
            alt={`${merchant.businessName} logo`}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <span className="text-sm text-gray-500">
            Upload a new logo to replace the current one
          </span>
        </div>
      </div>
    ) : undefined
  };

  return (
    <div className="pt-6">
      {loading && <Loading />}
      <DynamicForm
        config={editMerchantConfig}
        register={register}
        errors={errors}
        setValue={setValue}
        formData={merchant}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
};

export default EditMerchantForm;
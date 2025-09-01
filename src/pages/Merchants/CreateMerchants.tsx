import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DynamicForm, { FormConfig } from "../../components/common/DynamicForm";
import axiosInstance from "../../axios/axiosInstance"
import Loading from '../../components/common/Loading';

// Merchant form data interface
interface MerchantFormData {
  logo: FileList;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  address: string;
  status: string;
  description: string;
}

// Yup validation schema
const merchantValidationSchema = Yup.object().shape({
  businessName: Yup.string()
    .required('Business name is required')
    .min(2, 'Business name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  phone: Yup.string()
    .required('Phone is required')
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  businessType: Yup.string()
    .required('Business type is required'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  status: Yup.string()
    .required('Status is required'),
  description: Yup.string().optional(),
  logo: Yup.mixed().optional()
});

const CreateMerchantForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState, setValue, control } = useForm<MerchantFormData>({
    resolver: yupResolver(merchantValidationSchema),
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

  // Form configuration
  const createMerchantConfig: FormConfig = {
    title: "Add New Merchant",
    submitButtonText: "Add Merchant",
    cancelButtonText: "Cancel",
    isLoading: loading,
    isValid: isValid,
    validationSchema: merchantValidationSchema,
    fields: [
      {
        name: 'logo',
        label: 'Business Logo',
        type: 'file',
        accept: '.jpg,.jpeg,.png',
        maxSize: '5MB',
        recommended: '200x200px',
        gridCol: 'full',
        onFileChange: (file: File | null) => {
          console.log('File selected:', file);
        }
      },
      {
        name: 'businessName',
        label: 'Business Name',
        type: 'text',
        placeholder: 'Enter business name',
        required: true,
        gridCol: 'half'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter email address',
        required: true,
        gridCol: 'half'
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'tel',
        placeholder: 'Enter phone number',
        required: true,
        gridCol: 'half'
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
        ]
      },
      {
        name: 'address',
        label: 'Address',
        type: 'text',
        placeholder: 'Enter business address',
        required: true,
        gridCol: 'full'
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
        ]
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Enter business description (optional)',
        rows: 4,
        gridCol: 'full'
      }
    ],
    onSubmit: handleSubmit(async (data) => {
      setLoading(true);
      try {
        // Prepare form data for file upload
        const formData = new FormData();
        
        // Append all form fields
        Object.keys(data).forEach(key => {
          if (key === 'logo' && data[key]?.length > 0) {
            formData.append('logo', data[key][0]);
          } else if (key !== 'logo') {
            formData.append(key, data[key as keyof MerchantFormData] as string);
          }
        });

        const response = await axiosInstance.post('/merchants', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Success handling
        toast.success(response.data?.message || 'Merchant created successfully!');
        
        // Navigate to merchants list or detail page
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
            toast.error(apiError?.message || 'Failed to create merchant');
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
      // Navigate back or show confirmation
      const hasChanges = Object.values(formState.dirtyFields).some(Boolean);
      
      if (hasChanges && !window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        return;
      }
      
      navigate(-1); 
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      {loading && <Loading />}
      <DynamicForm
        config={createMerchantConfig}
        register={register}
        errors={errors}
        setValue={setValue}
        control={control}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
};

export default CreateMerchantForm;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import * as Yup from "yup";
import DynamicForm, {
  FormConfig,
  FieldConfig,
} from "../../components/common/DynamicForm";
import axiosInstance from "../../axios/axiosInstance";
import Loading from "../../components/common/Loading";

const CreateMerchantForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Yup validation schema
  const merchantValidationSchema = Yup.object().shape({
    businessName: Yup.string()
      .required("Business name is required")
      .min(2, "Business name must be at least 2 characters"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
    businessType: Yup.string().required("Business type is required"),
    address: Yup.string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters"),
    status: Yup.string().required("Status is required"),
    description: Yup.string().optional(),
    logo: Yup.mixed<FileList>()
      .test(
        "fileRequired",
        "Logo is required for active merchants",
        function (value) {
          if (
            this.parent.status === "active" &&
            (!value || (value as FileList).length === 0)
          ) {
            return false;
          }
          return true;
        },
      )
      .test("fileSize", "Logo must be less than 5MB", function (value) {
        if (!value || (value as FileList).length === 0) return true;
        return (value as FileList)[0].size <= 5 * 1024 * 1024; // 5MB
      })
      .test("fileType", "Only JPG and PNG files are allowed", function (value) {
        if (!value || (value as FileList).length === 0) return true;
        const file = (value as FileList)[0];
        return ["image/jpeg", "image/png"].includes(file.type);
      }),
  });

  // Define fields using FieldConfig type
  const fields: FieldConfig[] = [
    {
      name: "logo",
      label: "Business Logo",
      type: "file",
      accept: "image/jpeg,image/png",
      placeholder: "Upload logo (JPG, PNG, up to 5MB)",
      required: false,
      gridCol: "full",
    },
    {
      name: "businessName",
      label: "Business Name",
      type: "text",
      placeholder: "Enter business name",
      required: true,
      gridCol: "half",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email address",
      required: true,
      gridCol: "half",
    },
    {
      name: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "Enter phone number",
      required: true,
      gridCol: "half",
    },
    {
      name: "businessType",
      label: "Business Type",
      type: "select",
      placeholder: "Select business type",
      required: true,
      gridCol: "half",
      options: [
        { value: "restaurant", label: "Restaurant" },
        { value: "retail", label: "Retail Store" },
        { value: "service", label: "Service Provider" },
        { value: "technology", label: "Technology" },
        { value: "healthcare", label: "Healthcare" },
        { value: "education", label: "Education" },
        { value: "finance", label: "Finance" },
        { value: "manufacturing", label: "Manufacturing" },
        { value: "other", label: "Other" },
      ],
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Enter business address",
      required: true,
      gridCol: "full",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      gridCol: "full",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
        { value: "suspended", label: "Suspended" },
      ],
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter business description (optional)",
      rows: 4,
      gridCol: "full",
    },
  ];

  // Form configuration
  const createMerchantConfig: FormConfig = {
    title: "Add New Merchant",
    submitButtonText: "Add Merchant",
    cancelButtonText: "Cancel",
    validationSchema: merchantValidationSchema,
    fields,
    onSubmit: async (data) => {
      setLoading(true);
      try {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
          const value = data[key];
          if (key === "logo" && value instanceof FileList && value.length > 0) {
            formData.append("logo", value[0]);
          } else if (key !== "logo") {
            formData.append(key, value as string | Blob);
          }
        });

        const response = await axiosInstance.post("/merchants", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success(
          response.data?.message || "Merchant created successfully!",
        );

        setTimeout(() => {
          navigate("/merchants");
        }, 1000);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const apiError = error.response?.data;
          if (error.response?.status === 422 && apiError?.errors) {
            Object.keys(apiError.errors).forEach((field) => {
              toast.error(`${field}: ${apiError.errors[field][0]}`);
            });
          } else {
            toast.error(apiError?.message || "Failed to create merchant");
          }
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    onCancel: () => {
      navigate(-1); // Go back to previous page directly
    },
  };

  return (
    <div className="pt-10 px-4">
      {loading && <Loading />}
      <DynamicForm config={createMerchantConfig} />
    </div>
  );
};

export default CreateMerchantForm;

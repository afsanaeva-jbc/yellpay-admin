import React from "react";
import CommonForm from "../components/common/CommonForm";
import { toast } from "react-hot-toast";

const adminFields = [
  {
    name: "role",
    label: "Role",
    type: "text",
    validation: { required: "Role is required" },
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    validation: { required: "Name is required" },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    validation: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    validation: {
      pattern: {
        value: /^\d{3}-\d{4}-\d{4}$/,
        message: "Phone number must be in the format 012-3456-7890",
      },
    },
  },
  {
    name: "department",
    label: "Department",
    type: "text",
  },
];

const AdminForm: React.FC = () => {
  const handleSubmit = (data: Record<string, unknown>) => {
    const plainPhone =
      typeof data?.phone === "string" ? data.phone.replace(/\D/g, "") : data?.phone;
    const finalData = {
      ...data,
      phone: plainPhone,
    };
    console.log(finalData);
    toast.success("Admin created!");
  };

  return (
    <CommonForm
      title="Create Admin"
      btnText="Register Admin"
      fields={adminFields}
      onSubmit={handleSubmit}
    />
  );
};

export default AdminForm;

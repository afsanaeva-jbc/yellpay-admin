/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import toast from "react-hot-toast";
import CommonForm from "../components/common/CommonForm";
import axiosInstance from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import Loading from "../components/common/Loading";

const ResetPassword: React.FC = () => {
  const password_reset_token = localStorage.getItem("password_reset_token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fields = [
    {
      name: "verification_code",
      label: "Verification Code",
      type: "text",
      validation: { required: "Verification code is required, Which is send on your Email" },
    },
    {
      name: "password",
      label: "New Password",
      type: "password",
      validation: {
        required: "Password is required",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters",
        },
      },
    },
    {
      name: "password_confirmation",
      label: "Confirm Password",
      type: "password",
      validation: {
        required: "Password confirmation is required",
        validate: (value: string, formValues: Record<string, unknown>) =>
          value === formValues.password || "Passwords do not match",
      },
    },
  ];

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      await axiosInstance.post("/reset-password", {
        password_reset_token,
        ...data,
      });
      setTimeout(() => {
        setLoading(false);
        localStorage.removeItem("password_reset_token"); // Remove the token
        toast.success("Password reset successful!");
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message || "Failed to reset password"
      );
    }
  };

  return (
    <div className="min-h-screen mt-20 px-2">
      {loading && <Loading />}
      <CommonForm
        title="Reset Password"
        btnText="Reset Password"
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ResetPassword;
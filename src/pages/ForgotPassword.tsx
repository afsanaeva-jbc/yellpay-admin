/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import toast from "react-hot-toast";
import CommonForm from "../components/common/CommonForm";
import axiosInstance from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import Loading from "../components/common/Loading";
import type { ForgotPasswordErrorResponse } from "../models/models";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fields = [
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
  ];

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/forgot-password", data);
      // Save token to localStorage
      localStorage.setItem("password_reset_token", response.data.password_reset_token);
      setTimeout(() => {
        setLoading(false);
        toast.success(response.data.message || "Verification code sent!");
        navigate("/reset-password");
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      const apiError = error?.response?.data as ForgotPasswordErrorResponse;
      const emailError = apiError?.message;
      toast.error(emailError || apiError?.message || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen mt-20 px-2">
      {loading && <Loading />}
      <CommonForm
        title="Forgot Password"
        btnText="Send"
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ForgotPassword;
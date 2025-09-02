import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CgEyeAlt } from "react-icons/cg";
import { RiEyeCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import type { ChangePasswordData } from "../models/models";
import { isAxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance";
import Loading from "../components/common/Loading";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState, setError, clearErrors, reset } =
    useForm<ChangePasswordData>({
      defaultValues: {
        current_password: "",
        password: "",
        password_confirmation: "",
      },
      mode: "onChange",
      reValidateMode: "onChange",
    });

  const { errors } = formState;

  // Separate visibility state for each password field
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(true);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(true);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (currentPassword && newPassword && currentPassword === newPassword) {
      setError("password", {});
      console.log("UseEffect", currentPassword);
    } else {
      clearErrors("password");
    }
  }, [currentPassword, newPassword, setError, clearErrors]);

  const onSubmit = async (data: ChangePasswordData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put("/update-password", data);

      setTimeout(() => {
        setLoading(false);
        toast.success(
          response.data.message || "Password changed successfully!",
        );
        reset(); // This will reset all fields to defaultValues
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setTimeout(() => {
          setLoading(false);
          const apiError = error.response?.data;
          toast.error(apiError?.message || "Password Change failed!");
        }, 1000);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="max-w-[550px] m-auto">
      {loading && <Loading />}
      <div className="w-full space-y-8 rounded-lg border-1  border-gray-200 bg-white p-8 m-8 dark:bg-[#18181B] flex flex-col">
        <h2 className="text-3xl font-bold text-[#D5242A] dark:text-[#ff4b4b]">
          Change Password
        </h2>
        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Current Password Field */}
            <div className="mb-4 relative">
              <label className=" text-[#D5242A] text-base font-bold  py-2">
                Current Password
              </label>
              <input
                type={isCurrentPasswordVisible ? "password" : "text"}
                placeholder="Current Password"
                className="block px-2.5 py-3 mt-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300"
                {...register("current_password", {
                  required: "Current Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  onChange: (e) => setCurrentPassword(e.target.value),
                })}
              />

              <p className="p-2 text-sm text-red-500 font-semibold">
                {errors.current_password?.message}
              </p>
              {currentPassword.length > 0 && (
                <button
                  type="button"
                  title={
                    isCurrentPasswordVisible ? "See password" : "Hide password"
                  }
                  className="absolute top-11 right-3 cursor-pointer text-md"
                  onClick={() => setIsCurrentPasswordVisible((prev) => !prev)}
                >
                  {isCurrentPasswordVisible ? <CgEyeAlt /> : <RiEyeCloseLine />}
                </button>
              )}
            </div>

            {/* New Password Field */}
            <div className="mb-4 relative">
              <label className=" text-[#D5242A] text-base font-bold  py-2">
                New Password
              </label>
              <input
                type={isNewPasswordVisible ? "password" : "text"}
                id="newPassword"
                className="block px-2.5 py-3 mt-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300"
                placeholder="New Password"
                {...register("password", {
                  required: "New Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: (newPassword) => {
                    if (newPassword === currentPassword) {
                      return "New password cannot be the same as Current password";
                    }
                  },
                  onChange: (e) => setNewPassword(e.target.value), // Update newPassword state
                })}
              />

              <p className="p-2 text-sm text-red-500 font-semibold">
                {errors.password?.message}
              </p>
              {newPassword.length > 0 && (
                <button
                  type="button"
                  title={
                    isNewPasswordVisible ? "See password" : "Hide password"
                  }
                  className="absolute top-11 right-3 cursor-pointer text-md"
                  onClick={() => setIsNewPasswordVisible((prev) => !prev)}
                >
                  {isNewPasswordVisible ? <CgEyeAlt /> : <RiEyeCloseLine />}
                </button>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className=" text-[#D5242A] text-base font-bold  py-2">
                Confirm Password
              </label>
              <input
                type={isConfirmPasswordVisible ? "password" : "text"}
                id="confirmPassword"
                className="block px-2.5 py-3 mt-2 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300"
                placeholder="Confirm Password"
                {...register("password_confirmation", {
                  required: "Confirm Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: (value) => {
                    if (value !== newPassword) {
                      return "Passwords do not match";
                    }
                    return true;
                  },
                  onChange: (e) => setConfirmPassword(e.target.value), // Update confirmPassword state
                })}
              />

              <p className="p-2 text-sm text-red-500 font-semibold">
                {errors.password_confirmation?.message}
              </p>
              {confirmPassword.length > 0 && (
                <button
                  type="button"
                  title={
                    isConfirmPasswordVisible ? "See password" : "Hide password"
                  }
                  className="absolute top-11 right-3 cursor-pointer text-md"
                  onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                >
                  {isConfirmPasswordVisible ? <CgEyeAlt /> : <RiEyeCloseLine />}
                </button>
              )}
            </div>

            <div className="flex mt-6">
              <button
                type="button"
                className="w-full mr-4 border border-gray-300 text-gray-800 font-medium text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors cursor-pointer rounded-sm"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full rounded-sm bg-[#D5242A] py-2 font-semibold  text-white cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

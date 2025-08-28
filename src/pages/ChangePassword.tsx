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
  const { register, handleSubmit, formState, setError, clearErrors,reset } =
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
          response.data.message || "Password changed successfully!"
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
      <div className="w-full space-y-6 rounded-lg border-2  border-[#005eb6] bg-white p-8 shadow-md dark:bg-[#18181B] flex flex-col">
        <h2 className="text-3xl font-bold text-[#D5242A] dark:text-[#4BB3FF]">
          Change Password
        </h2>
        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Current Password Field */}
            <div className="mb-4 relative">
              <input
                type={isCurrentPasswordVisible ? "password" : "text"}
                placeholder="Current Password"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1"
                {...register("current_password", {
                  required: "Current Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  onChange: (e) => setCurrentPassword(e.target.value),
                })}
              />
              <label className="absolute text-[#D5242A] text-base font-bold duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2">
                Current Password
              </label>
              <p className="p-2 text-sm text-red-500 font-semibold">
                {errors.current_password?.message}
              </p>
              {currentPassword.length > 0 && (
                <button
                  type="button"
                  title={
                    isCurrentPasswordVisible ? "See password" : "Hide password"
                  }
                  className="absolute top-4 right-3 cursor-pointer text-xl"
                  onClick={() => setIsCurrentPasswordVisible((prev) => !prev)}
                >
                  {isCurrentPasswordVisible ? <CgEyeAlt /> : <RiEyeCloseLine />}
                </button>
              )}
            </div>

            {/* New Password Field */}
            <div className="mb-4 relative">
              <input
                type={isNewPasswordVisible ? "password" : "text"}
                id="newPassword"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1"
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
              <label className="absolute text-[#D5242A] text-base font-bold duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2">
                New Password
              </label>
              <p className="p-2 text-sm text-red-500 font-semibold">
                {errors.password?.message}
              </p>
              {newPassword.length > 0 && (
                <button
                  type="button"
                  title={
                    isNewPasswordVisible ? "See password" : "Hide password"
                  }
                  className="absolute top-4 right-3 cursor-pointer text-xl"
                  onClick={() => setIsNewPasswordVisible((prev) => !prev)}
                >
                  {isNewPasswordVisible ? <CgEyeAlt /> : <RiEyeCloseLine />}
                </button>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={isConfirmPasswordVisible ? "password" : "text"}
                id="confirmPassword"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1"
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
              <label className="absolute text-[#D5242A] text-base font-bold duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2">
                Confirm Password
              </label>
              <p className="p-2 text-sm text-red-500 font-semibold">
                {errors.password_confirmation?.message}
              </p>
              {confirmPassword.length > 0 && (
                <button
                  type="button"
                  title={
                    isConfirmPasswordVisible ? "See password" : "Hide password"
                  }
                  className="absolute top-4 right-3 cursor-pointer text-xl"
                  onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                >
                  {isConfirmPasswordVisible ? <CgEyeAlt /> : <RiEyeCloseLine />}
                </button>
              )}
            </div>

            <div className="flex">
              <button
                type="button"
                className="w-full mr-4 rounded bg-gradient-to-r from-[#52b7ff] to-[#0084ff] py-2 font-semibold uppercase text-white cursor-pointer text-center"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full rounded bg-gradient-to-r from-[#52b7ff] to-[#0084ff] py-2 font-semibold uppercase text-white cursor-pointer"
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

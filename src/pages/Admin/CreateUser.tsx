import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Loading from "../../components/common/Loading";
import type { RegisterData, Role } from "../../models/models";
import axiosInstance from "../../axios/axiosInstance";
import { isAxiosError } from "axios";
import { MdOutlineImageAspectRatio } from "react-icons/md";
import { RxAvatar, RxCross2 } from "react-icons/rx";
import { PropagateLoader } from "react-spinners";
import { FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";
interface RegisterProps {
  roles: Role[];
  headerText?: string;
}

const CreateUser: React.FC<RegisterProps> = ({ roles }) => {
  const { t } = useTranslation(["viewDetails", "common"]);
  const { role } = useParams() as { role?: string };
  const navigate = useNavigate();
  const selectedRole = roles.find((r) => r.name === role);
  const {
    register,
    handleSubmit,
    formState,
    setValue,
    setError,
    clearErrors,
    watch,
    reset,
  } = useForm<RegisterData>({
    defaultValues: {
      email: "",
      avatar: null,
    },
    mode: "onChange",
  });
  const { errors, isValid } = formState;
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setValue("phone", formatted, { shouldValidate: true });
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (!file) {
      setValue("avatar", null);
      clearErrors("avatar");
      return;
    }

    if (!validImageTypes.includes(file.type)) {
      setError("avatar", {
        type: "manual",
        message: "Only JPEG, PNG, WEBP, or JPG image files are allowed.",
      });
      setValue("avatar", null, { shouldValidate: true });
    } else {
      setValue("avatar", file, { shouldValidate: true });
      clearErrors("avatar");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };
  const onSubmit = async (data: RegisterData) => {
    const plainPhone = data?.phone?.replace(/\D/g, "");
    // Convert all fields to FormData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("name_furigana", data.name_furigana);
    formData.append("email", data.email);
    formData.append("phone", plainPhone ?? "");

    // Convert roles to string and append
    const roleId = [parseInt(data.roles as unknown as string, 10)];
    formData.append("roles[]", String(roleId));

    // Append avatar file if exists
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    setLoading(true);
    console.log(formData);
    try {
      const response = await axiosInstance.post("/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      reset();
      setPhone(""); // Clear phone state manually
      setLoading(false);
      toast.success(
        response.data?.message || `${t("common::registration_successful")}`
      );
      navigate(-1);
    } catch (error: unknown) {
      setLoading(false);
      if (isAxiosError(error)) {
        const apiError = error.response?.data;
        toast.error(
          apiError?.message || `${t("common::registration_failed")}`
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className=" flex  items-center justify-center px-2">
      {loading && <Loading />}
      <div className="w-full max-w-5xl flex justify-center items-center">
        <div className="w-full bg-white max-w-2xl p-6 sm:p-8 shadow-lg rounded-lg relative">
          <h2 className="text-2xl text-[#D5242A] sm:text-3xl font-bold mb-6 ">
            {`${t("addNew")} ${t("administrator")}`}
          </h2>
          {/* Registration Form */}
          <div>
            {roles ? (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Profile Photo Upload */}
                <div className="mb-6">
                  <label
                    className={`text-base font-bold ${errors.avatar ? "text-red-500" : "text-[#D5242A]"}`}
                  >
                    {t("profile_photo")}
                  </label>

                  <div className="flex items-center gap-6 mt-2">
                    {/* Circular Preview or Placeholder */}
                    <label htmlFor="avatar" className="cursor-pointer relative">
                      <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:shadow-lg transition">
                        {watch("avatar") && watch("avatar") instanceof File ? (
                          <img
                            src={URL.createObjectURL(watch("avatar") as File)}
                            alt="Avatar Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <RxAvatar className="h-10 w-2xl" />
                        )}
                      </div>
                    </label>

                    {/* Upload Button + Hint */}
                    <div>
                      <label
                        htmlFor="avatar"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white text-[#D5242A] font-medium border border-[#D5242A] rounded-md hover:bg-[#D5242A] hover:text-white transition"
                      >
                        <MdOutlineImageAspectRatio />
                        {t("upload_photo")}
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        {t("photo_path")}
                      </p>
                    </div>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    id="avatar"
                    className="hidden"
                    onChange={handleAvatar}
                  />
                  {errors.avatar && (
                    <p className="p-2 text-sm text-red-500 font-semibold">
                      {errors.avatar.message?.toString()}
                    </p>
                  )}
                </div>

                {/* Name Field */}
                <div>
                  <div className="mb-2">
                    <label
                      className={`text-base ${errors.name ? "text-red-500" : "text-[#D5242A]"} font-bold duration-300 transform -translate-y-4`}
                    >
                      {t("name")}
                    </label>
                  </div>
                  <input
                    type="text"
                    id="name"
                    placeholder={t("name")}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${errors.name ? "border-red-500 focus:outline-none focus:ring-0 " : "border-[#D5242A]"}`}
                    {...register("name", {
                      required: "Name is required",
                    })}
                  />

                  <p className="p-2 text-sm text-red-500 font-semibold">
                    {errors.name?.message}
                  </p>
                </div>

                {/* Furigana Field */}
                <div>
                  <div className="mb-2">
                    <label
                      className={` text-base ${errors.name_furigana ? "text-red-500" : "text-[#D5242A]"} font-bold duration-300 transform -translate-y-4 mb-4`}
                    >
                      {t("furigana")}
                    </label>
                  </div>
                  <input
                    type="text"
                    id="name_furigana"
                    placeholder={t("furigana")}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${errors.name_furigana ? "border-red-500 focus:outline-none focus:ring-0 " : "border-[#D5242A]"}`}
                    {...register("name_furigana", {
                      required: "Name furigana is required",
                    })}
                  />

                  <p className="p-2 text-sm text-red-500 font-semibold">
                    {errors.name_furigana?.message}
                  </p>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <div className="mb-2">
                    <label
                      className={`text-base ${errors.email ? "text-red-500" : "text-[#D5242A]"} font-bold duration-300 transform -translate-y-4`}
                    >
                      {t("email")}
                    </label>
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder={t("email")}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${errors.email ? "border-red-500 focus:outline-none focus:ring-0 " : "border-[#D5242A]"}`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />

                  <p className="p-2 text-sm text-red-500 font-semibold">
                    {errors.email?.message}
                  </p>
                </div>

                {/* Role */}
                {role == "system-admin" ? (
                  <div className="relative">
                    <div className="mb-2">
                      <label className=" text-bas font-bold text-[#D5242A] ">
                        {t("role")}
                      </label>
                    </div>
                    <select
                      id="role"
                      {...register("roles", {
                        required: "Role is required",
                      })}
                      className={`block w-full px-2.5 py-2 border rounded-lg ${
                        errors.roles
                          ? "border-red-500"
                          : "border-[#D5242A] bg-transparent "
                      }`}
                    >
                      <option value="">{t("select_role")}</option>
                      {roles
                        .filter((role) => !role.is_reserved)
                        .map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.display_name}
                          </option>
                        ))}
                    </select>

                    <p className="p-2 text-sm text-red-500 font-semibold">
                      {errors.roles?.message}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="text-base font-bold text-[#D5242A]">
                      {t("role")}
                    </label>
                    <div
                      className={`block w-full px-2.5 py-2 border rounded-lg mt-2 border-[#D5242A] bg-transparent disabled:bg-gray-200 "
                  }`}
                    >
                      {selectedRole ? selectedRole.display_name : role}
                    </div>
                    <input
                      type="hidden"
                      value={selectedRole ? selectedRole.id : ""}
                      {...register("roles", {
                        required: "Role is required",
                      })}
                    />
                  </div>
                )}

                {/* Phone Number Field */}
                <div className="relative">
                  <div className="mb-2">
                    <label
                      className={`text-base ${errors.phone ? "text-red-500" : "text-[#D5242A]"} font-bold duration-300 transform -translate-y-4`}
                    >
                      {t("phone")}
                    </label>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="012-3456-7890"
                    value={phone}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${errors.phone ? "border-red-500 focus:outline-none focus:ring-0 " : "border-[#D5242A]"}`}
                    {...register("phone", {
                      pattern: {
                        value: /^\d{3}-\d{4}-\d{4}$/,
                        message:
                          "Phone number must be in the format 012-3456-7890",
                      },
                      onChange: handlePhoneChange,
                    })}
                  />

                  <p className="p-2 text-sm text-red-500 font-semibold">
                    {errors.phone?.message}
                  </p>
                </div>

                {/* Register Button */}
                <div className="mt-4 flex gap-4 justify-end">
                  <div className="flex gap-4 w-[50%]">
                    <button
                      type="button"
                      className="w-full rounded bg-transparent border-2 border-[#D5242A] py-2 font-semibold uppercase text-black cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-400 hover:text-white transition"
                      onClick={handleCancel}
                    >
                      <span>
                        <RxCross2 />
                      </span>
                      <span>{t("cancel")}</span>
                    </button>
                    <button
                      type="submit"
                      disabled={!isValid}
                      className={`w-full text-white font-bold py-2 px-4 rounded-md uppercase flex items-center justify-center gap-2 ${!isValid ? "opacity-50 cursor-not-allowed bg-gray-500 hover:bg-gray-300" : " bg-blue-600 hover:bg-blue-400 cursor-pointer"}`}
                    >
                      <span>
                        {" "}
                        <FaSave />
                      </span>
                      <span>{t("save")}</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <p className="text-center">
                <PropagateLoader />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;

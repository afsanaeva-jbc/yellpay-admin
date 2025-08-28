import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import type { Role, UserData } from "../../models/models";
import axiosInstance from "../../axios/axiosInstance";
import Loading from "../../components/common/Loading";
import { MdOutlineImageAspectRatio } from "react-icons/md";
import { PropagateLoader } from "react-spinners";
import { FaSave } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useTranslation } from "react-i18next";

type EditUserForm = {
  name: string;
  name_furigana: string;
  email: string;
  phone: string;
  avatar: File | null;
  roles: number[] | number;
};

interface EditUserProps {
  roles: Role[];
  headerText?: string;
  userId: string | undefined;
  userData?: UserData | null | undefined;
}

const EditUser: React.FC<EditUserProps> = ({ roles, userData, userId }) => {
  const { t } = useTranslation(["viewDetails", "common"]);
  const user = userData?.data || null;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Store original avatar URL separately for preview
  const [originalAvatar, setOriginalAvatar] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    reset,
    getValues,
    formState: { errors },
    setError,
  } = useForm<EditUserForm>({
    defaultValues: {
      name: "",
      name_furigana: "",
      email: "",
      phone: "",
      avatar: null, // Only files or null here
      roles: [],
    },
    mode: "onChange",
  });

  // Format phone for display
  const formatPhone = (value: string | null) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  // Set original avatar URL when user changes
  useEffect(() => {
    if (user?.avatar) {
      setOriginalAvatar(user.avatar);
    } else {
      setOriginalAvatar(null);
    }
  }, [user]);

  // Pre-fill form with user data (avatar as null to expect file upload)
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        name_furigana: user.name_furigana || "",
        email: user.email || "",
        phone: formatPhone(user.phone) || "",
        avatar: null, // Always reset avatar file to null here
        roles: user.roles ? user.roles.map((role) => role.id) : [],
      });
    }
  }, [user, reset]);

  // Phone input handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("phone", formatted, { shouldValidate: true });
  };

  // Avatar input handler
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
      setValue("avatar", null, { shouldValidate: true });
      setError("avatar", {
        type: "manual",
        message: "Only JPEG, PNG, WEBP, or JPG image files are allowed.",
      });
    } else {
      setValue("avatar", file, { shouldValidate: true });
      clearErrors("avatar");
    }
  };

  // Avatar preview logic
  const watchedAvatar = watch("avatar");
  const avatarPreview =
    watchedAvatar instanceof File
      ? URL.createObjectURL(watchedAvatar)
      : originalAvatar
        ? originalAvatar
        : null;

  // Submit handler
  const onSubmit = async () => {
    setLoading(true);
    const data = getValues();
    const plainPhone = data?.phone?.replace(/\D/g, "");
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", data.name);
    formData.append("name_furigana", data.name_furigana);
    formData.append("email", data.email);
    formData.append("phone", plainPhone ?? "");
    const rolesArray = Array.isArray(data.roles) ? data.roles : [data.roles];
    rolesArray.forEach((roleId) => {
      formData.append("roles[]", String(roleId));
    });

    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    }

    try {
      const response = await axiosInstance.post(`/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      reset();
      setTimeout(() => {
        toast.success(
          response.data?.message || `${t("common::update_success")}`
        );
        navigate(-1);
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const apiError = error.response?.data;
        toast.error(apiError?.message || `${t("common::update_failed")}`);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-2">
      {loading && <Loading />}
      <div className="w-full max-w-5xl flex justify-center items-center">
        <div className="w-full bg-white max-w-2xl p-6 sm:p-8 shadow-lg rounded-lg relative">
          <h2 className="text-2xl text-[#D5242A] sm:text-3xl font-bold mb-6">
            {user?.name ? `${t("edit")} ${user.name}` : `${t("edit")} User`}
          </h2>
          {userData ? (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Profile Photo Upload */}
              <div className="mb-6">
                <label
                  className={`text-base font-bold ${
                    errors.avatar ? "text-red-500" : "text-[#D5242A]"
                  }`}
                >
                  {t("profile_photo")}
                </label>

                <div className="flex items-center gap-6 mt-2">
                  <label htmlFor="avatar" className="cursor-pointer relative">
                    <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:shadow-lg transition">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-500 text-4xl font-semibold">
                          {user?.name
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
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

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  id="avatar"
                  className="hidden"
                  onChange={handleAvatar}
                />

                {/* Error Message */}
                {errors.avatar && (
                  <p className="p-2 text-sm text-red-500 font-semibold">
                    {errors.avatar.message?.toString()}
                  </p>
                )}
              </div>

              {/* Name Field */}
              <div className="mb-4">
                <label
                  className={`text-base ${
                    errors.name ? "text-red-500" : "text-[#D5242A]"
                  } font-bold`}
                >
                  {t("name")}
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder={t("name")}
                  className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${
                    errors.name ? "border-red-500" : "border-[#D5242A]"
                  }`}
                  {...register("name", { required: "Name is required" })}
                />
                <p className="p-2 text-sm text-red-500 font-semibold">
                  {errors.name?.message}
                </p>
              </div>

              {/* Furigana Field */}
              <div className="mb-4">
                <label
                  className={`text-base ${
                    errors.name_furigana ? "text-red-500" : "text-[#D5242A]"
                  } font-bold`}
                >
                  {t("furigana")}
                </label>
                <input
                  type="text"
                  id="name_furigana"
                  placeholder={t("furigana")}
                  className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${
                    errors.name_furigana ? "border-red-500" : "border-[#D5242A]"
                  }`}
                  {...register("name_furigana", {
                    required: "Name furigana is required",
                  })}
                />
                <p className="p-2 text-sm text-red-500 font-semibold">
                  {errors.name_furigana?.message}
                </p>
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label
                  className={`text-base ${
                    errors.email ? "text-red-500" : "text-[#D5242A]"
                  } font-bold`}
                >
                  {t("email")}
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder={t("email")}
                  className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${
                    errors.email ? "border-red-500" : "border-[#D5242A]"
                  }`}
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

              {/* Role Field */}
              <div className="mb-4">
                <label className="text-base font-bold text-[#D5242A]">
                  {t("role")}
                </label>
                <select
                  id="role"
                  {...register("roles", { required: "Role is required" })}
                  className={`block w-full px-2.5 py-2 border rounded-lg ${
                    errors.roles
                      ? "border-red-500"
                      : "border-[#D5242A] bg-transparent"
                  }`}
                >
                  <option value="">Select a role</option>
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

              {/* Phone Number Field */}
              <div className="mb-4">
                <label
                  className={`text-base ${
                    errors.phone ? "text-red-500" : "text-[#D5242A]"
                  } font-bold`}
                >
                  {t("phone")}
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="012-3456-7890"
                  className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${
                    errors.phone ? "border-red-500" : "border-[#D5242A]"
                  }`}
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

              {/* Buttons */}
              <div className="mt-4 flex gap-4 justify-end">
                <div className="flex gap-4 w-[50%]">
                  <button
                    type="button"
                    className="w-full mr-4 rounded flex items-center justify-center gap-2 bg-transparent border-2 border-[#D5242A] py-2 font-semibold uppercase text-black cursor-pointer hover:bg-gray-200 hover:text-black transition"
                    onClick={() => navigate(-1)}
                  >
                    <span>
                      <RxCross2 />
                    </span>
                    <span>{t("cancel")}</span>
                  </button>
                  <button
                    type="submit"
                    className={`w-full text-white flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-md cursor-pointer uppercase bg-blue-600 hover:bg-blue-400`}
                  >
                    <span>
                      {" "}
                      <FaSave />{" "}
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
  );
};

export default EditUser;

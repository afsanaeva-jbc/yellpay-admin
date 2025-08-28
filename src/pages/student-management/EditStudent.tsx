import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Student } from "../../models/models";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import Loading from "../../components/common/Loading";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import axiosInstance from "../../axios/axiosInstance";
import { useGradesList } from "../../hooks/useGradesList";
import { useTranslation } from "react-i18next";

interface EditStudentProps {
  student_id: string | undefined;
  studentData?: Student | null | undefined;
}
const EditStudent: React.FC<EditStudentProps> = ({
  studentData,
  student_id,
}) => {
  const { grades } = useGradesList();
  const gradesValue = grades;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(["viewDetails", "student", "common"]);
  const { register, handleSubmit, formState, setValue, reset } =
    useForm<Student>({
      defaultValues: {
        name: "",
        name_furigana: "",
        email: "",
        phone: "",
        guardian_contact: "",
        date_of_birth: "",
      },
      mode: "onChange",
    });
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const { errors, isValid } = formState;
  const handleCancel = () => {
    navigate(-1);
  };
  const parseDateString = (dateStr: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Fallback: try ISO or native date parse
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
  };

  useEffect(() => {
    if (studentData) {
      const formattedPhone = formatPhone(studentData.phone || "");
      const formattedGuardian = formatPhone(studentData.guardian_contact || "");
      setPhone(formattedPhone);
      setGuardianContact(formattedGuardian);

      reset({
        name: studentData.name || "",
        name_furigana: studentData.name_furigana || "",
        email: studentData.email || "",
        student_id: studentData.student_id || "",
        grade_id: studentData.grade.id || "",
        phone: formattedPhone,
        guardian_contact: formattedGuardian,
        date_of_birth: parseDateString(studentData.date_of_birth),
      });
    }
  }, [studentData, reset]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setValue("phone", formatted, { shouldValidate: true });
  };
  const handleGuardianPhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatPhone(e.target.value);
    setGuardianContact(formatted);
    setValue("guardian_contact", formatted, { shouldValidate: true });
  };
  const onSubmit = async (data: Student) => {
    setLoading(true);

    try {
      const studentPayload = {
        ...data,
        _method: "PUT",
        grade: undefined,
        grade_id: data.grade_id,
      };

      const response = await axiosInstance.post(
        `/students/${student_id}`,
        studentPayload
      );
      reset();
      setTimeout(() => {
        toast.success(response.data?.message || `${t("common::registration_successful")}`);
        navigate(-1);
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const apiError = error.response?.data;
        toast.error(apiError?.message || `${t("common::registration_failed")}`);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className=" flex items-center justify-center px-2">
        {loading && <Loading />}
        <div className="w-full max-w-5xl flex justify-center items-center">
          <div className="w-full bg-white max-w-2xl p-6 sm:p-8 shadow-lg rounded-lg relative">
            <h2 className="text-2xl text-[#D5242A] sm:text-3xl font-bold mb-6 ">
               {`${t("edit")}`} {studentData?.name}
            </h2>
            {studentData ? (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                <div>
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

                {/* Student ID Field */}
                <div>
                  <div className="mb-2">
                    <label
                      className={` text-base ${errors.student_id ? "text-red-500" : "text-[#D5242A]"} font-bold duration-300 transform -translate-y-4 mb-4`}
                    >
                      {t("student_id")}
                    </label>
                  </div>
                  <input
                    type="text"
                    id="student_id"
                    placeholder={t("student_id")}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${errors.student_id ? "border-red-500 focus:outline-none focus:ring-0 " : "border-[#D5242A]"}`}
                    {...register("student_id", {
                      required: "Name furigana is required",
                    })}
                  />

                  <p className="p-2 text-sm text-red-500 font-semibold">
                    {errors.name_furigana?.message}
                  </p>
                </div>

                {/* Grade Dropdown */}
                <div>
                  <div className="mb-2">
                    <label
                      className={`text-base ${errors.grade_id ? "text-red-500" : "text-[#D5242A]"} font-bold`}
                    >
                      {t("class")}
                    </label>
                  </div>
                  <select
                    id="grade_id"
                    {...register("grade_id", { required: "Class is required" })}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border ${
                      errors.grade_id ? "border-red-500" : "border-[#D5242A]"
                    }`}
                  >
                    <option value="">Select a Class</option>
                    {gradesValue?.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        {grade.name}
                      </option>
                    ))}
                  </select>
                  <p className="p-2 text-sm text-red-500 font-semibold">
                    {errors.grade_id?.message}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <div className="mb-2">
                    <label
                      className={`text-base ${errors.phone ? "text-red-500" : "text-[#D5242A]"} font-bold`}
                    >
                      {t("phone_number")}
                    </label>
                  </div>
                  <input
                    type="tel"
                    placeholder="000-0000-0000"
                    value={phone}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border ${
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

                {/* Guardian Contact */}
                <div>
                  <div className="mb-2">
                    <label
                      className={`text-base ${errors.guardian_contact ? "text-red-500" : "text-[#D5242A]"} font-bold`}
                    >
                      {t("guardian_contact")}
                    </label>
                  </div>
                  <input
                    type="tel"
                    placeholder="000-0000-0000"
                    value={guardianContact}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border ${
                      errors.guardian_contact
                        ? "border-red-500"
                        : "border-[#D5242A]"
                    }`}
                    {...register("guardian_contact", {
                      pattern: {
                        value: /^\d{3}-\d{4}-\d{4}$/,
                        message:
                          "Phone number must be in the format 012-3456-7890",
                      },
                      onChange: handleGuardianPhoneChange,
                    })}
                  />
                  <p className="p-2 text-sm text-red-500 font-semibold">
                    {errors.guardian_contact?.message}
                  </p>
                </div>

                {/* Date of Birth */}
                <div>
                  <div className="mb-2">
                    <label
                      className={`text-base ${errors.date_of_birth ? "text-red-500" : "text-[#D5242A]"} font-bold duration-300 transform -translate-y-4`}
                    >
                      {t("dob")}
                    </label>
                  </div>
                  <input
                    type="date"
                    {...register("date_of_birth")}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border border-[#D5242A]"
                  />
                </div>

                {/* Register Button */}
                <div className="mt-4 flex gap-4 justify-end">
                  <div className="flex gap-4 w-[50%]">
                    <button
                      type="button"
                      className="w-full mr-4 rounded bg-transparent border-2 border-[#D5242A] py-2 font-semibold uppercase text-black cursor-pointer text-center"
                      onClick={handleCancel}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={!isValid}
                      className={`w-full  text-white font-bold py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer`}
                    >
                      {t("save")}
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

export default EditStudent;

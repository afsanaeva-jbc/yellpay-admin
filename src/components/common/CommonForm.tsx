/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { FormField } from "../../models/models";

type CommonFormProps = {
  title: string;
  fields: FormField[];
  btnText: string;
  onSubmit: (data: any) => void;
};

const CommonForm: React.FC<CommonFormProps> = ({
  title,
  fields,
  btnText,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  // Phone formatting
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 space-y-6 border-gray-200 border-1 rounded-lg"
    >
      <h2 className="text-3xl font-bold text-[#D5242A]">{title}</h2>

      {fields.map((field) => (
        <div key={field.name} className="mb-4 relative">
          <label
            className={`${
              errors[field.name] ? "text-red-500" : "text-[#D5242A]"
            } text-[#D5242A] text-base font-bold  py-2`}
          >
            {field.label}
          </label>
          <input
            type={field.type}
            placeholder={field.placeholder || field.label}
            className={`block  py-3 mt-2 w-full text-sm bg-transparent rounded-lg border-1 ${
              errors[field.name] ? "border-gray-500" : "border-[#d2d2d2]"
            }`}
            {...register(field.name, field.validation)}
            value={field.name === "phone" ? phone : undefined}
            onChange={
              field.name === "phone"
                ? (e) => {
                    const formatted = formatPhone(e.target.value);
                    setPhone(formatted);
                    setValue("phone", formatted, { shouldValidate: true });
                  }
                : undefined
            }
          />
          <p className="p-2 text-sm text-red-500 font-semibold">
            {errors[field.name]?.message as string}
          </p>
        </div>
      ))}

      <div className="flex gap-4 justify-between mt-6">
        <button
          type="button"
          className="w-full mr-4 border border-gray-300 text-gray-800 font-medium text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors cursor-pointer rounded-sm"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-red-600 w-full hover:bg-red-700 text-white cursor-pointer font-semibold px-4 py-2 rounded-md"
        >
          {btnText}
        </button>
      </div>
    </form>
  );
};

export default CommonForm;

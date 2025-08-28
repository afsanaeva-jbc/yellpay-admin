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
      className="max-w-md mx-auto p-4 space-y-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-3xl font-bold text-[#D5242A]">{title}</h2>

      {fields.map((field) => (
        <div key={field.name} className="mb-4 relative">
          <input
            type={field.type}
            placeholder={field.placeholder || field.label}
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 ${
              errors[field.name] ? "border-red-500" : "border-[#D5242A]"
            }`}
            {...register(field.name, field.validation)}
            value={
              field.name === "phone"
                ? phone
                : undefined
            }
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
          <label
            className={`absolute text-base ${
              errors[field.name] ? "text-red-500" : "text-[#D5242A]"
            } font-bold duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2`}
          >
            {field.label}
          </label>
          <p className="p-2 text-sm text-red-500 font-semibold">
            {errors[field.name]?.message as string}
          </p>
        </div>
      ))}

      <div className="flex gap-4 justify-between mt-6">
        <button
          type="button"
          className="bg-gray-400 hover:bg-gray-500 text-white cursor-pointer font-semibold px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold px-4 py-2 rounded-md"
        >
          {btnText}
        </button>
      </div>
    </form>
  );
};

export default CommonForm;

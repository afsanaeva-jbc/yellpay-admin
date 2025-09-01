import React from "react";
import { useForm, Controller, Control, FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SelectInput from "./SelectDropdown";

// Base field config
export interface BaseFieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "date"
    | "select"
    | "textarea"
    | "file"
    | "password"
    | "number";
  placeholder?: string;
  required?: boolean;
  gridCol?: "full" | "half";
}

// Select field has options
export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: { value: string | number; label: string }[];
}

// Textarea supports rows
export interface TextAreaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  rows?: number;
}

// File input supports accept
export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  accept?: string;
}

// Number input supports min/max
export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
}

// Union of all field types
export type FieldConfig =
  | BaseFieldConfig
  | SelectFieldConfig
  | TextAreaFieldConfig
  | FileFieldConfig
  | NumberFieldConfig;

// Dynamic form data structure
export interface FormData {
  [key: string]: unknown; // safer than `any`, but flexible for dynamic forms
}

// Form configuration
export interface FormConfig {
  title: string;
  fields: FieldConfig[];
  submitButtonText: string;
  cancelButtonText?: string;
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
  validationSchema?: yup.ObjectSchema<FormData>;
}

// --- Individual Field Components ---

// Text & Number Field
const TextField: React.FC<{
  field: BaseFieldConfig | NumberFieldConfig;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}> = ({ field, control, errors }) => {
  const hasError = !!errors[field.name];
  const errorMessage = errors[field.name]?.message as string | undefined;

  return (
    <div className={field.gridCol === "half" ? "col-span-1" : "col-span-2"}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => (
          <input
            type={field.type}
            placeholder={
              field.placeholder || `Enter ${field.label.toLowerCase()}`
            }
            value={
              controllerField.value === null ||
              controllerField.value === undefined ||
              typeof controllerField.value === "object"
                ? ""
                : String(controllerField.value)
            }
            onChange={controllerField.onChange}
            onBlur={controllerField.onBlur}
            min={
              field.type === "number"
                ? (field as NumberFieldConfig).min
                : undefined
            }
            max={
              field.type === "number"
                ? (field as NumberFieldConfig).max
                : undefined
            }
            className={`
              w-full px-3 py-2 border rounded-lg text-sm
              bg-gray-50 border-gray-200
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
              ${
                hasError
                  ? "border-red-500 bg-red-50 focus:ring-red-500"
                  : "border-gray-200 focus:ring-red-500"
              }
              placeholder-gray-500
            `}
          />
        )}
      />
      {hasError && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

// Select Field
const SelectField: React.FC<{
  field: SelectFieldConfig;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}> = ({ field, control, errors }) => {
  const hasError = !!errors[field.name];
  const errorMessage = errors[field.name]?.message as string | undefined;

  return (
    <div className={field.gridCol === "half" ? "col-span-1" : "col-span-2"}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => (
          <SelectInput
            options={field.options.map((opt) => ({
              label: opt.label,
              value: opt.value.toString(),
            }))}
            placeholder={
              field.placeholder || `Select ${field.label.toLowerCase()}`
            }
            width="100%"
            selectedValue={controllerField.value as string | undefined}
            onChange={controllerField.onChange}
            onClear={() => controllerField.onChange("")}
            showClearButton={true}
          />
        )}
      />
      {hasError && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

// Textarea Field
const TextAreaField: React.FC<{
  field: TextAreaFieldConfig;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}> = ({ field, control, errors }) => {
  const hasError = !!errors[field.name];
  const errorMessage = errors[field.name]?.message as string | undefined;

  return (
    <div className={field.gridCol === "half" ? "col-span-1" : "col-span-2"}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => (
          <textarea
            placeholder={
              field.placeholder || `Enter ${field.label.toLowerCase()}`
            }
            value={
              controllerField.value === null ||
              controllerField.value === undefined ||
              typeof controllerField.value === "object"
                ? ""
                : String(controllerField.value)
            }
            onChange={controllerField.onChange}
            onBlur={controllerField.onBlur}
            rows={field.rows || 4}
            className={`
              w-full px-3 py-2 border rounded-lg text-sm resize-none
              bg-gray-50 border-gray-200
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
              ${
                hasError
                  ? "border-red-500 bg-red-50 focus:ring-red-500"
                  : "border-gray-200 focus:ring-red-500"
              }
              placeholder-gray-500
            `}
          />
        )}
      />
      {hasError && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

// File Upload Field
const FileField: React.FC<{
  field: FileFieldConfig;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}> = ({ field, control, errors }) => {
  const hasError = !!errors[field.name];
  const errorMessage = errors[field.name]?.message as string | undefined;
  const [preview, setPreview] = React.useState<string | null>(null);

  return (
    <div className={field.gridCol === "half" ? "col-span-1" : "col-span-2"}>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex items-center space-x-4">
        {/* Circular preview */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Upload section */}
        <div className="flex-1">
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 transition-colors">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload {field.label}
                  <input
                    type="file"
                    accept={field.accept || "image/*"}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      controllerField.onChange(file);

                      if (file && file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setPreview(e.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setPreview(null);
                      }
                    }}
                    onBlur={controllerField.onBlur}
                    className="hidden"
                  />
                </label>

                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG up to 5MB. Recommended: 200x200px
                </p>
              </>
            )}
          />
        </div>
      </div>

      {hasError && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

// --- Main Dynamic Form Component ---

const DynamicForm: React.FC<{ config: FormConfig }> = ({ config }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: config.validationSchema
      ? yupResolver(config.validationSchema)
      : undefined,
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    config.onSubmit(data);
  };

  const renderField = (field: FieldConfig, index: number) => {
    switch (field.type) {
      case "select":
        return (
          <SelectField
            key={index}
            field={field as SelectFieldConfig}
            control={control}
            errors={errors}
          />
        );
      case "file":
        return (
          <FileField
            key={index}
            field={field as FileFieldConfig}
            control={control}
            errors={errors}
          />
        );
      case "textarea":
        return (
          <TextAreaField
            key={index}
            field={field as TextAreaFieldConfig}
            control={control}
            errors={errors}
          />
        );
      default:
        return (
          <TextField
            key={index}
            field={field}
            control={control}
            errors={errors}
          />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-8">
          {config.title}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-2 gap-6 mb-8">
            {config.fields.map((field, index) => renderField(field, index))}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors
                ${
                  !isValid || isSubmitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                }
              `}
            >
              {isSubmitting ? "Loading..." : config.submitButtonText}
            </button>

            {config.onCancel && (
              <button
                type="button"
                onClick={config.onCancel}
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-800 font-medium text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
              >
                {config.cancelButtonText || "Cancel"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;

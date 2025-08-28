import { useCallback, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { PropagateLoader } from "react-spinners";
import type { ClassData } from "../../models/models";
import { useGradesList } from "../../hooks/useGradesList";
import { useTranslation } from "react-i18next";

type OptionType = {
  label: string;
  value: string;
};

type FormInputs = {
  name: string;
  description: string;
  teacher: OptionType | null;
  subTeachers: { [id: string]: boolean };
  classroom: string;
};
interface EditClassProps {
  classId: string | undefined;
  classData?: ClassData | null | undefined;
}

const EditClass: React.FC<EditClassProps> = ({ classData, classId }) => {
  const { t } = useTranslation(["viewDetails", "common"]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { register, handleSubmit, control, watch, formState, reset, setValue } =
    useForm<FormInputs>({
      mode: "onChange",
      defaultValues: {
        name: "",
        description: "",
        teacher: null,
        subTeachers: {},
        classroom: "",
      },
    });

  const { errors, isValid } = formState;
  const { teachers, hasTeacherMore, currentTeacherPage, fetchTeachers } =
    useGradesList();

  const observer = useRef<IntersectionObserver | null>(null);

  const lastTeacherRef = useCallback(
    (node: HTMLLabelElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasTeacherMore && !loading) {
          fetchTeachers(currentTeacherPage);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasTeacherMore, currentTeacherPage, fetchTeachers]
  );

  const teacherOptions: OptionType[] = teachers.map((teacher) => ({
    value: teacher.id.toString(),
    label: `${teacher.name} - ${teacher.roles[0]?.display_name || "Teacher"}`,
  }));

  const selectedTeacher = watch("teacher");
  useEffect(() => {
    const currentSubTeachers = watch("subTeachers");
    const selectedTeacherId = selectedTeacher?.value;

    if (selectedTeacherId && currentSubTeachers?.[selectedTeacherId]) {
      setValue(`subTeachers.${selectedTeacherId}`, false);
    }
  }, [selectedTeacher?.value, setValue, watch]);

  useEffect(() => {
    if (classData) {
      const teacherOption = {
        value: classData.teacher?.id.toString(),
        label: `${classData.teacher?.name} - Teacher`,
      };

      const subTeacherMap: { [id: string]: boolean } = {};
      classData.subteachers?.forEach((value) => {
        subTeacherMap[value.id.toString()] = true;
      });

      reset({
        name: classData.name,
        description: classData.description,
        classroom: classData.classroom,
        teacher: teacherOption,
        subTeachers: subTeacherMap,
      });

      setInitialLoading(false);
    }
  }, [classData, reset]);

  if (initialLoading && loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <PropagateLoader />
      </div>
    );
  }

  const onSubmit = async (data: FormInputs) => {
    const subTeacherIds = Object.entries(data.subTeachers || {})
      .filter(([, isChecked]) => isChecked)
      .map(([id]) => Number(id));

    const payload = {
      name: data.name,
      description: data.description,
      teacher_id: Number(data.teacher?.value),
      subteachers: subTeacherIds,
      classroom: data.classroom,
    };

    setLoading(true);

    try {
      const ClassPayload = {
        ...payload,
        _method: "PUT",
      };
      const response = await axiosInstance.post(
        `/grades/${classId}`,
        ClassPayload
      );
      reset();
      setTimeout(() => {
        toast.success(response.data?.message || t("common::update_success"));
        navigate(-1);
      });
    } catch (error: unknown) {
      setLoading(false);
      if (isAxiosError(error)) {
        const apiError = error.response?.data;
        toast.error(apiError?.message || t("common::update_failed"));
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center px-2">
      <div className="w-full max-w-5xl flex justify-center items-center">
        <div className="w-full bg-white max-w-2xl p-6 sm:p-8 shadow-lg rounded-lg relative">
          <h2 className="text-2xl text-[#D5242A] sm:text-3xl font-bold mb-6">
            {t("edit")} {t("class")}
          </h2>
          {classData ? (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Class Name */}
              <div>
                <label
                  className={`text-base ${errors.name ? "text-red-500" : "text-[#D5242A]"} font-bold mb-2 block`}
                >
                  {t("class_name")}
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${errors.name ? "border-red-500" : "border-[#D5242A]"}`}
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                <p className="text-sm text-red-500 font-semibold">
                  {errors.name?.message}
                </p>
              </div>

              {/* Class Teacher */}
              <div className="mt-4">
                <label
                  className={`text-base ${errors.teacher ? "text-red-500" : "text-[#D5242A]"} font-bold mb-2 block`}
                >
                  {t("class_teacher")}
                </label>
                <Controller
                  name="teacher"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={teacherOptions}
                      placeholder="Select a teacher..."
                      isClearable
                      onMenuScrollToBottom={() => {
                        if (hasTeacherMore && !loading) {
                          fetchTeachers(currentTeacherPage);
                        }
                      }}
                    />
                  )}
                />

                <p className="text-sm text-red-500 font-semibold">
                  {errors.teacher?.message}
                </p>
              </div>

              {/* Sub Teachers */}
              <div className="mt-4">
                <label className="block font-bold mb-2 text-[#D5242A]">
                  {t("sub_teachers")}
                </label>
                <div className="border rounded px-3 py-2 max-h-48 overflow-y-auto space-y-2 mb-4">
                  {teacherOptions
                    .filter((t) => t.value !== selectedTeacher?.value)
                    .map((teacher, index, arr) => {
                      const isLast = index === arr.length - 1;
                      return (
                        <label
                          key={teacher.value}
                          className="flex items-center space-x-2"
                          ref={isLast ? lastTeacherRef : null}
                        >
                          <input
                            type="checkbox"
                            {...register(`subTeachers.${teacher.value}`)}
                            className="accent-blue-500"
                          />
                          <span>{teacher.label}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Classroom */}
              <div>
                <label className="block font-bold mb-2 text-[#D5242A]">
                  {t("classroom")}
                </label>
                <input
                  {...register("classroom")}
                  placeholder={t("classroom")}
                  className="w-full border px-3 py-2 rounded mb-4"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold mb-2 text-[#D5242A]">
                  {t("class")} {t("description")}
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Enter class description"
                  className="w-full border-[#D5242A] px-3 py-2 rounded h-50 mb-4"
                />
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-4 justify-end">
                <button
                  type="button"
                  className="w-full cursor-pointer rounded bg-transparent border-2 border-[#D5242A] py-2 font-semibold uppercase text-black"
                  onClick={handleCancel}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`w-full cursor-pointer text-white font-bold py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700`}
                >
                  {t("save")}
                </button>
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

export default EditClass;

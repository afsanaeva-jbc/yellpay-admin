import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axiosInstance from "../../axios/axiosInstance";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { PropagateLoader } from "react-spinners";
import { useGradesList } from "../../hooks/useGradesList";
import { useTranslation } from "react-i18next";
type OptionType = {
  label: string;
  value: string;
};
type FormInputs = {
  name: string;
  description: string;
  advisor: OptionType | null;
  subAdvisors: { [id: string]: boolean };
  location: string;
  members: { [id: string]: boolean };
};

const CreateClub = () => {
  const { t } = useTranslation(["viewDetails","class", "common"]);
  const { register, handleSubmit, control, watch, formState, setValue } =
    useForm<FormInputs>({
      mode: "onChange",
    });
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(-1);
  };
  const { errors, isValid } = formState;
  const [loading, setLoading] = useState(false);
  const {
    teachers,
    students,
    hasTeacherMore,
    hasStudentMore,
    currentStudentPage,
    currentTeacherPage,
    fetchTeachers,
    fetchStudents,
  } = useGradesList();
  const teacherObserver = useRef<IntersectionObserver | null>(null);
  const studentObserver = useRef<IntersectionObserver | null>(null);
  const lastTeacherRef = useCallback(
    (node: HTMLLabelElement | null) => {
      if (loading) return;

      if (teacherObserver.current) teacherObserver.current.disconnect();
      teacherObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasTeacherMore && !loading) {
          fetchTeachers(currentTeacherPage);
        }
      });

      if (node) teacherObserver.current.observe(node);
    },
    [loading, hasTeacherMore, currentTeacherPage, fetchTeachers]
  );
  const lastStudentRef = useCallback(
    (node: HTMLLabelElement | null) => {
      if (loading) return;

      if (studentObserver.current) studentObserver.current.disconnect();
      studentObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasStudentMore && !loading) {
          fetchStudents(currentStudentPage);
        }
      });

      if (node) studentObserver.current.observe(node);
    },
    [loading, hasStudentMore, currentStudentPage, fetchStudents]
  );
  const teacherOptions: OptionType[] = teachers.map((teacher) => ({
    value: teacher.id.toString(),
    label: `${teacher.name} - ${teacher.roles[0]?.display_name || "Teacher"}`,
  }));

  const StudentOptions: OptionType[] = students.map((student) => ({
    value: student.id.toString(),
    label: `${student.name} - ${student.grade?.name || ""}`,
  }));

  const selectedTeacher = watch("advisor");
  const selectedMember = watch("members");
  useEffect(() => {
    const currentSubTeachers = watch("subAdvisors");
    const selectedTeacherId = selectedTeacher?.value;

    if (selectedTeacherId && currentSubTeachers?.[selectedTeacherId]) {
      setValue(`subAdvisors.${selectedTeacherId}`, false);
    }
  }, [selectedTeacher?.value, selectedMember?.value, setValue, watch]);
  const onSubmit = async (data: FormInputs) => {
    const subTeacherIds = Object.entries(data.subAdvisors || {})
      .filter(([, isChecked]) => isChecked)
      .map(([id]) => Number(id));

    const memberIds = Object.entries(data.members || {})
      .filter(([, isChecked]) => isChecked)
      .map(([id]) => Number(id));

    const payload = {
      name: data.name,
      description: data.description,
      advisor_id: Number(data.advisor?.value),
      subadvisors: subTeacherIds,
      location: data.location,
      members: memberIds,
    };

    setLoading(true);
    console.log("Submit Payload:", payload);
    try {
      const response = await axiosInstance.post("/clubs", payload);

      toast.success(response.data?.message || t("common::registration_successful"));
      navigate(-1);
    } catch (error: unknown) {
      setLoading(false);
      if (isAxiosError(error)) {
        const apiError = error.response?.data;
        toast.error(apiError?.message || t("common::registration_failed"));
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center px-2">
      <div className="w-full max-w-5xl flex justify-center items-center">
        <div className="w-full bg-white max-w-4xl p-6 sm:p-8 shadow-lg rounded-lg relative">
          <h2 className="text-2xl text-[#D5242A] sm:text-3xl font-bold mb-2">
            {t("addNew")} {t("class::club")}
          </h2>
          <hr className="mb-4" />
          {teachers.length > 0 && students.length > 0 ? (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* Club Name */}
                  <div>
                    <div className="mb-2">
                      <label
                        className={`text-base ${errors.name ? "text-red-500" : "text-[#D5242A]"} font-bold duration-300 transform -translate-y-4`}
                      >
                        {t("club_name")}
                      </label>
                    </div>
                    <input
                      type="text"
                      id="name"
                      placeholder={t("club_name")}
                      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${errors.name ? "border-red-500 focus:outline-none focus:ring-0 " : "border-[#D5242A]"}`}
                      {...register("name", {
                        required: "Name is required",
                      })}
                    />

                    <p className="text-sm text-red-500 font-semibold">
                      {errors.name?.message}
                    </p>
                  </div>
                  {/* Description */}
                  <div className="mt-4">
                    <div className="mb-2">
                      <label className="block font-bold mb-1 text-[#D5242A]">
                        {t("class::club")} {t("description")}
                      </label>
                    </div>
                    <textarea
                      {...register("description")}
                      placeholder={`${t("class::club")} ${t("description")}`}
                      className="w-full border-[#D5242A] px-3 py-2 rounded h-30 "
                    />
                  </div>

                  {/* Club Advisor */}
                  <div className="mt-4">
                    <label
                      className={`text-base ${errors.advisor ? "text-red-500" : "text-[#D5242A]"} font-bold mb-2 block `}
                    >
                      {t("club")} {t("advisor")}
                    </label>

                    <Controller
                      name="advisor"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={teacherOptions}
                          placeholder={`${t("select_teacher")}...`}
                          isClearable
                          onMenuScrollToBottom={() => {
                            if (hasTeacherMore && !loading) {
                              fetchTeachers(currentTeacherPage);
                            }
                          }}
                        />
                      )}
                    />
                    {errors.advisor?.message && (
                      <p className="text-sm text-red-500 font-semibold">
                        This field is required.
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="mt-4">
                    <div className="mb-2">
                      <label className="block font-bold mb-1 text-[#D5242A]">
                        {t("club")} {t("location")}
                      </label>
                    </div>
                    <input
                      {...register("location")}
                      placeholder={`${t("club")} ${t("location")}`}
                      className="w-full border px-3 py-2 rounded mb-4"
                    />
                  </div>
                </div>
                <div>
                  {/* Sub Advisors */}
                  <div>
                    <label className="block font-bold mb-1 text-[#D5242A]">
                      {t("sub_advisors")}
                    </label>

                    <div className="border rounded px-3 py-2 max-h-48 overflow-y-auto space-y-2 mb-4 bg-gray-50">
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
                                {...register(`subAdvisors.${teacher.value}`)}
                                className="accent-blue-500"
                              />
                              <span>{teacher.label}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                  {/* Members */}
                  <div>
                    <label className="block font-bold mb-1 text-[#D5242A]">
                      {t("members")}
                    </label>

                    <div className="border rounded px-3 py-2 max-h-48 overflow-y-auto space-y-2 mb-4 bg-gray-50">
                      {StudentOptions.map((student, index, arr) => {
                        const isLast = index === arr.length - 1;

                        return (
                          <label
                            key={student.value}
                            className="flex items-center space-x-2"
                            ref={isLast ? lastStudentRef : null}
                          >
                            <input
                              type="checkbox"
                              {...register(`members.${student.value}`)}
                              className="accent-blue-500 "
                            />
                            <span>{student.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              {/* Actions */}
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
                    className={`w-full  text-white font-bold py-2 px-4 rounded-md ${!isValid ? "opacity-50 cursor-not-allowed bg-gray-500 hover:bg-gray-300" : "  bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
                  >
                    {t("save")}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <PropagateLoader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateClub;

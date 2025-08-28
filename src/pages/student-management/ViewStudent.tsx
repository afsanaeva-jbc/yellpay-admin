import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import { isAxiosError } from "axios";
import type { Student } from "../../models/models";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type StudentProps = {
  studentId: number | undefined;
};

const ViewStudent: React.FC<StudentProps> = ({ studentId }) => {
  const { t } = useTranslation(["viewDetails", "student"]);
  const [studentItem, setStudentItem] = useState<Student | null>(null);

  const fetchStudentDetails = useCallback(async () => {
    if (!studentId) return;
    try {
      const response = await axiosInstance.get(`/students/${studentId}`);
      setStudentItem(response.data.data);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setStudentItem(null);
        toast.error(
          error.response?.data.message || "Failed to fetch student details"
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentDetails();
  }, [fetchStudentDetails]);
  console.log(studentItem)

  return (
    <div className="px-6 pb-6 max-w-2xl mx-auto bg-white rounded">
      {studentItem ? (
        <div className="px-6 py-6 max-w-4xl mx-auto bg-white rounded-md shadow space-y-8">
          <div className="flex justify-between">
            {/* Basic Info */}
            <div className="w-[50%]">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">
                {t("student::basic_info")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    {t("name")}
                  </label>
                  <div className="mt-1 p-2 bg-gray-100 rounded">
                    {studentItem.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    {t("furigana")}
                  </label>
                  <div className="mt-1 p-2 bg-gray-100 rounded">
                    {studentItem.name_furigana}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    {t("email")}
                  </label>
                  <div className="mt-1 p-2 bg-gray-100 rounded">
                    {studentItem.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    {t("student_id")}
                  </label>
                  <div className="mt-1 p-2 bg-gray-100 rounded">
                    {studentItem.student_id}
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="w-[45%]">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">
                {t("student::academic_info")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    {t("class")}
                  </label>
                  <div className="mt-1 p-2 bg-gray-100 rounded">
                    {studentItem.grade?.name ?? "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    {t("dob")}
                  </label>
                  <div className="mt-1 p-2 bg-gray-100 rounded">
                    {studentItem.date_of_birth}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">
              {t("student::contact_info")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  {t("phone_number")}
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded">
                  {studentItem.phone}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  {t("guardian_contact")}
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded">
                  {studentItem.guardian_contact}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">
          <PropagateLoader />
        </p>
      )}
    </div>
  );
};

export default ViewStudent;

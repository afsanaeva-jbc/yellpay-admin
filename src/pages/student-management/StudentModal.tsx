import React from "react";
import { GoArrowLeft } from "react-icons/go";
import ViewStudent from "./ViewStudent";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
interface StudentModalProps {
  studentId: number;
  onClose: () => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ studentId, onClose }) => {
  const {t} = useTranslation(["student", "viewDetails"])
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full max-h-full overflow-x-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-600 opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mx-10 my-5">
          <button
            type="button"
            className="flex items-center justify-end text-blue-600 text-sm cursor-pointer hover:underline"
            onClick={onClose}
          >
            <GoArrowLeft />
            <span className="ml-1">{t("backStudent")}</span>
          </button>
          <div className="text-2xl font-bold text-blue-600">
            {t("student_details")}
          </div>

          <button
            onClick={() => navigate(`/edit-students/${studentId}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 cursor-pointer "
          >
            <FaRegEdit />
            <span>{t("viewDetails::edit")}</span>
          </button>
        </div>

        <div className="relative">
          <ViewStudent studentId={studentId} />
        </div>
      </div>
    </div>
  );
};

export default StudentModal;

import React from "react";
import { GoArrowLeft } from "react-icons/go";
import { useTranslation } from "react-i18next";
import ViewUserPage from "./ViewUserPage";


interface ModalProps {
  userId: number;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ userId, onClose }) => {
  const { t } = useTranslation("viewDetails");
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full max-h-full overflow-x-hidden">
      <div className="absolute inset-0 bg-gray-600 opacity-80 backdrop-blur-sm"
        onClick={onClose}/>
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg z-10"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end">
          <button
            type="button"
            className="flex items-center justify-end text-blue-600 text-sm cursor-pointer hover:underline pt-4 pr-4"
            onClick={onClose}
          >
            <GoArrowLeft /> <span className="ml-1">{t("backAdmin")}</span>
          </button>
        </div>
        {/* Modal content */}
        <div className="relative">
          <ViewUserPage userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default Modal;

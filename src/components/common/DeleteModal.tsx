import React from "react";
import { useTranslation } from "react-i18next";

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  merchantName?: string; // Add merchant name prop for dynamic content
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  merchantName,
}) => {
  const { t } = useTranslation("viewDetails");

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 "
    >
      <div
        className="relative p-0 w-full max-w-xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between pt-6 pl-6 ">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Merchant
            </h2>
            {/* <button
              type="button"
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
              onClick={onClose}
            >
              <RxCross2 className="w-5 h-5" />
              <span className="sr-only">Close modal</span>
            </button> */}
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              {t("delete_modal")}
              {merchantName}
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center space-x-3 pb-6 pr-6 rounded-b-lg">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700  border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              onClick={onClose}
            >
             {t("delete_cancel")}
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              onClick={onConfirm}
            >
              {t("delete_confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

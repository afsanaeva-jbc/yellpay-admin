import React from "react";
import { RxCross2 } from "react-icons/rx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const {t} = useTranslation("viewDetails");
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-center items-center bg-transparent backdrop-blur-sm"
    >
      <div
        className="relative p-4 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
      >
        <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
          <button
            type="button"
            className="text-gray-400 absolute top-2.5 right-2.5 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
            onClick={onClose}
          >
            <RxCross2 className="text-black cursor-pointer" />
            <span className="sr-only">Close modal</span>
          </button>
          <RiDeleteBin6Line className="text-gray-400 w-11 h-11 mb-3.5 mx-auto" />
          <p className="mb-4 text-gray-500">
            {t("delete_modal")}
          </p>
          <div className="flex justify-center items-center space-x-4">
            <button
              className="py-2 px-3 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={onClose}
            >
              {t("delete_cancel")}
            </button>
            <button
              className="py-2 px-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer"
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

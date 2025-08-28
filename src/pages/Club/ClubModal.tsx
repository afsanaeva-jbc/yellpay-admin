import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import ViewClubDetails from "./ViewClubDetails";
import { useTranslation } from "react-i18next";

interface ClubModalProps {
  clubId: number;
  onClose: () => void;
}

const ClubModal: React.FC<ClubModalProps> = ({clubId, onClose}) => {
  const {t} =useTranslation(["viewDetails", "class", "common"])
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full max-h-full overflow-x-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-600 opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mx-10 my-5">
          <button
            type="button"
            className="flex items-center justify-end text-blue-600 text-sm cursor-pointer hover:underline"
            onClick={onClose}
          >
            <GoArrowLeft />
            <span className="ml-1">{t("class::backClub")}</span>
          </button>
          <div className="text-2xl font-bold text-blue-600">
            {t("club")} {t("details")}
          </div>

          <button
            onClick={() => navigate(`/edit-club/${clubId}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 cursor-pointer "
          >
            <FaRegEdit />
            <span>{t("edit")}</span>
          </button>
        </div>

        <div className="relative">
          <ViewClubDetails clubId={clubId} />
        </div>
      </div>
    </div>
  );
};

export default ClubModal;

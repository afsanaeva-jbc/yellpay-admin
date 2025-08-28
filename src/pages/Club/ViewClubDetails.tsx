import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import type { Club } from "../../models/models";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { BsPersonCheck } from "react-icons/bs";
import { GoPeople, GoPerson } from "react-icons/go";
import { TiLocationArrowOutline } from "react-icons/ti";
import { MdOutlineLocationOn } from "react-icons/md";
import { PropagateLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

type StudentProps = {
  clubId: number | undefined;
};

const ViewClubDetails: React.FC<StudentProps> = ({ clubId }) => {
  const {t} =useTranslation(["viewDetails", "class"])
  const [clubItem, setClubItem] = useState<Club | null>(null);

  const fetchClubDetails = useCallback(async () => {
    if (!clubId) return;
    try {
      const response = await axiosInstance.get(`/clubs/${clubId}`);
      setClubItem(response.data.data);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setClubItem(null);
        toast.error(error.response?.data.message || "Failed Club items data");
      } else {
        console.log("Unexpected Error", error);
      }
    }
  }, [clubId]);
  console.log(clubItem)

  useEffect(() => {
    fetchClubDetails();
  }, [fetchClubDetails]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {clubItem ? (
        <div className="space-y-6">
          {/* Club Header */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white text-3xl p-5">
              <GoPeople className="text-5xl" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{clubItem.name}</h2>
              <p className="text-gray-600 text-sm">{clubItem.description}</p>
              <span className="text-xs px-2 py-1 mt-2 inline-block rounded-full bg-purple-100 text-purple-700 font-medium">
                activeClub
              </span>
            </div>
          </div>

          <hr />

          {/* Club Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Left side */}
            <div className="space-y-3">
              <h3 className="font-bold flex items-center gap-2 text-blue-800">
                <span className="text-xl">
                  <BsPersonCheck />
                </span>
                <span>{t("class::club_leadership")}</span>
              </h3>
              <div className="flex gap-2">
                <div className="text-xl">
                  <GoPerson />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{t("club")} {t("advisor")}</span>
                  <span className="text-md">{clubItem.advisor?.name}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-xl">
                  <GoPeople />
                </span>
                <div className="flex flex-col gap-2">
                  <span className="font-medium"> {t("sub_advisors")}</span>
                  <div className="flex flex-wrap gap-2">
                    {clubItem.subadvisors.map((sub) => (
                      <span
                        key={sub.id}
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-md font-semibold"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="space-y-3">
              <div className="flex flex-col gap-2 ">
                <div className="flex  gap-1">
                  <span className="text-xl font-bold text-blue-800">
                    <MdOutlineLocationOn />
                  </span>
                  <span className="font-bold text-blue-800">
                    {t("class::location_information")}
                  </span>
                </div>

                <div className="font-medium flex ">
                  <span className="text-xl">
                    <TiLocationArrowOutline />
                  </span>
                  <span className="flex flex-col space-y-2">
                    <span>{t("club")} {t("location")}</span>
                    <span>{clubItem.location}</span>
                  </span>
                </div>
              </div>

              <h3 className="font-bold flex items-center gap-2 text-blue-800 mt-4">
                <span className="text-xl">
                  <GoPeople />
                </span>
                <span>{t("club")} {t("members")}</span>
                <span className="ml-2 bg-gray-200 text-xs px-3 py-1 rounded-md">
                  {clubItem.members.length}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {clubItem.members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gray-100 px-3 py-1 rounded-md text-xs"
                  >
                    {member.name}
                  </div>
                ))}
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

export default ViewClubDetails;

import React, { useEffect, useState, useCallback } from "react";
import { isAxiosError } from "axios";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { SlPeople } from "react-icons/sl";
import { PiPhoneThin } from "react-icons/pi";
import { GoMail } from "react-icons/go";
import axiosInstance from "../../axios/axiosInstance";
import type { RoleData } from "../../models/models";

type UserListPageProps = {
  userId: number | undefined;
};

type UserData = {
  id: number;
  name: string;
  name_furigana: string;
  email: string;
  phone: string | null;
  avatar?: string | File | null;
  role: string;
};

const ViewUserPage: React.FC<UserListPageProps> = ({ userId }) => {
  const { t } = useTranslation("viewDetails");
  const [userData, setUserData] = useState<UserData | null>(null);
  console.log(userData);
  const [roleData, setRoleData] = useState<RoleData[]>([]);
  console.log(userData?.avatar, "View Details Page");
  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      setUserData(response.data.data);
      setRoleData(response.data.data.roles);
    } catch (error: unknown) {
      setUserData(null);
      setRoleData([]);
      if (!isAxiosError(error)) {
        console.error("Unexpected error:", error);
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const role = roleData.map((role) => role.name).join(", ");

  return (
    <div className="px-6 pb-6 max-w-2xl mx-auto bg-white rounded">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-600">
          {userData?.name} {t("details")}
        </h1>
      </div>

      <hr className="mb-6" />

      {userData ? (
        <>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-200 shadow-sm flex items-center justify-center bg-blue-600 text-white text-xl font-bold relative">
              {userData.avatar &&
              typeof userData.avatar === "string" &&
              userData.avatar !== "null" &&
              userData.avatar !== "" ? (
                <img
                  src={userData.avatar}
                  alt={`${userData.name}'s avatar`}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-white">
                  {(userData.name as string)
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <div className="text-sm text-gray-500">
                {userData.name_furigana}
              </div>
              <div className="flex gap-2 items-center text-sm text-gray-800 uppercase">
                <p>
                  <SlPeople />
                </p>
                <p>{role}</p>
              </div>
            </div>
          </div>

          <hr className="mb-6" />

          <div className="space-y-4">
            <div className="font-bold text-xl">{t("contact")}</div>
            <div className="flex gap-2 items-center">
              <div className="text-gray-400 text-sm">
                <GoMail className="w-5 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{t("email")}:</span>
                <span className="text-sm text-gray-800">{userData.email}</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="text-gray-400 text-sm">
                <PiPhoneThin className="w-6 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold ">{t("phone")}:</span>
                <span className="text-sm text-gray-800">
                  {userData.phone ?? "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-right flex items-center justify-end">
            <Link
              to={`/edit/${userData.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-end space-x-2"
            >
              <FaRegEdit />
              <span>{t("edit")}</span>
            </Link>
          </div>
        </>
      ) : (
        <p className="text-center">
          <PropagateLoader />
        </p>
      )}
    </div>
  );
};

export default ViewUserPage;

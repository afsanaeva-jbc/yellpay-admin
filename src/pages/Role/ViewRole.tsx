import React, { useCallback, useEffect, useState } from "react";
import type { RoleListData } from "../../models/models";
import axiosInstance from "../../axios/axiosInstance";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";

type RoleProps = {
  roleId: number | undefined;
};

const ViewRole: React.FC<RoleProps> = ({ roleId }) => {
  const [roleList, setRoleList] = useState<RoleListData | null>(null);
  const navigate = useNavigate();

  const fetchRoleDetails = useCallback(async () => {
    if (!roleId) return;
    try {
      const response = await axiosInstance.get(`/roles/${roleId}`);
      setRoleList(response.data.data);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setRoleList(null);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }, [roleId]);

  useEffect(() => {
    fetchRoleDetails();
  }, [fetchRoleDetails]);

  return (
    <div className="px-6 pb-6 max-w-2xl mx-auto bg-white rounded">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Role Detail Title</h1>
      </div>
      {/* Title */}
      {roleList ? (
        <>
          <div className="space-y-6 text-sm md:text-base">
            <div className="flex">
              <span className="font-medium text-gray-600 w-[50%]">
                Role Name:
              </span>
              <span className="font-semibold text-black">
                {roleList.display_name}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-600 w-[50%]">
                Role Description:
              </span>
              <span className="text-black max-w-xs">
                {roleList.description ?? "N/A"}
              </span>
            </div>
          </div>
          <div className="mt-10 flex justify-end">
            <button
              onClick={() => navigate(`/edit-role/${roleList.id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
            >
              <FaRegEdit />
              <span>Edit</span>
            </button>
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

export default ViewRole;

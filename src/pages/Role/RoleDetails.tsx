import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axios/axiosInstance";
import type { IPaginatedResponse, RoleListData } from "../../models/models";
import { useDebounceValue } from "usehooks-ts";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import SearchData from "../search-csv/SearchData";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import RoleModal from "./RoleModal";
import DataTableCommon from "../Admin/DataTableCommon";

const RoleDetails: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const { t } = useTranslation(["viewDetails", "sidebar"]);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue] = useDebounceValue(searchValue, 500);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedValue]);

  const tableHead: { text: string; key: keyof RoleListData }[] = [
    { text: "Role Name", key: "display_name" },
    { text: t("description"), key: "description" },
  ];

  const {
    data: roleListData,
    isLoading,
    isError,
  } = useQuery<IPaginatedResponse<RoleListData[]>>({
    queryKey: ["roleListData", debouncedValue, currentPage, perPage],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/roles?search=${debouncedValue}`,
        {
          params: {
            page: currentPage,
            perPage: perPage,
          },
        }
      );
      return response.data as IPaginatedResponse<RoleListData[]>;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const roleList = roleListData
    ? roleListData.data.map((role) => ({
        ...role,
        is_reserved: role.is_reserved ? t("yes") : t("no"),
      }))
    : [];

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/roles/${id}`);
      setSelectedRoleId(null);
      setShowUserListModal(false);
      toast.success(response.data.message || "Role deleted successfully!");
      navigate(0);
      queryClient.invalidateQueries({
        queryKey: ["roleListData"],
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const apiError = error.response?.data;
        toast.error(apiError?.message || "Delete failed!");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div>
      {/* Header section */}
      <div className="pb-4 dark:bg-gray-900 flex justify-between items-center">
        <h2 className="uppercase text-black text-2xl font-bold">Role List</h2>
        <Link to={`/createRole`} className="flex gap-2">
          <button className="text-white button-common hover:bg-blue-700 font-medium rounded-md text-sm py-2.5 px-5 cursor-pointer flex items-center align-middle gap-2">
            <div className="text-2xl">
              <IoIosAddCircleOutline />
            </div>
            <div className="uppercase">
              {t("addNew")} {t("role")}
            </div>
          </button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-col lg:flex-row justify-between flex-wrap items-start md:items-start lg:items-center gap-4 mb-6 px-4 py-4 bg-white rounded-md shadow-sm">
        <div className="w-full md:w-[45%]">
          <SearchData
            searchValue={searchValue}
            onSearchValue={setSearchValue}
          />
        </div>
      </div>

      <div className="relative min-h-[200px]">
        <DataTableCommon
          tableHead={tableHead}
          data={roleList}
          Actions={(item) => [
            <Button
              label="View"
              type="View"
              key="view"
              onClick={() => {
                setSelectedRoleId(item.id);
                setShowUserListModal(true);
              }}
            />,
            <Button
              url={`/edit-role/${item.id}`}
              label="Edit"
              type="Edit"
              key="edit"
            />,
            <Button
              onClick={() => {
                handleDelete(item.id);
              }}
              label="Delete"
              type="Delete"
              key="delete"
            />,
          ]}
          loading={isLoading}
        />

        {roleListData && (
          <Pagination
            currentPage={currentPage}
            paginatedData={roleListData}
            onPageChange={(page) => setCurrentPage(page)}
            onSetItemsPerPage={(itemsPerPage) => {
              setPerPage(itemsPerPage);
              setCurrentPage(1);
            }}
          />
        )}

        {showUserListModal && selectedRoleId && (
          <RoleModal
            roleId={selectedRoleId}
            onClose={() => setShowUserListModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RoleDetails;

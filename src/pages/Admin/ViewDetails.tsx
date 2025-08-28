import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axios/axiosInstance";
import type { IPaginatedResponse, ViewUserData } from "../../models/models";
import Button from "../../components/common/Button";
import { useDebounceValue } from "usehooks-ts";
import Pagination from "../../components/common/Pagination";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import DownloadCSV from "../search-csv/DownloadCSV";
import Modal from "./Modal";
import SearchData from "../search-csv/SearchData";
import DeleteModal from "../../components/common/DeleteModal";
import DataTableCommon from "./DataTableCommon";

const ViewDetails: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const { t } = useTranslation(["viewDetails", "sidebar", "common"]);
  const { role } = useParams() as { role?: string };
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue] = useDebounceValue(searchValue, 500);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  // const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentPage(1);
  }, [role, debouncedValue]);

  const tableHead: { text: string; key: keyof ViewUserData }[] = [
    { text: t("name"), key: "name" },
    { text: t("furigana"), key: "name_furigana" },
    { text: t("email"), key: "email" },
    { text: t("role"), key: "roles" },
    { text: t("phone"), key: "phone" },
  ];

  const {
    data: viewUserData,
    isLoading,
    isError,
  } = useQuery<IPaginatedResponse<ViewUserData[]>>({
    queryKey: ["viewUserData", role, debouncedValue, currentPage, perPage],
    queryFn: async () => {
      const response = await axiosInstance.get(
        role === "system-admin"
          ? `/users?search=${debouncedValue}`
          : `/users?role=${role}&search=${debouncedValue}`,
        {
          params: {
            page: currentPage,
            perPage: perPage,
          },
        }
      );
      return response.data as IPaginatedResponse<ViewUserData[]>;
    },
    enabled: !!role,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const userList = viewUserData
    ? viewUserData.data.map((user) => ({
        ...user,
        roles: user.roles.map((role) => role.name).join(", ") || "No Role",
      }))
    : [];

  const handleDelete = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      setSelectedUserId(null);
      setShowUserListModal(false);
      toast.success(response.data.message || t("common::delete_success"));
      queryClient.invalidateQueries({ queryKey: ["viewUserData"] });
    } catch (error) {
      if (isAxiosError(error)) {
        const apiError = error.response?.data;
        toast.error(apiError?.message || t("common::delete_failed"));
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  if (isError) return <div>Error fetching data</div>;

  return (
    <div>
      {/* Header */}
      <div className="pb-4 dark:bg-gray-900 flex justify-between items-center">
        <h2 className="uppercase text-black text-2xl font-bold">
          {role == "system-admin" ? `${t("administrator")}` : role}
        </h2>
        <Link to={`/create-users/${role}`} className="flex gap-2">
          <button className="text-white button-common hover:bg-blue-700 font-medium rounded-md text-sm py-2.5 px-5 cursor-pointer flex items-center gap-2">
            <div className="text-2xl">
              <IoIosAddCircleOutline />
            </div>
            <div className="uppercase">{`${t("addNew")} ${role === "system-admin" ? `${t("administrator")}` : role}`}</div>
          </button>
        </Link>
      </div>

      {/* Search and Download */}
      <div className="flex flex-col md:flex-col lg:flex-row justify-between items-start gap-4 mb-6 px-4 py-4 bg-white rounded-md shadow-sm">
        <div className="w-full">
          <SearchData
            searchValue={searchValue}
            onSearchValue={setSearchValue}
          />
        </div>
        <div className="w-full">
          <DownloadCSV />
        </div>
      </div>

      {/* Table */}
      <div className="relative min-h-[200px]">
        <DataTableCommon
          tableHead={tableHead}
          role={role}
          data={
            role === "system-admin"
              ? userList.filter(
                  (item) => !item.roles.toLowerCase().includes("student")
                )
              : userList
          }
          Actions={(item) => [
            <Button
              label={t("view")}
              type="View"
              key="view"
              onClick={() => {
                setSelectedUserId(item.id);
                setShowUserListModal(true);
              }}
            />,
            <Button
              url={`/edit/${item.id}`}
              label={t("edit")}
              type="Edit"
              key="edit"
            />,
            <Button
              onClick={() => {
                setDeleteUserId(item.id);
                setShowDeleteModal(true);
              }}
              label={t("delete")}
              type="Delete"
              key="delete"
            />,
          ]}
          loading={isLoading}
        />

        {/* Pagination */}
        {viewUserData && (
          <Pagination
            currentPage={currentPage}
            paginatedData={viewUserData}
            onPageChange={(page) => setCurrentPage(page)}
            onSetItemsPerPage={(itemsPerPage) => {
              setPerPage(itemsPerPage);
              setCurrentPage(1);
            }}
          />
        )}

        {/* View Modal */}
        {showUserListModal && selectedUserId && (
          <Modal
            userId={selectedUserId}
            onClose={() => setShowUserListModal(false)}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            if (deleteUserId) {
              await handleDelete(deleteUserId);
              setShowDeleteModal(false);
            }
          }}
        />
        
      </div>
    </div>
  );
};

export default ViewDetails;

import React, { useEffect, useState } from "react";
import type { Grade, IPaginatedResponse } from "../../models/models";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import SearchData from "../search-csv/SearchData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import axiosInstance from "../../axios/axiosInstance";
import ClassTable from "./ClassTable";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import DeleteModal from "../../components/common/DeleteModal";
import ClassModal from "./ClassModal";
import { useTranslation } from "react-i18next";
type TableHeadItem = {
  text: string;
  key: keyof Grade;
  render?: (item: Grade) => React.ReactNode;
};

const ClassDetailsPage: React.FC = () => {
  const { t } = useTranslation(["viewDetails", "common","class"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue] = useDebounceValue(searchValue, 500);
  const [classItemId, setClassItemId] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [showClassListModal, setShowClassListModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedValue]);
  const {
    data: classData,
    isLoading,
    isError,
  } = useQuery<IPaginatedResponse<Grade[]>>({
    queryKey: ["classData", debouncedValue, currentPage, perPage],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/grades?search=${debouncedValue}`,
        {
          params: { page: currentPage, perPage },
        }
      );
      return response.data as IPaginatedResponse<Grade[]>;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
  const tableHead: TableHeadItem[] = [
    { text: t("class_name"), key: "name" },
    { text: t("description"), key: "description" },
    {
      text: t("teacher"),
      key: "teacher",
      render: (item) => item.teacher.name ?? "-",
    },
    { text: t("classroom"), key: "classroom" },
  ];
  const handleDelete = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/grades/${id}`);
      setClassItemId(null);
      setShowClassListModal(false);
      toast.success(response.data.message || t("common::delete_success"));
      queryClient.invalidateQueries({ queryKey: ["classData"] });
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
        <h2 className="uppercase text-black text-2xl font-bold">{t("class::classes")}</h2>
        <Link to={`/create-class`} className="flex gap-2">
          <button className="text-white button-common hover:bg-blue-700 font-medium rounded-md text-sm py-2.5 px-5 cursor-pointer flex items-center gap-2">
            <div className="text-2xl">
              <IoIosAddCircleOutline />
            </div>
            <div className="uppercase">{t("addNew")} {t("class")}</div>
          </button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-col lg:flex-row justify-between flex-wrap items-start md:items-start lg:items-center gap-4 mb-6 px-4 py-4 bg-white rounded-md shadow-sm">
        <div className="w-full">
          <SearchData
            searchValue={searchValue}
            onSearchValue={setSearchValue}
          />
        </div>
      </div>

      {/* Table */}
      <ClassTable
        tableHead={tableHead}
        data={classData?.data || []}
        Actions={(classItem) => [
          <Button
            label={t("view")}
            type="View"
            key="view"
            onClick={() => {
              setClassItemId(classItem.id);
              setShowClassListModal(true);
            }}
          />,
          <Button
            url={`/edit-class/${classItem.id}`}
            label={t("edit")}
            type="Edit"
            key="edit"
          />,
          <Button
            onClick={() => {
              setDeleteUserId(classItem.id);
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
      {classData && (
        <Pagination
          currentPage={currentPage}
          paginatedData={classData}
          onPageChange={(page) => setCurrentPage(page)}
          onSetItemsPerPage={(itemsPerPage) => {
            setPerPage(itemsPerPage);
            setCurrentPage(1);
          }}
        />
      )}

      {/* View Modal */}
      {showClassListModal && classItemId && (
        <ClassModal
          classId={classItemId}
          onClose={() => setShowClassListModal(false)}
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
  );
};

export default ClassDetailsPage;

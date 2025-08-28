import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axios/axiosInstance";
import type { IPaginatedResponse, Student } from "../../models/models";
import { useDebounceValue } from "usehooks-ts";
import SearchData from "../search-csv/SearchData";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import DeleteModal from "../../components/common/DeleteModal";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import StudentTableComponent from "./StudentTableComponent";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import StudentModal from "./StudentModal";
import StudentCSV from "./Student CSV/StudentCSV";
import { useTranslation } from "react-i18next";

const StudentDetails: React.FC = () => {
  const { t } = useTranslation(["viewDetails", "student"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue] = useDebounceValue(searchValue, 500);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [showClassListModal, setShowClassListModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedValue]);

  const {
    data: studentData,
    isLoading,
    isError,
  } = useQuery<IPaginatedResponse<Student[]>>({
    queryKey: ["studentUserData", debouncedValue, currentPage, perPage],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/students?search=${debouncedValue}`,
        {
          params: { page: currentPage, perPage },
        }
      );
      return response.data as IPaginatedResponse<Student[]>;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const studentLists = studentData?.data || [];

  type TableHeadItem = {
    text: string;
    key: keyof Student;
    render?: (item: Student) => React.ReactNode;
  };

  const tableHead: TableHeadItem[] = [
    { text: t("name"), key: "name" },
    { text: t("student_id"), key: "student_id" },
    { text: t("email"), key: "email" },
    {
      text: t("class"),
      key: "grade",
      render: (item) => item.grade?.name ?? "-",
    },
  ];

  const handleDelete = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/students/${id}`);
      setSelectedStudentId(null);
      setShowClassListModal(false);
      toast.success(response.data.message || "User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["studentUserData"] });
    } catch (error) {
      if (isAxiosError(error)) {
        const apiError = error.response?.data;
        toast.error(apiError?.message || "Delete failed!");
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
          {t("student::student_details")}
        </h2>
        <Link to={`/create-students`} className="flex gap-2">
          <button className="text-white button-common hover:bg-blue-700 font-medium rounded-md text-sm py-2.5 px-5 cursor-pointer flex items-center gap-2">
            <div className="text-2xl">
              <IoIosAddCircleOutline />
            </div>
            <div className="uppercase">{t("student::add_new_student")}</div>
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
          <StudentCSV />
        </div>
      </div>

      {/* Table */}
      <div className="relative min-h-[200px]">
        <StudentTableComponent
          tableHead={tableHead}
          data={studentLists}
          Actions={(studentItem) => [
            <Button
              label={t("view")}
              type="View"
              key="view"
              onClick={() => {
                setSelectedStudentId(studentItem.id);
                setShowClassListModal(true);
              }}
            />,
            <Button
              url={`/edit-students/${studentItem.id}`}
              label={t("edit")}
              type="Edit"
              key="edit"
            />,
            <Button
              onClick={() => {
                setDeleteUserId(studentItem.id);
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
        {studentData && (
          <Pagination
            currentPage={currentPage}
            paginatedData={studentData}
            onPageChange={(page) => setCurrentPage(page)}
            onSetItemsPerPage={(itemsPerPage) => {
              setPerPage(itemsPerPage);
              setCurrentPage(1);
            }}
          />
        )}

        {/* View Modal */}
        {showClassListModal && selectedStudentId && (
          <StudentModal
            studentId={selectedStudentId}
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
    </div>
  );
};

export default StudentDetails;

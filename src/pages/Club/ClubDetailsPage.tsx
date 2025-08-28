import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Club, IPaginatedResponse } from "../../models/models";
import axiosInstance from "../../axios/axiosInstance";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import SearchData from "../search-csv/SearchData";
import { useEffect, useState } from "react";
import ClubTable from "./ClubTable";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import { useDebounceValue } from "usehooks-ts";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import DeleteModal from "../../components/common/DeleteModal";
import ClubModal from "./ClubModal";
import { useTranslation } from "react-i18next";

const ClubDetailsPage = () => {
  const { t } = useTranslation(["viewDetails", "common", "class"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [clubItemId, setClubItemId] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [debouncedValue] = useDebounceValue(searchValue, 500);
  const [showClubListModal, setShowClubListModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedValue]);

  const {
    data: clubData,
    isLoading,
    isError,
  } = useQuery<IPaginatedResponse<Club[]>>({
    queryKey: ["clubData", debouncedValue, currentPage, perPage],

    queryFn: async () => {
      const response = await axiosInstance.get(
        `/clubs?search=${debouncedValue}`,
        {
          params: { page: currentPage, perPage },
        }
      );

      return response.data as IPaginatedResponse<Club[]>;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
  console.log(clubData);
  type CLubTableHead = {
    text: string;
    key: keyof Club;
  };
  const tableHead: CLubTableHead[] = [
    { text: t("club_name"), key: "name" },
    { text: t("description"), key: "description" },
    { text: t("advisor"), key: "advisor" },
    { text: t("location"), key: "location" },
  ];
  const handleDelete = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/clubs/${id}`);
      setClubItemId(null);
      setShowClubListModal(false);
      toast.success(response.data.message || t("common::delete_success"));
      queryClient.invalidateQueries({ queryKey: ["clubData"] });
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
          {t("class::clubs")}
        </h2>
        <Link to={`/create-club`} className="flex gap-2">
          <button className="text-white button-common hover:bg-blue-700 font-medium rounded-md text-sm py-2.5 px-5 cursor-pointer flex items-center gap-2">
            <div className="text-2xl">
              <IoIosAddCircleOutline />
            </div>
            <div className="uppercase">
              {t("addNew")} {t("class::club")}
            </div>
          </button>
        </Link>
      </div>
      {/* Search */}
      <div className="flex flex-col md:flex-col lg:flex-row justify-between items-start gap-4 mb-6 px-4 py-4 bg-white rounded-md shadow-sm">
        <div className="w-full">
          <SearchData
            searchValue={searchValue}
            onSearchValue={setSearchValue}
          />
        </div>
      </div>
      {/* Table */}

      <ClubTable
        tableHead={tableHead}
        data={clubData?.data || []}
        Actions={(clubItem) => [
          <Button
            label={t("view")}
            type="View"
            key="view"
            onClick={() => {
              setClubItemId(clubItem.id);
              setShowClubListModal(true);
            }}
          />,
          <Button
            url={`/edit-club/${clubItem.id}`}
            label={t("edit")}
            type="Edit"
            key="edit"
          />,
          <Button
            onClick={() => {
              setDeleteUserId(clubItem.id);
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
      {clubData && (
        <Pagination
          currentPage={currentPage}
          paginatedData={clubData}
          onPageChange={(page) => setCurrentPage(page)}
          onSetItemsPerPage={(itemsPerPage) => {
            setPerPage(itemsPerPage);
            setCurrentPage(1);
          }}
        />
      )}

      {/* View Modal */}
      {showClubListModal && clubItemId && (
        <ClubModal
          clubId={clubItemId}
          onClose={() => setShowClubListModal(false)}
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

export default ClubDetailsPage;

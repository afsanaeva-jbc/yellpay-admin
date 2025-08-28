import { useTranslation } from "react-i18next";
import type { IPaginatedResponse } from "../../models/models";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

type Props = {
  paginatedData: Omit<IPaginatedResponse<unknown[]>, "data">;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSetItemsPerPage: (itemsPerPage: number) => void;
};

function Pagination({
  currentPage,
  paginatedData,
  onPageChange,
  onSetItemsPerPage,
}: Props) {
  const totalPages = paginatedData.meta.last_page;
  const { t } = useTranslation("viewDetails");

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages); // Always show last page
    }

    return pages;
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between mt-6 gap-4">
      {/* Items per page */}
      <div className="flex items-center w-full gap-4">
        <label
          htmlFor="itemsPerPage"
          className="text-base font-bold text-[#D5242A] uppercase"
        >
          {t("itemsPerPage")}
        </label>
        <select
          id="itemsPerPage"
          value={paginatedData.meta.per_page}
          aria-label="Items per page"
          className="w-28 px-3 py-2 text-sm rounded-md bg-white text-gray-700"
          onChange={(e) => onSetItemsPerPage(parseInt(e.target.value))}
        >
          {[5, 10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center flex-wrap justify-end md:w-full gap-1">
        {/* Previous button */}
        <button
          aria-label="Previous Page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`bg-white rounded border px-3 py-1 disabled:opacity-50 ${
            currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
          } text-2xl`}
        >
          <MdKeyboardArrowLeft />
        </button>

        {/* Page number buttons */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() =>
              typeof page === "number" ? onPageChange(page) : undefined
            }
            disabled={page === "..."}
            className={`px-3 py-1 rounded border text-sm transition ${
              page === "..."
                ? "text-gray-400 bg-white cursor-default"
                : currentPage === page
                  ? "bg-gradient-to-br from-blue-700 to-blue-400 text-white"
                  : "bg-white text-blue-600 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          aria-label="Next Page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`bg-white rounded border px-3 py-1 disabled:opacity-50 ${
            currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"
          } text-2xl`}
        >
          <MdKeyboardArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Pagination;

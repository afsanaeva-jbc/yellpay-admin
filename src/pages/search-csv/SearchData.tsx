import React from "react";
import { useTranslation } from "react-i18next";
import { CiSearch } from "react-icons/ci";

interface DownloadCSVProps {
  searchValue: string;
  onSearchValue?: (value: string) => void;
}

const SearchData: React.FC<DownloadCSVProps> = ({
  searchValue,
  onSearchValue,
}) => {
  const { t } = useTranslation("viewDetails");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchValue?.(value);
  };
  return (
    <div >
      <div className="flex flex-col w-full ">
        <label
          htmlFor="search"
          className="text-[#D5242A] font-bold text-sm mb-2"
        >
          {t("searchLabel")}
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CiSearch className="text-gray-500 " />
          </div>
          <input
            type="search"
            id="search"
            value={searchValue}
            onChange={handleChange}
            className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
            placeholder={`${t("searchPlaceholder")}`}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchData;

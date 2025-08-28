import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../../components/common/TableProps";
import { useTranslation } from "react-i18next";

type DataTableCommonBase = {
  avatar?: string | null;
  name?: string;
  name_furigana?: string;
};

type StudentTableProps<T extends DataTableCommonBase> = {
  tableHead: {
    text: string;
    key: keyof T;
    render?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  Actions: (item: T) => React.ReactNode[];
  loading?: boolean;
};

const StudentTableComponent = <T extends DataTableCommonBase>({
  tableHead,
  data,
  Actions,
  loading = false,
}: StudentTableProps<T>): React.ReactElement => {
  const { t } = useTranslation("viewDetails");
  const skeletonCount = loading && data.length > 0 ? data.length : 5;

  return (
    <div className="relative">
      <div className="relative overflow-x-auto shadow-md shadow-gray-100 rounded-lg h-[405px] bg-white">
        <Table>
          {/* Table Head */}
          <TableHead>
            <TableRow className="bg-gradient-to-r from-[#BBD8F2] to-[#78ACF5] text-black">
              {tableHead.map((tableHeadText, index) => (
                <TableHeaderCell className="text-start" key={index}>
                  {tableHeadText.text}
                </TableHeaderCell>
              ))}
              <TableHeaderCell>{t("actions")}</TableHeaderCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {loading ? (
              Array.from({ length: skeletonCount }).map((_, idx) => (
                <TableRow key={idx}>
                  {tableHead.map((head, cellIdx) => (
                    <TableCell key={cellIdx} className="px-6 py-2">
                      {head.key === "name" ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                          <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                      ) : (
                        <div className="h-4 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2 justify-around">
                      <div className="w-6 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableHead.length + 1}
                  className="text-center px-6 py-6"
                >
                  NO DATA FOUND
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index} className="text-sm">
                  {tableHead.map((head, headIndex) => (
                    <TableCell className="text-start px-4 py-4" key={headIndex}>
                      {head.render ? (
                        head.render(item)
                      ) : head.key === "name" ? (
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 bg-gradient-to-br from-green-600 to-green-300
                            text-white rounded-full flex items-center justify-center text-base font-bold overflow-hidden`}
                          >
                            {item.avatar &&
                            typeof item.avatar === "string" &&
                            item.avatar !== "null" &&
                            item.avatar !== "" ? (
                              <img
                                src={item.avatar}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (item.name as string)
                                ?.split(" ")
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-black">{item[head.key] as string}</span>
                            <span className="text-gray-400 text-xs">{item.name_furigana}</span>
                          </div>
                        </div>
                      ) : typeof item[head.key] === "object" ? (
                        JSON.stringify(item[head.key])
                      ) : (
                        (item[head.key] as string)
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="flex gap-2 justify-around items-center px-6 py-6">
                    {Actions(item).map((action, id) => (
                      <span
                        className="flex justify-center items-center"
                        key={id}
                      >
                        {action}
                      </span>
                    ))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentTableComponent;

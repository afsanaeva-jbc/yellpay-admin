import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../../components/common/TableProps";
import { PiGraduationCap } from "react-icons/pi";
import { useTranslation } from "react-i18next";
type DataTableCommonBase = {
  name?: string;
};
type ClassTableProps<T extends DataTableCommonBase> = {
  tableHead: {
    text: string;
    key: keyof T;
    render?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  Actions: (item: T) => React.ReactNode[];
  loading?: boolean;
};

const ClassTable = <T extends DataTableCommonBase>({
  tableHead,
  data,
  Actions,
  loading = false,
}: ClassTableProps<T>): React.ReactElement => {
  const skeletonCount = loading && data.length > 0 ? data.length : 5;
  console.log(data);
  const { t } = useTranslation(["viewDetails", "common"]);
  return (
    <div className="relative">
      <div className={`relative overflow-x-auto shadow-md shadow-gray-100 rounded-lg ${data.length > 5 ? " h-[400px]" : ""}`}
      >
        <Table>
          <TableHead>
            <TableRow className="bg-gradient-to-r from-[#BBD8F2] to-[#78ACF5] text-black">
              {tableHead.map((tableHeadText, index) => (
                <TableHeaderCell key={index} className="text-start">
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
                    <TableCell key={cellIdx} className="px-4 py-2">
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
                  {tableHead.map((head, cellIndex) => (
                    <TableCell
                      className={`text-start px-4 py-4 ${
                        head.key === "name" ? "w-[180px]" : ""
                      } ${
                        head.key === "description" ? "w-full md:w-[400px]" : ""
                      } ${
                        head.key === "teacher" ? "w-[120px]" : ""
                      }`}
                      key={cellIndex}
                    >
                      {head.render ? (
                        head.render(item)
                      ) : head.key === "name" ? (
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 bg-gradient-to-br from-green-600 to-green-300
                            text-white rounded-full text-base font-bold overflow-hidden`}
                          >
                            <PiGraduationCap className="text-xl" />
                          </div>
                          <div>{item.name}</div>
                        </div>
                      ) : typeof item[head.key] === "object" ? (
                        JSON.stringify(item[head.key])
                      ) : (
                        (item[head.key] as string)
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="px-6 py-2">
                    <div className="flex gap-2 justify-around">
                      {Actions(item).map((action, actionIdx) => (
                        <div key={actionIdx}>{action}</div>
                      ))}
                    </div>
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

export default ClassTable;

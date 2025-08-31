import React, { useState } from "react";
import { GoPeople } from "react-icons/go";
import { FiSearch, FiPlus } from "react-icons/fi";
import SelectInput from "./SelectDropdown";

const Table = ({
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) => (
  <table className="min-w-full divide-y divide-gray-200" {...props}>
    {children}
  </table>
);

const TableHead = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead {...props}>{children}</thead>
);

const TableBody = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className="bg-white divide-y divide-gray-200" {...props}>
    {children}
  </tbody>
);

const TableRow = ({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={className} {...props}>
    {children}
  </tr>
);

const TableHeaderCell = ({
  children,
  className = "",
  ...props
}: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
  <th
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    {...props}
  >
    {children}
  </th>
);

const TableCell = ({
  children,
  className = "",
  ...props
}: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`} {...props}>
    {children}
  </td>
);

// Types
type DataTableCommonBase = {
  id?: string | number;
  name?: string;
  description?: string;
  email?: string;
  status?: "active" | "inactive";
  businessType?: string;
};

type FilterOption = {
  label: string;
  value: string;
};

type TableColumn<T> = {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
};

type DynamicTableProps<T extends DataTableCommonBase> = {
  // Core table props
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;

  // Header props
  title?: string;

  // Search props
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;

  // Filter props
  showFilters?: boolean;
  statusFilter?: {
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  typeFilter?: {
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };

  // Add button props
  showAddButton?: boolean;
  addButtonText?: string;
  onAddNew?: () => void;

  // Action props
  actions?: (item: T) => React.ReactNode[];

  // Pagination props
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;

  // Empty state
  emptyStateText?: string;
  emptyStateIcon?: React.ReactNode;
};

const DynamicTable = <T extends DataTableCommonBase>({
  columns,
  data,
  loading = false,
  title = "Items",
  showSearch = true,
  searchPlaceholder = "Search...",
  onSearch,
  showFilters = true,
  statusFilter,
  typeFilter,
  showAddButton = true,
  addButtonText = "Add New Item",
  onAddNew,
  actions,
  showPagination = true,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  emptyStateText = "No data found",
  emptyStateIcon,
}: DynamicTableProps<T>): React.ReactElement => {
  const [searchTerm, setSearchTerm] = useState("");

  // Generate avatar colors and initials
  const getAvatarColor = (name?: string) => {
    if (!name) return "bg-gray-500";
    const colors = [
      "bg-pink-500",
      "bg-orange-500",
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-yellow-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const renderStatusBadge = (status?: string) => {
    const isActive = status?.toLowerCase() === "active";
    return (
      <span
        className={`inline-flex items-center px-3 py-0.5 rounded-md text-xs font-medium ${
          isActive
            ? "bg-green-100 text-green-800 font-semibold"
            : "bg-red-100 text-red-500 font-semibold"
        }`}
      >
        {status || "unknown"}
      </span>
    );
  };

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.render) {
      return column.render(item);
    }

    switch (column.key) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${getAvatarColor(item.name)} text-white rounded-full flex items-center justify-center font-semibold text-sm`}
            >
              {getInitials(item.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900 truncate">
                {item.name || "Unknown"}
              </div>
              {item.description && (
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        );

      case "status":
        return renderStatusBadge(item.status);

      case "email":
        return (
          <span className="text-sm text-gray-900">{item.email || "-"}</span>
        );

      case "businessType":
        return (
          <span className="text-sm text-gray-600 capitalize">
            {item.businessType || "-"}
          </span>
        );

      default: {
        const value = item[column.key];
        if (typeof value === "object" && value !== null) {
          return String((value as unknown as { name: string })?.name ?? "-");
        }
        return String(value || "-");
      }
    }
  };

  const skeletonCount = loading && data.length > 0 ? data.length : 5;
  
  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

        {showAddButton && (
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4 font-bold" />
            {addButtonText}
          </button>
        )}
      </div>

      {/* Filters and Search Section */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-lg border border-gray-200">
          {/* Search Box */}
          {showSearch && (
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm transition-colors"
              />
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <div className="flex gap-3 ">
              {statusFilter && (
                <div className="relative min-w-[140px]">
                  <SelectInput
                    placeholder={statusFilter.placeholder || "All Status"}
                    width="10rem"
                    options={statusFilter.options ?? []}
                    selectedValue={statusFilter.value}
                    onChange={(value) => statusFilter.onChange(value)}
                    onClear={typeof clearStatus === "function" ? clearStatus : undefined}
                  />
                </div>
              )}

              {typeFilter && (
                <div className="relative min-w-[140px]">
                  <SelectInput
                    placeholder={typeFilter.placeholder || "All Status"}
                    width="10rem"
                    options={typeFilter.options ?? []}
                    selectedValue={typeFilter.value}
                    onChange={(value) => typeFilter.onChange(value)}
                     onClear={typeof clearStatus === "function" ? clearType : undefined}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 mt-10 mb-3">
        <Table>
          <TableHead className="bg-gray-50 font-semibold">
            <TableRow>
              {columns.map((column, index) => (
                <TableHeaderCell
                  key={index}
                  className={`text-left font-medium text-gray-500 uppercase text-xs tracking-wider ${column.width || ""}`}
                >
                  {column.label}
                </TableHeaderCell>
              ))}
              {actions && (
                <TableHeaderCell className="text-left font-medium text-gray-500 uppercase text-xs tracking-wider">
                  Actions
                </TableHeaderCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: skeletonCount }).map((_, idx) => (
                <TableRow key={idx} className="border-b border-gray-100">
                  {columns.map((column, cellIdx) => (
                    <TableCell key={cellIdx} className="px-6 py-4">
                      {column.key === "name" ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-24 h-3 bg-gray-100 rounded animate-pulse"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      )}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center px-6 py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    {emptyStateIcon || (
                      <GoPeople className="text-4xl text-gray-300" />
                    )}
                    <span>{emptyStateText}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow
                  key={item.id || index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column, cellIndex) => (
                    <TableCell
                      className={`px-6 py-4 text-sm ${column.width || ""}`}
                      key={cellIndex}
                    >
                      {renderCell(item, column)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="px-6 py-4">
                      <div className="flex gap-1">
                        {actions(item).map((action, actionIdx) => (
                          <div key={actionIdx} className="flex items-center">
                            {action}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between px-6 py-1  bg-white">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            {title.toLowerCase()}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (page > totalPages) return null;

              return (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    page === currentPage
                      ? "bg-red-600 text-white"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;

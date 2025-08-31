import React, { useState } from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import DynamicTable from "../../components/common/TableComponent";

// Merchant data type
type Merchant = {
  id: string | number;
  name: string;
  description?: string;
  businessType: string;
  email: string;
  status: "active" | "inactive";
};

const MerchantPage: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading] = useState(false);

  // Sample merchant data
  const merchantData: Merchant[] = [
    {
      id: 1,
      name: "Tech Solutions Inc.",
      description: "Leading provider of IT solutions and...",
      businessType: "Service",
      email: "contact@techsolutions.com",
      status: "active",
    },
    {
      id: 2,
      name: "Fresh Market Grocery",
      description: "Family-owned grocery store special...",
      businessType: "Retail",
      email: "info@freshmarket.com",
      status: "active",
    },
    {
      id: 3,
      name: "Bella Vista Restaurant",
      description: "Authentic Italian cuisine with a mo...",
      businessType: "Restaurant",
      email: "reservations@bellavista.com",
      status: "inactive",
    },
  ];

  // Apply filters to data
  const filteredData = merchantData.filter((merchant) => {
    const matchesSearch =
      !searchTerm ||
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.businessType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || merchant.status === statusFilter;
    const matchesType =
      !typeFilter ||
      merchant.businessType.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  // Define columns for merchant table
  const merchantColumns = [
    {
      key: "name" as const,
      label: "NAME",
      width: "w-80",
    },
    {
      key: "businessType" as const,
      label: "BUSINESS TYPE",
    },
    {
      key: "email" as const,
      label: "EMAIL",
    },
    {
      key: "status" as const,
      label: "STATUS",
    },
  ];

  // Filter options
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const typeOptions = [
    { label: "Service", value: "service" },
    { label: "Retail", value: "retail" },
    { label: "Restaurant", value: "restaurant" },
    { label: "Technology", value: "technology" },
    { label: "Healthcare", value: "healthcare" },
  ];

  // Event handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    console.log("Searching for:", term);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
    console.log("Filter by status:", status);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setCurrentPage(1); // Reset to first page when filtering
    console.log("Filter by type:", type);
  };

  // Clear filter functions
  const handleClearStatusFilter = () => {
    setStatusFilter("");
    setCurrentPage(1);
    console.log("Status filter cleared");
  };

  const handleClearTypeFilter = () => {
    setTypeFilter("");
    setCurrentPage(1);
    console.log("Type filter cleared");
  };

  const handleAddNew = () => {
    // Navigate to add merchant page or open modal
    console.log("Add new merchant clicked");
    alert("Add new merchant functionality would be implemented here");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleView = (merchant: Merchant) => {
    console.log("View merchant:", merchant);
    alert(`Viewing merchant: ${merchant.name}`);
  };

  const handleEdit = (merchant: Merchant) => {
    console.log("Edit merchant:", merchant);
    alert(`Editing merchant: ${merchant.name}`);
  };

  const handleDelete = (merchant: Merchant) => {
    console.log("Delete merchant:", merchant);
    if (confirm(`Are you sure you want to delete ${merchant.name}?`)) {
      alert(`Deleting merchant: ${merchant.name}`);
      // Implement delete logic here
    }
  };

  // Action buttons for each row
  const getActions = (merchant: Merchant) => [
    <button
      key="view"
      onClick={() => handleView(merchant)}
      className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
      title="View merchant"
    >
      <FiEye className="w-4 h-4" />
    </button>,
    <button
      key="edit"
      onClick={() => handleEdit(merchant)}
      className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-md hover:bg-green-50"
      title="Edit merchant"
    >
      <FiEdit className="w-4 h-4" />
    </button>,
    <button
      key="delete"
      onClick={() => handleDelete(merchant)}
      className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
      title="Delete merchant"
    >
      <FiTrash2 className="w-4 h-4" />
    </button>,
  ];

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / 10);
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div>
      <DynamicTable
        title="Merchants"
        columns={merchantColumns}
        data={currentData}
        loading={loading}
        showSearch={true}
        searchPlaceholder="Search merchants..."
        onSearch={handleSearch}
        showFilters={true}
        statusFilter={{
          options: statusOptions,
          value: statusFilter,
          onChange: handleStatusFilter,
          onClear: handleClearStatusFilter,
          placeholder: "All Status",
        }}
        typeFilter={{
          options: typeOptions,
          value: typeFilter,
          onChange: handleTypeFilter,
          onClear: handleClearTypeFilter,
          placeholder: "All Types",
        }}
        showAddButton={true}
        addButtonText="Add New Merchant"
        onAddNew={handleAddNew}
        actions={getActions}
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={10}
        onPageChange={handlePageChange}
        emptyStateText="No merchants found"
      />
    </div>
  );
};

export default MerchantPage;
import React, { useState } from "react";
import DynamicTable from "../../components/common/TableComponent";
import PageWrapper from "../../layout/PageWrapper";
import IconButton from "../../components/common/Button";
import DialogActionButton from "../../components/common/DialogActionButton"
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(false);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [merchantToDelete, setMerchantToDelete] = useState<Merchant | null>(
    null,
  );

  // Snackbar state for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "warning" | "error"
  >("success");

  // Sample merchant data
  const [merchantData, setMerchantData] = useState<Merchant[]>([
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
    {
      id: 4,
      name: "Bella Vista Restaurant 2",
      description: "Authentic Italian cuisine with a mo...",
      businessType: "Restaurant",
      email: "reservations2@bellavista.com",
      status: "inactive",
    },
    {
      id: 5,
      name: "Tech Solutions Inc. 2",
      description: "Leading provider of IT solutions and...",
      businessType: "Service",
      email: "contact2@techsolutions.com",
      status: "active",
    },
  ]);

  // Helper function to show snackbar notifications
  const showNotification = (
    message: string,
    severity: "success" | "warning" | "error" = "success",
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

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
      width: "25%",
    },
    {
      key: "businessType" as const,
      label: "BUSINESS TYPE",
      width: "25%",
    },
    {
      key: "email" as const,
      label: "EMAIL",
      width: "25%",
    },
    {
      key: "status" as const,
      label: "STATUS",
      width: "25%",
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
    setCurrentPage(1);
    console.log("Searching for:", term);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    console.log("Filter by status:", status);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setCurrentPage(1);
    console.log("Filter by type:", type);
  };

  // Clear filter functions
  const handleClearStatusFilter = () => {
    setStatusFilter("");
    setCurrentPage(1);
    showNotification("Status filter cleared", "success");
  };

  const handleClearTypeFilter = () => {
    setTypeFilter("");
    setCurrentPage(1);
    showNotification("Type filter cleared", "success");
  };

const navigate = useNavigate();

  const handleAddNew = async () => {
    setLoading(true);
    try {
      navigate("/merchants/new"); 
    } catch (error) {
       console.error(error);
      showNotification("Failed to add new merchant", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleView = (merchant: Merchant) => {
     navigate("/merchants/details"); 
    showNotification(`Viewing merchant: ${merchant.name}`, "success");
  };

  const handleEdit = async (merchant: Merchant) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Edit merchant:", merchant);
      showNotification(
        `Merchant ${merchant.name} edited successfully`,
        "success",
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification("Failed to edit merchant", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (merchant: Merchant) => {
    setMerchantToDelete(merchant);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (merchantToDelete) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log("Deleting merchant:", merchantToDelete);

        // Remove merchant from the data
        setMerchantData((prevData) =>
          prevData.filter((merchant) => merchant.id !== merchantToDelete.id),
        );

        // Close dialog and reset state
        setIsDeleteDialogOpen(false);
        const deletedMerchantName = merchantToDelete.name;
        setMerchantToDelete(null);

        // Show success notification
        showNotification(
          `Merchant "${deletedMerchantName}" has been deleted successfully`,
          "success",
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        showNotification("Failed to delete merchant", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setMerchantToDelete(null);
  };

  //Table Action buttons 
const getActions = (merchant: Merchant) => [
  <IconButton
    key="view"
    type="View"
    label="View merchant"
    onClick={() => handleView(merchant)}
  />,
  <IconButton
    key="edit"
    type="Edit"
    label="Edit merchant"
    onClick={() => handleEdit(merchant)}
  />,
  <IconButton
    key="delete"
    type="Delete"
    label="Delete merchant"
    onClick={() => handleDelete(merchant)}
  />,
];

  // Delete dialog content and actions
  const deleteDialogContent = (
    <div style={{ color: "#666" }}>
      <p>
        Are you sure you want to delete the merchant "{merchantToDelete?.name}"
      </p>
      <p>This action cannot be undone.</p>
    </div>
  );

  const deleteDialogActions = (
    <>
     <DialogActionButton
      label="Cancel"
      variant="cancel"
      onClick={handleDeleteCancel}
    />
    <DialogActionButton
      label="Delete"
      variant="delete"
      onClick={handleDeleteConfirm}
    />
    </>
  );

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / 10);
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <PageWrapper
      loading={loading}
      open={snackbarOpen}
      setOpen={setSnackbarOpen}
      message={snackbarMessage}
      severity={snackbarSeverity}
      dialogueOpen={isDeleteDialogOpen}
      dialogueTitle="Delete Merchant"
      dialogueContent={deleteDialogContent}
      dialogueActions={deleteDialogActions}
      dialogueClose={handleDeleteCancel}
    >
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
    </PageWrapper>
  );
};

export default MerchantPage;

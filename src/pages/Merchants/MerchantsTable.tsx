import React, { useState, useMemo } from "react";
import DynamicTable from "../../components/common/TableComponent";
import PageWrapper from "../../layout/PageWrapper";
import IconButton from "../../components/common/Button";
import DialogActionButton from "../../components/common/DialogActionButton";
import { useNavigate } from "react-router-dom";
import { merchantHeader } from "./header";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("merchant");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [merchantToDelete, setMerchantToDelete] = useState<Merchant | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "warning" | "error">(
    "success"
  );
const headers = merchantHeader(t);
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

  // Helper function to show notifications
  const showNotification = (
    message: string,
    severity: "success" | "warning" | "error" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Filter data
  const filteredData = useMemo(() => {
    return merchantData.filter((merchant) => {
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
  }, [merchantData, searchTerm, statusFilter, typeFilter]);

  // Pagination logic
  const paginationData = useMemo(() => {
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    return { totalItems, totalPages, currentData };
  }, [filteredData, currentPage, itemsPerPage]);

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
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

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

  const handleAddNew = async () => {
    setLoading(true);
    try {
      navigate("/merchants/new");
    } catch (error) {
      console.error("Failed to navigate to add merchant:", error);
      showNotification("Failed to add new merchant", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (merchant: Merchant) => {
    navigate(`/merchants/details/${merchant.id}`);
    showNotification(`Viewing merchant: ${merchant.name}`, "success");
  };

  const handleEdit = async (merchant: Merchant) => {
    setLoading(true);
    try {
      navigate(`/merchants/edit/${merchant.id}`);
      await new Promise((resolve) => setTimeout(resolve, 800));
      showNotification(`Merchant ${merchant.name} edited successfully`, "success");
    } catch (error) {
      console.error('Error editing merchant:', error);
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
    if (!merchantToDelete) return;

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove merchant
      setMerchantData((prev) => prev.filter((m) => m.id !== merchantToDelete.id));

      // Close dialog
      setIsDeleteDialogOpen(false);
      const deletedName = merchantToDelete.name;
      setMerchantToDelete(null);

      // Adjust page if needed
      const updatedTotalItems = paginationData.totalItems - 1;
      const updatedTotalPages = Math.ceil(updatedTotalItems / itemsPerPage);
      if (currentPage > updatedTotalPages && updatedTotalPages > 0) {
        setCurrentPage(updatedTotalPages);
      }

      showNotification(`Merchant "${deletedName}" deleted successfully`, "success");
    } catch (error) {
      console.error('Error deleting merchant:', error);
      showNotification("Failed to delete merchant", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setMerchantToDelete(null);
  };

  // Table actions
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

  // Dialog content and actions
  const deleteDialogContent = (
    <div style={{ color: "#666" }}>
      <p>Are you sure you want to delete the merchant "{merchantToDelete?.name}"?</p>
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
        title={t("merchants")}
        columns={headers}
        data={paginationData.currentData}
        loading={loading}
        showSearch
        searchPlaceholder="ユーザーを検索..."
        onSearch={handleSearch}
        showFilters
        statusFilter={{
          options: statusOptions,
          value: statusFilter,
          onChange: handleStatusFilter,
          onClear: handleClearStatusFilter,
          placeholder: t( "all-status"),
        }}
        typeFilter={{
          options: typeOptions,
          value: typeFilter,
          onChange: handleTypeFilter,
          onClear: handleClearTypeFilter,
          placeholder: t("all-types"),
        }}
        showAddButton
        addButtonText={t("add-new-merchant")}
        onAddNew={handleAddNew}
        actions={getActions}
        showPagination
        currentPage={currentPage}
        totalPages={paginationData.totalPages}
        totalItems={paginationData.totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        emptyStateText="No merchants found matching your search"
        // ✅ Optional: pass custom icon
        // emptyStateIcon={<GoSearch className="text-5xl text-gray-300" />}
      />
    </PageWrapper>
  );
};

export default MerchantPage;
import React, { useState, useRef } from "react";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";
import { MdOutlineFileDownload } from "react-icons/md";
import toast from "react-hot-toast";
import axiosInstance from "../../axios/axiosInstance";
import type { ImportLogResult } from "../../models/models";
import { useDebounceValue } from "usehooks-ts";
import { useQueryClient } from "@tanstack/react-query";

const DownloadCSV: React.FC = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["viewDetails", "common"]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [importLogResult, setImportLogResult] =
    useState<ImportLogResult | null>(null);
  const [, setUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(true);
  const [debouncedProgress, setDebouncedProgress] = useDebounceValue(
    importLogResult?.progress,
    500
  );
  console.log(debouncedProgress);
  const headers = [
    { label: "name", key: "name" },
    { label: "name_furigana", key: "name_furigana" },
    { label: "email", key: "email" },
    { label: "phone", key: "phone" },
    { label: "role", key: "role" },
  ];

  const pollImportLog = async (): Promise<ImportLogResult | null> => {
    setIsProcessing(true);

    try {
      while (true) {
        const res = await axiosInstance.get("/import-logs?type=user_import");
        const result = res.data;
        setImportLogResult(result);

        if (result.status === "completed" || result.status === "failed") {
          setIsProcessing(false);
          setDebouncedProgress(result.progress);
          console.log("Polling completed:", result);
          return result;
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error("Polling error:", error);
      setIsProcessing(false);
      return null;
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFile = e.target.files?.[0];
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      setUploading(true);
      setImportLogResult(null);

      const response = await axiosInstance.post("users/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = await pollImportLog();
      setImportLogResult(result);

      if (result?.status === "completed") {
        toast.success(response.data?.message || t("common::csv_import_success"));
        queryClient.invalidateQueries({ queryKey: ["viewUserData"] });
      } else if (result?.status === "failed") {
        toast.error(response.data?.message || t("common::csv_import_failed"));
        setShowErrorModal(true);
      } else {
        toast.error(response.data?.message || "Unexpected import status.");
      }
    } catch (error) {
      toast.error("CSV upload failed!");
      console.error(error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between w-full">
      {/* CSV Upload */}
      <div className="flex flex-col w-full">
        <label className="text-[#D5242A] font-bold text-sm ml-4 mb-2">
          {t("bulkRegister")}
        </label>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleCsvUpload}
          accept=".csv"
          className="block text-sm text-gray-600 file:ml-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {/* Progress Bar */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-80">
            <div className="absolute inset-0 bg-gray-600 opacity-80 backdrop-blur-sm"/>
            <div className="relative w-full max-w-md p-4 bg-white rounded shadow border border-gray-200">
              <div className="mb-2 text-center text-sm text-gray-700 font-medium">
                {debouncedProgress
                  ? `Processing: ${debouncedProgress}%`
                  : "Processing..."}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div style={{ width: `${debouncedProgress || 0}%` }}
                  className={`bg-green-500 w-[${debouncedProgress || 0}%] h-full transition-all duration-500 ease-in-out`}
                  
                />
              </div>
            </div>
          </div>
        )}

        {/* Import Result */}
        {!isProcessing && importLogResult && (
          <div className="mt-6">
            <div className="mb-2 font-medium text-gray-700">
              Status:{" "}
              <span
                className={
                  importLogResult.status === "completed"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {importLogResult.status}
              </span>
              {importLogResult.status === "failed" &&
                importLogResult.rows?.some(
                  (row) => row.errors && Object.keys(row.errors).length > 0
                ) && (
                  <button
                    onClick={() => setShowErrorModal(true)}
                    className="ml-4 text-sm underline text-red-700 hover:text-red-900"
                  >
                    {t("viewDetails::csv_error_details")}
                  </button>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Download Template */}
      <div className="flex items-start md:items-center w-full mt-4 md:mt-0 justify-start md:justify-end">
        <CSVLink
          data={[]}
          filename="PR-template.csv"
          className="button-common hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-md flex items-center gap-2 cursor-pointer"
          headers={headers}
          target="_blank"
        >
          <MdOutlineFileDownload className="text-2xl" />
          {t("downloadTemplate")}
        </CSVLink>
      </div>

      {/* Error Modal */}
      {importLogResult?.status === "failed" &&
        importLogResult.rows?.some(
          (row) => row.errors && Object.keys(row.errors).length > 0
        ) &&
        showErrorModal && (
          <div className="fixed inset-0 z-50 flex justify-center items-center w-full max-h-full overflow-x-hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-gray-600 opacity-80 backdrop-blur-sm"
              onClick={() => setShowErrorModal(false)}
            />
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-md shadow-xl border border-red-300">
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
                onClick={() => setShowErrorModal(false)}
              >
                &times;
              </button>

              {/* Modal Heading */}
              <h2 className="text-xl font-bold text-red-600 mb-4">
                {t("viewDetails::csv_import_failed")}
              </h2>

              {/* Error Rows */}
              {importLogResult.rows
                .filter(
                  (row) => row.errors && Object.keys(row.errors).length > 0
                )
                .map((row, idx) => (
                  <div
                    key={idx}
                    className="mb-4 border border-red-300 p-4 rounded bg-red-50"
                  >
                    <div className="mb-1 font-semibold text-sm text-red-800">
                      Row #{row.row_number}
                    </div>
                    <pre className="text-xs text-gray-800 bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(row.row, null, 2)}
                    </pre>
                    <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                      {Object.entries(row.errors).map(([field, messages]) => (
                        <li key={field}>
                          <strong>{field}:</strong> {messages.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default DownloadCSV;

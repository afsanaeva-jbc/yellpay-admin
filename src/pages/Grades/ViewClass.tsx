import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios/axiosInstance";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import type { ClassData } from "../../models/models";
import { PropagateLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

type ClassProps = {
  classId: number | undefined;
};

const fetchClassDetails = async (
  classId: number | undefined
): Promise<ClassData> => {
  try {
    const response = await axiosInstance.get(`/grades/${classId}`);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data.message || "Failed to fetch data");
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

const ViewClass: React.FC<ClassProps> = ({ classId }) => {
  const {t} = useTranslation(["viewDetails", "class"])
  const { data: classDetails, isLoading } = useQuery<ClassData>({
    queryKey: ["classData", classId], // Add classId to avoid key collision
    queryFn: () => fetchClassDetails(classId),
    enabled: !!classId,
  });

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <PropagateLoader />
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load class details.
      </div>
    );
  }
  console.log(classDetails)

  return (
    <div className="px-6 pb-6 max-w-2xl mx-auto bg-white rounded shadow-md mt-6">
      <div className="space-y-2 text-gray-700">
        <div className="flex flex-col md:flex-row justify-between ">
          <div className="w-full md:w-[45%]">
          <label className="w-full block text-sm font-medium text-gray-600 uppercase">
            {t("class_name")}
          </label>
          <div className="mt-1 p-2 bg-gray-100 rounded">
            {classDetails.name}
          </div>
        </div>
        <div className="w-full md:w-[50%]">
          <label className="block text-sm font-medium text-gray-600 uppercase">
            {t("classroom")}
          </label>
          <div className="mt-1 p-2 bg-gray-100 rounded">
            {classDetails.classroom}
          </div>
        </div>
        </div>
        
        <div>
          <label className="text-sm font-medium uppercase">{t("teacher")}</label>{" "}
          <div className="mt-1 p-2 bg-gray-100 rounded w-[45%]">{classDetails.teacher?.name || "N/A"}</div>
          
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium uppercase ">{t("sub_teachers")}</label>{" "}
          {classDetails.subteachers.length > 0 ? (
            <ul className="list-disc ml-6">
              {classDetails.subteachers.map((sub) => (
                <li key={sub.id}>{sub.name}</li>
              ))}
            </ul>
          ) : (
            <div>Not assigned</div>
          )}
        </div>
      </div>
      <div className="mt-4">
          <label className="text-sm font-medium uppercase">{t("description")}</label>{" "}
          <div className="mt-1 p-2 bg-gray-100 rounded">
            {classDetails.description}
          </div>
          
        </div>
    </div>
  );
};

export default ViewClass;

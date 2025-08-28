import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ClassData } from "../../models/models";
import EditClass from "./EditClass";
import axiosInstance from "../../axios/axiosInstance";

const ClassEditPage = () => {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const { classId } = useParams<{ classId: string | undefined }>();
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axiosInstance.get(`/grades/${classId}`);
        setClassData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch class data", error);
      }
    };
    if (classId) {
      fetchClass();
    }
  },[classId]);
  return <EditClass classData={classData} classId={classId} />;
};

export default ClassEditPage;

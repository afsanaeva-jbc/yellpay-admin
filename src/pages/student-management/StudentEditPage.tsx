import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import type { Student } from "../../models/models";
import EditStudent from "./EditStudent";

const StudentEditPage: React.FC = () => {
  const [studentData, setStudentData] = useState<Student | null>(null);
  const { studentId } = useParams<{ studentId: string | undefined }>();
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axiosInstance.get(`/students/${studentId}`);
        setStudentData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  console.log("userData", studentId);
  console.log(studentData);
  return ( 
  <EditStudent 
  studentData={studentData} 
  student_id={studentId}
  />);
};

export default StudentEditPage;

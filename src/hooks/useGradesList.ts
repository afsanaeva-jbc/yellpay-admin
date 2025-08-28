import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState, useCallback, useRef } from "react";
import type { RootState } from "../app/store";
import axiosInstance from "../axios/axiosInstance";
import type { Student, ViewUserData } from "../models/models";
import { setGrades } from "../features/authSlice";

export const useGradesList = () => {
  const [teachers, setTeachers] = useState<ViewUserData[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const [currentTeacherPage, setCurrentTeacherPage] = useState(1);
  const [hasTeacherMore, setHasTeacherMore] = useState(true);
  const [hasStudentMore, setHasStudentMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const isFirstLoad = useRef(true); 

  const dispatch = useDispatch();
  const grades = useSelector((state: RootState) => state.auth.grades);
  const fetchStudents = useCallback(
    async (page: number) => {
      if (loading || !hasStudentMore) return;

      setLoading(true);
      try {
        const res = await axiosInstance.get("/students", {
          params: { page, perPage: 10 },
        });

        const newStudents: Student[] = res.data.data;

        setStudents((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const uniqueNew = newStudents.filter(
            (t) => !existingIds.has(t.id)
          );
          return [...prev, ...uniqueNew];
        });

        setHasStudentMore(res.data.hasMore ?? newStudents.length === 10);
        setCurrentStudentPage(page + 1);
        console.log("Fetched Student page:", page);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasStudentMore]
  );

  const fetchTeachers = useCallback(
    async (page: number) => {
      if (loading || !hasTeacherMore) return;

      setLoading(true);
      try {
        const res = await axiosInstance.get("/users?role=teacher", {
          params: { page, perPage: 10 },
        });

        const newTeachers: ViewUserData[] = res.data.data;

        setTeachers((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const uniqueNew = newTeachers.filter(
            (t) => !existingIds.has(t.id)
          );
          return [...prev, ...uniqueNew];
        });

        setHasTeacherMore(res.data.hasMore ?? newTeachers.length === 10);
        setCurrentTeacherPage(page + 1);
        console.log("Fetched Teacher page:", page);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasTeacherMore]
  );

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      fetchTeachers(1);
      fetchStudents(1)
    }
  }, [fetchTeachers, fetchStudents]);
  
  useEffect(() => {
    if (grades.length === 0) {
      axiosInstance.get("/grades").then((res) => {
        dispatch(setGrades(res.data.data));
      });
    }
  }, [dispatch, grades]);

  return {
    grades,
    teachers,
    students,
    loading,
    hasStudentMore,
    hasTeacherMore,
    fetchTeachers,
    currentStudentPage,
    currentTeacherPage,
    fetchStudents,
  };
};

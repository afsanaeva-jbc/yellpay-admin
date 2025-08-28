import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Club } from "../../models/models";
import axiosInstance from "../../axios/axiosInstance";
import EditClub from "./EditClub";

const ClubEditPage = () => {
  const [clubData, setClubData] = useState<Club | null>(null);
  const { clubId } = useParams<{ clubId: string | undefined }>();
  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await axiosInstance.get(`/clubs/${clubId}`);
        setClubData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch class data", error);
      }
    };
    if (clubId) {
      fetchClub();
    }
  },[clubId]);
  return <EditClub clubData={clubData} clubId={clubId} />;
};

export default ClubEditPage;

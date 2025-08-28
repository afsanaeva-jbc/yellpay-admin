import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import axiosInstance from "../../axios/axiosInstance";
import type { UserData } from "../../models/models";
import EditUser from "./EditUser";

const EditUserForm = () => {
  const { userId } = useParams<{ userId: string | undefined }>();
  const roles = useSelector((state: RootState) => state.auth.roles);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${userId}`);
        setUserData(res.data); 
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  console.log("userData", userData);

  return (
    <div>
      <EditUser
        userData={userData}
        roles={roles}
        userId={userId}
      />
    </div>
  );
};

export default EditUserForm;

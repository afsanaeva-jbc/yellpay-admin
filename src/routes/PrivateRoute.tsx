import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../app/store";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.token);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>
    {children}
  
  </>;
};

export default PrivateRoute;

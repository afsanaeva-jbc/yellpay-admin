// src/routes/router.tsx
import { createBrowserRouter, Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DocumentListPage from "../pages/DocumentListPage";
// import ChangePassword from "../pages/ChangePassword";
import AdminForm from "../pages/AdminForm";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ViewDetails from "../pages/Admin/ViewDetails";
import EditRolePage from "../pages/Role/EditRolePage";
import RoleDetails from "../pages/Role/RoleDetails";
import CreateRolePage from "../pages/Role/CreateRolePage";
import NotFound from "../pages/NotFound";
import CreateUserForm from "../pages/Admin/CreateUserForm";
import EditUserForm from "../pages/Admin/EditUserForm";
import Layout from "../layout";
import Merchants from "../pages/Merchants";
import CreateMerchantForm from "../pages/Merchants/CreateMerchants";
import EditMerchant from "../pages/Merchants/EditMerchant";
import MerchantDetailsPage from "../pages/Merchants/MerchantDetails";
import ChangePassword from "../pages/ChangePassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
       <Layout><Outlet /></Layout>
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "merchants", element: <Merchants /> },
      { path: "merchants/new", element: <CreateMerchantForm /> },
      { path: "merchants/details", element: <MerchantDetailsPage /> },
      { path: "merchants/edit/:id", element: <EditMerchant/> },
      { path: "doc-list", element: <DocumentListPage /> },
      { path: "create-admin", element: <AdminForm /> },
      { path: "edit/:userId", element: <EditUserForm /> },
      { path: "users/:role", element: <ViewDetails /> },
      { path: "create-users/:role", element: <CreateUserForm /> },

      // Roles Part
      { path: "roleList", element: <RoleDetails /> },
      { path: "edit-role/:role_id", element: <EditRolePage /> },
      { path: "createRole", element: <CreateRolePage /> },

    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/change-password", element: <ChangePassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "*", element: <NotFound /> },
]);

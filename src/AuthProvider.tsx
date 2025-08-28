// Replace your AuthProvider.tsx content with this:

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {  setCredentials } from "./features/authSlice";
import { AuthState } from "./models/models";
import { dummyAuthState } from "./data/dummyData";
import Loading from "./components/common/Loading";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, auto-login with dummy data after 1 second
    const initializeAuth = async () => {
      try {
        // Check if there's stored auth data
        const localStorageAuth = localStorage.getItem("auth");
        
        if (localStorageAuth) {
          const parsedAuth: AuthState = JSON.parse(localStorageAuth);
          
          if (parsedAuth.token && parsedAuth.user) {
            dispatch(setCredentials({
              token: parsedAuth.token,
              user: parsedAuth.user,
              message: parsedAuth.message || "Welcome back!"
            }));
          } else {
            // Auto-login with dummy data for demo
            dispatch(setCredentials({
              token: dummyAuthState.token!,
              user: dummyAuthState.user!,
              message: dummyAuthState.message!
            }));
            localStorage.setItem("auth", JSON.stringify(dummyAuthState));
          }
        } else {
          // Auto-login with dummy data for demo
          dispatch(setCredentials({
            token: dummyAuthState.token!,
            user: dummyAuthState.user!,
            message: dummyAuthState.message!
          }));
          localStorage.setItem("auth", JSON.stringify(dummyAuthState));
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Still set dummy data even if there's an error
        dispatch(setCredentials({
          token: dummyAuthState.token!,
          user: dummyAuthState.user!,
          message: "Demo mode activated"
        }));
        localStorage.setItem("auth", JSON.stringify(dummyAuthState));
      }
      
      setLoading(false);
    };

    // Simulate loading time
    setTimeout(initializeAuth, 1000);
  }, [dispatch]);

  if (loading) return <Loading />;

  return <>{children}</>;
};

export default AuthProvider;
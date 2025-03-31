/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import { toast } from "react-toastify";

const UserContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {
    const token = window.localStorage.getItem("token");
    if (!token) {
       console.error("No token found in local storage, please login to get started");
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User Profile:", response.data);
      setIsLoggedIn(true);
      setUser(response.data);
    } catch (error) {
      setIsLoggedIn(false);
      console.log("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (userCredentials) => {
    try {
      const response = await axios.post("http://localhost:8000/auth/login", userCredentials);
      console.log("Profile Fetched", response.data)
      window.localStorage.setItem("token", response.data?.token);
      toast.success(response.data?.msg);
      setIsLoggedIn(true);
      setUser(response.data)
    } catch (error) {
      console.error(error);
      // toast.error(error.response.data?.errMsg);
    }
  }; 

  const updatePassword = async (currentPassword, newPassword) => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    try {
      const response = await axios.put(
        "http://localhost:8000/auth/update-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Return success response
      return response.data;
    } catch (error) {
      // Handle specific error messages from the server
      if (error.response && error.response.data && error.response.data.errMsg) {
        throw new Error(error.response.data.errMsg);
      }
      // Generic error handling
      throw new Error("Failed to update password. Please try again.");
    }
  };

  const logout = async () => {
    try {
      window.localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error Logging out");
    }
  };

  const deletedAccount = async () => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required. Please login.");
      return;
    }
  
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible!")) {
      return; // Stop execution if the user cancels
    }
  
    try {
      const response = await axios.delete("http://localhost:8000/auth/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Remove user session and clear local storage
      window.localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
      toast.success(response.data?.msg || "Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.errMsg || "Failed to delete account. Please try again.");
    }
  };
  

  const context = {
    isLoggedIn: isLoggedIn,
    user: user,
    login: login,
    logout: logout,
    updatePassword: updatePassword,
    deletedAccount: deletedAccount,
  };

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
};

export default UserContextProvider;

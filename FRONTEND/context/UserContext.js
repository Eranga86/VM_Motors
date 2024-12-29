// FRONTEND/frontend/src/context/UserContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserSession = useCallback(async () => {
    console.log("Checking user session...");
    try {
      const response = await api.get("/user/check-session");
      if (response.data && response.data.user) {
        console.log("Session valid, user data:", response.data.user);
        setUser(response.data.user);
      } else {
        console.log("Session invalid, clearing user data");
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error checking user session:", error);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]); // Add this useEffect to check session on mount

  const login = useCallback(async (username, password) => {
    console.log("Login called with username:", username);
    try {
      const response = await api.post("/user/signin", { username, password });
      if (response.data && response.data.token) {
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        setLoading(false);
        return response.data.user;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true); // Set loading to true before logout process
    try {
      await api.post(
        "/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      setLoading(false); // Ensure loading is set to false after logout
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    checkUserSession,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigateTo = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get("/api/check-admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 ) {
          setIsAdmin(response.data.isAdmin);
        } else {
          setIsAdmin(false);
        }
        
      } catch (error) {
        console.error("Error fetching admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (isAdmin === false) {
      alert("You are not an admin");
      navigateTo("/");
    }
  }, [loading, isAdmin, navigateTo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-[1000px] overflow-hidden bg-gray-100">
      <DashboardSidebar />
      <div className="m-2 w-full">
        <Outlet />
      </div>
    </div>
  );
}

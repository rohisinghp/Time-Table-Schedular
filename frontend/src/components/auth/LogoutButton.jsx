import React from "react";
import toast from "react-hot-toast";
import { logout } from "../../services/logoutService";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      toast.success("Logged out!");
            localStorage.removeItem("user");

      navigate("/auth", { replace: true });
    } else {
      toast.error("Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-red-600"
    >
      Logout
    </button>
  );
}

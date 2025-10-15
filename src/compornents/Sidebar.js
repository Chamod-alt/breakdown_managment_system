import React from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {auth} from "../firebaseConfig";

const Sidebar = () => {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("You have been logged out successfully!");
      navigate("/"); // redirect to login page or home page
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <aside className="h-full sticky top-0 flex flex-col justify-between w-64 bg-gray-900 dark:bg-background-dark border-r border-green-200 dark:border-gray-700 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold dark:text-white tracking-tight mt-2 mb-16">
            System Breakdown
          </h2>
          <NavLink
            to="/Userdashboad"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-green-200 text-green-700 dark:bg-green-600 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`
            }
          >
            <span className="material-symbols-outlined">add_circle</span>
            <p className="text-sm font-medium">Submit New Report</p>
          </NavLink>

          <NavLink
            to="/Reporthistory"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-green-200 text-green-700 dark:bg-green-600 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`
            }
          >
            <span className="material-symbols-outlined">history</span>
            <p className="text-sm font-medium">Report History</p>
          </NavLink>

          <NavLink
            to="/Profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-green-200 text-green-700 dark:bg-green-600 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`
            }
          >
            <span className="material-symbols-outlined">account_circle</span>
            <p className="text-sm font-medium">Profile</p>
          </NavLink>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-medium"
        onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          <span className="truncate">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

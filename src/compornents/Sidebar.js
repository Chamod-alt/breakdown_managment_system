import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../firebaseConfig";

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState({
    name: "Loading...",
    email: "loading@system.com",
    profileImage: "https://www.w3schools.com/howto/img_avatar.png",
  });

  // 🔹 Load admin info from Realtime Database (or localStorage fallback)
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const snapshot = await get(ref(database, "users/uid_manager1"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAdminData({
            name: data.username || "Admin",
            email: data.email || "admin@system.com",
            profileImage:
              data.profileImage ||
              "https://www.w3schools.com/howto/img_avatar.png",
          });
        } else {
          console.warn("Admin data not found in database!");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    loadAdminData();
  }, []);

  return (
    <aside className="w-64 bg-gray-900 flex flex-col border-r border-gray-700 text-white">
      {/* Header */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-bold text-green-500">Admin Panel</h1>
      </div>

      {/* Admin Info */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-700">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
          style={{
            backgroundImage: `url(${adminData.profileImage})`,
          }}
        ></div>
        <div className="flex flex-col">
          <h1 className="text-base font-medium">{adminData.name}</h1>
          <p className="text-sm text-gray-400 truncate">{adminData.email}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col flex-1 p-4 gap-2">
        <NavLink
          to="/Dashboad"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`
          }
        >
          <span className="material-symbols-outlined">dashboard</span>
          <p className="text-sm font-medium">Dashboard</p>
        </NavLink>

        <NavLink
          to="/Report"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`
          }
        >
          <span className="material-symbols-outlined">history</span>
          <p className="text-sm font-medium">Reports History</p>
        </NavLink>

        <NavLink
          to="/Technition"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`
          }
        >
          <span className="material-symbols-outlined">engineering</span>
          <p className="text-sm font-medium">Technicians</p>
        </NavLink>

        <NavLink
          to="/Settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`
          }
        >
          <span className="material-symbols-outlined">settings</span>
          <p className="text-sm font-medium">Settings</p>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="mt-auto p-4 border-t border-gray-700">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <span className="material-symbols-outlined text-gray-300">logout</span>
          <p className="text-gray-300 text-sm font-medium">Logout</p>
        </NavLink>
      </div>
    </aside>
  );
}

import React, { useEffect, useState } from "react";
import Sidebar from "../compornents/Sidebar";
import { database } from "../firebaseConfig";
import { ref, onValue, update } from "firebase/database";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [adminNote, setAdminNote] = useState("");

  //  Fetch Reports (breakdowns)
  useEffect(() => {
    const reportsRef = ref(database, "breakdowns");
    const unsubscribe = onValue(reportsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formatted = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setReports(formatted.reverse());
        setFilteredReports(formatted.reverse());
      } else {
        setReports([]);
        setFilteredReports([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Technicians (users)
  useEffect(() => {
    const techRef = ref(database, "users");
    const unsubscribe = onValue(techRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formatted = Object.keys(data)
          .filter((key) => data[key].role === "technician")
          .map((key) => ({ uid: key, ...data[key] }));
        setTechnicians(formatted);
      } else {
        setTechnicians([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Filtering logic (search + status)
  useEffect(() => {
    let filtered = [...reports];
    if (filterStatus !== "all") {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((r) =>
        r.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredReports(filtered);
  }, [searchTerm, filterStatus, reports]);

  // Update status in Firebase
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedReport) return;
    const reportRef = ref(database, `breakdowns/${selectedReport.id}`);
    await update(reportRef, { status: newStatus });
    alert(`Status updated to ${newStatus}!`);
  };

  // Assign technician + admin note
  const handleAssignTechnician = async () => {
    if (!selectedReport) return alert("Select a report first!");
    if (!selectedTechnician) return alert("Please select a technician.");

    const reportRef = ref(database, `breakdowns/${selectedReport.id}`);
    await update(reportRef, {
      assignedTechnician: selectedTechnician,
      adminNote: adminNote || "",
    });

    alert("Technician assigned successfully!");
    setSelectedTechnician("");
    setAdminNote("");
  };

  //  Summary counts
  const totalReports = reports.length;
  const pending = reports.filter((r) => r.status === "pending").length;
  const inProgress = reports.filter((r) => r.status === "inprogress").length;
  const completed = reports.filter((r) => r.status === "approved").length;

  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-900 text-white">
        <header className="flex flex-wrap justify-between items-center gap-4 p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex flex-col gap-1">
            <p className="text-2xl font-bold">Admin Dashboard</p>
            <p className="text-gray-400 text-sm">
              Overview of system status and technician activity.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center rounded-lg h-10 px-4 bg-gray-700 hover:bg-gray-600 text-sm font-bold"
            >
              <span className="material-symbols-outlined mr-2">refresh</span>
              Refresh
            </button>
            
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/*  Report Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 flex flex-col gap-6">
              <h2 className="text-lg font-bold">Report Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-900/40 p-4 rounded-lg">
                  <p className="text-sm text-blue-300">Total Reports</p>
                  <p className="text-3xl font-bold text-white mt-1">{totalReports}</p>
                </div>
                <div className="bg-yellow-900/40 p-4 rounded-lg">
                  <p className="text-sm text-yellow-300">Pending</p>
                  <p className="text-3xl font-bold text-white mt-1">{pending}</p>
                </div>
                <div className="bg-orange-900/40 p-4 rounded-lg">
                  <p className="text-sm text-orange-300">In Progress</p>
                  <p className="text-3xl font-bold text-white mt-1">{inProgress}</p>
                </div>
                <div className="bg-green-900/40 p-4 rounded-lg">
                  <p className="text-sm text-green-300">Completed</p>
                  <p className="text-3xl font-bold text-white mt-1">{completed}</p>
                </div>
              </div>
            </div>

            {/*Technicians Summary */}
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold">Technicians Summary</h2>
              <div className="flex items-center gap-4">
                <div className="bg-green-900/40 p-3 rounded-full">
                  <span className="material-symbols-outlined text-green-400 text-3xl">
                    engineering
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Technicians</p>
                  <p className="text-2xl font-bold">{technicians.length}</p>
                </div>
              </div>
              <Link to ="/Technition"
                className="flex items-center justify-center mt-auto rounded-lg h-10 px-4 bg-green-700 hover:bg-green-600 text-white text-sm font-bold"
              >
                Manage Technicians
                <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/*  Reports Table */}
          <div className="mt-6 bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">New/Pending Reports</h2>
              <input
                type="text"
                placeholder="Search reports..."
                className="rounded-lg bg-gray-700 text-white px-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-700">
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Issue</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.slice(0, 5).map((report) => (
                    <tr
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className="border-b border-gray-700 text-sm hover:bg-gray-700/50 cursor-pointer"
                    >
                      <td className="py-3 px-4 font-medium">{report.itemName}</td>
                      <td className="py-3 px-4">{report.message || "N/A"}</td>
                      <td className="py-3 px-4">{report.reporterName || "Unknown"}</td>
                      <td className="py-3 px-4">{report.location || "—"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            report.status === "Pending"
                              ? "bg-yellow-400 text-black"
                              : report.status === "In Progress"
                              ? "bg-orange-400 text-black"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {report.status || "New"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          className="text-green-400 hover:underline font-medium text-sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-400">
                        No reports found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ✅ Technician Assignment Panel */}
          {selectedReport && (
            <div className="mt-6 bg-gray-800 p-6 rounded-lg">
              <h2 className="text-lg font-bold mb-4">Manage Report</h2>
              <p className="mb-2 text-gray-300">
                <strong>Report ID:</strong> {selectedReport.id}
              </p>
              <p className="mb-2 text-gray-300">
                <strong>Issue:</strong> {selectedReport.message}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block mb-2 text-gray-400">Assign Technician</label>
                  <select
                    value={selectedTechnician}
                    onChange={(e) => setSelectedTechnician(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg p-2 text-white"
                  >
                    <option value="">Select technician</option>
                    {technicians.map((tech) => (
                      <option key={tech.uid} value={tech.name}>
                        {tech.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-gray-400">Admin Note</label>
                  <input
                    type="text"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg p-2 text-white"
                    placeholder="Optional notes"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-4">
                <button
                  onClick={handleAssignTechnician}
                  className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg"
                >
                  Assign Technician
                </button>
                <button
                  onClick={() => handleStatusUpdate("Completed")}
                  className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg"
                >
                  Mark Completed
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Sidebar from "../compornents/Sidebar";
import Header from "../compornents/Header";
import { auth, database } from "../firebaseConfig";
import { ref, get, onValue } from "firebase/database";
import { Link } from "react-router-dom";

const Dashboard = () => {

  const [showdetails, setshowdetails] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [userData, setUserData] = useState(null);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  //  Fetch current logged-in user data
  const fetchUserData = async (firebaseUid) => {
    const usersRef = ref(database, "users");
    const usersSnapshot = await get(usersRef);

    let foundUser = null;
    let foundUserId = null;

    usersSnapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      if (data.firebaseUid === firebaseUid) {
        foundUser = data;
        foundUserId = childSnapshot.key;
      }
    });

    if (foundUser) {
      setUserData({ ...foundUser, id: foundUserId });
      return foundUserId;
    } else {
      console.error("User not found in database!");
      return null;
    }
  };

  //  Fetch reports submitted by this user
  const fetchReports = async (userId) => {
    const reportsRef = ref(database, "breakdowns");
    onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userReports = Object.entries(data)
          .filter(([_, report]) => report.reporterUid === userId)
          .map(([id, report]) => ({ id, ...report }));
        setReports(userReports);
        setFilteredReports(userReports);
      } else {
        setReports([]);
        setFilteredReports([]);
      }
      setLoading(false);
    });
  };

  //  Wait until Firebase Auth finishes loading user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = await fetchUserData(user.uid);
        if (uid) fetchReports(uid);
      } else {
        console.error("No user logged in");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  //  Search and filter logic
  useEffect(() => {
    let filtered = reports;
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.id.toLowerCase().includes(term) ||
          report.itemName?.toLowerCase().includes(term) ||
          report.message?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter(
        (report) =>
          report.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, reports]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading Dashboard...
      </div>
    );

  const showPopup = (report) => {
    setSelectedReport(report);
    setshowdetails(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-gray-200">
      <aside className="w-64 flex-shrink-0 h-full sticky top-0">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="sticky top-0 z-10">
          <Header />
        </header>

        <main className="flex-1 p-8 overflow-y-auto bg-gray-900 dark:bg-gray-800">
          <div className="max-w-5xl mx-auto">
           

            {/*  Reports Table */}
            <p className="text-3xl font-bold tracking-tight dark:text-white mb-6">
              Your Submitted Reports
            </p>

            <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-700">
              <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-700">
                <input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full max-w-xs rounded-lg border border-gray-600 bg-gray-700 text-sm text-white focus:ring-green-500 focus:border-green-500"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select rounded-lg border border-gray-600 bg-gray-700 text-sm text-white focus:ring-green-500 focus:border-green-500"
                >
                  <option>All Statuses</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                    <tr>
                      <th className="px-6 py-3">Report ID</th>
                      <th className="px-6 py-3">System</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Assign Technician</th>
                      <th className="px-6 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <tr
                          key={report.id}
                          className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 font-medium text-white">
                            {report.id}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {report.itemName || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === "resolved"
                                ? "bg-green-900 text-green-300"
                                : report.status === "pending"
                                  ? "bg-yellow-900 text-yellow-300"
                                  : report.status === "inprogress"
                                    ? "bg-blue-900 text-blue-300"
                                    : report.status === "approved"
                                    ? "bg-green-900 text-green-300"
                                    : "bg-gray-600 text-gray-200"
                                }`}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {report.timestamps?.created
                              ? new Date(
                                report.timestamps.created
                              ).toLocaleString()
                              : "-"}
                          </td>
                          <td className="px-6 py-4 text-gray-400">{report.assignedTechnician||"not assign"}</td>
                          <td className="px-6 py-4 text-green-300">
                            <Link onClick={() => showPopup(report)}>View</Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-6 text-center text-gray-400"
                        >
                          No reports found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/*popup*/}
          {showdetails && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={() => setshowdetails(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
                {/* Submit Report */}
                <div className="mb-8">
                  <p className="text-3xl font-bold tracking-tight dark:text-white">
                    Details of Breakdown Report
                  </p>
                </div>
                <div className="bg-gray-900 dark:bg-gray-800 p-8 rounded-xl shadow-sm">

                  <form className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className="flex flex-col">
                        <p className="text-sm font-medium pb-2 dark:text-gray-300">
                          Item Name
                        </p>
                        <input value={selectedReport.itemName || ""}
                          readOnly
                          className="form-select w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">

                        </ input>
                      </label>
                      <label className="flex flex-col">
                        <p className="text-sm font-medium pb-2 dark:text-gray-300">
                          Location
                        </p>
                        <input
                          value={selectedReport.location || ""}
                          readOnly
                          className="form-input w-full rounded-lg border border-gray-600 bg-gray-700 text-white h-12 px-4 text-sm"
                        />
                      </label>
                    </div>

                    <label className="flex flex-col">
                      <p className="text-sm font-medium pb-2 dark:text-gray-300">Issue Title</p>
                      <input
                        value={
                          selectedReport.message?.split(":")[0] || "No title"
                        }
                        readOnly
                        className="form-input w-full rounded-lg border border-gray-600 bg-gray-700 text-white h-12 px-4 text-sm"
                      />
                    </label>

                    <label className="flex flex-col">
                      <p className="text-sm font-medium pb-2 dark:text-gray-300">
                        Description of Issue
                      </p>
                      <textarea
                        value={
                          selectedReport.discription ||
                          "No description provided."
                        }
                        readOnly
                        className="form-textarea w-full rounded-lg border border-gray-600 bg-gray-700 text-white min-h-32 p-4 text-sm"
                      />
                    </label>


                  </form>
                </div>


              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

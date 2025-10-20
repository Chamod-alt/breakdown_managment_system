import React, { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebaseConfig";
import Sidebar from "../compornents/Sidebar";
import emailjs from "emailjs-com";

export default function AdminDashboard() {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedTechnician, setSelectedTechnician] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [technicians, setTechnicians] = useState([]);


    //  Realtime data fetching
    useEffect(() => {
        const reportsRef = ref(database, "breakdowns");
        const unsubscribe = onValue(reportsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formatted = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setReports(formatted.reverse()); // newest first
                setFilteredReports(formatted.reverse());
            } else {
                setReports([]);
                setFilteredReports([]);
            }
        });
        return () => unsubscribe();
    }, []);

    //  Search + Filter
    useEffect(() => {
        let filtered = [...reports];
        if (filterStatus !== "all") {
            filtered = filtered.filter((r) => r.status === filterStatus);
        }
        if (searchTerm.trim() !== "") {
            filtered = filtered.filter((r) =>
                r.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredReports(filtered);
    }, [searchTerm, filterStatus, reports]);



    //  Update status in Firebase
    const handleStatusUpdate = async (newStatus) => {
        if (!selectedReport) return;
        const reportRef = ref(database, `breakdowns/${selectedReport.id}`);
        await update(reportRef, { status: newStatus });
        alert(`Status updated to ${newStatus}!`);
    };
{/*
    //  Assign technician and add admin note
    const handleAssignTechnician = async () => {
        if (!selectedReport) return alert("Select a report first!");
        if (!selectedTechnician) return alert("Please select a technician.");

        const reportRef = ref(database, `breakdowns/${selectedReport.id}`);
        await update(reportRef, {
            assignedTechnician: selectedTechnician,
            adminNote: adminNote || "",
            status: "Deleverd to technition"
        });

        alert("Technician assigned successfully!");
        setSelectedTechnician("");
        setAdminNote("");
    };

    */}
    

    // Assign technician and send email notification
const handleAssignTechnician = async () => {
  if (!selectedReport) return alert("Select a report first!");
  if (!selectedTechnician) return alert("Please select a technician.");

  try {
    //  Update in Firebase
    const reportRef = ref(database, `breakdowns/${selectedReport.id}`);
    await update(reportRef, {
      assignedTechnician: selectedTechnician,
      adminNote: adminNote || "",
      status: "Deleverd to technition"
    });

    // Find the technician email from list
    const technician = technicians.find(
      (tech) => tech.name === selectedTechnician
    );

    if (technician && technician.email) {
      // EmailJS: prepare email template parameters
      const templateParams = {
        to_email: technician.email,
        technician_name: selectedTechnician,
        report_id: selectedReport.id,
        item_name:selectedReport.itemName,
        report_location: selectedReport.location,
        report_message: selectedReport.message,
        admin_note: adminNote || "No additional note",
        technician_email: technician.email,
        year: new Date().getFullYear(),
      };

      //  Send email via EmailJS
      await emailjs.send(
        "service_x8sb3iq",         // Replace with your EmailJS Service ID
        "template_jt5a5zq",        // Replace with your EmailJS Template ID
        templateParams,
        "QZJ4qf0aZmug7dhTA"          //  Replace with your EmailJS Public Key
      )

      alert(`Technician ${selectedTechnician} assigned and notified by email!`);
    } else {
      alert("Technician email not found in database!");
    }

    //  Reset inputs
    setSelectedTechnician("");
    setAdminNote("");
  } catch (error) {
    console.error("Error assigning technician:", error);
    alert("Error assigning technician. Check console for details.");
  }
};


    useEffect(() => {
        const techRef = ref(database, "users");
        const unsubscribe = onValue(techRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formatted = Object.keys(data)
                    .filter((key) => data[key].role === "technician")
                    .map((key) => ({
                        uid: key,
                        name: data[key].name,
                        email: data[key].email,
                    }));
                setTechnicians(formatted);
            } else {
                setTechnicians([]);
            }
        });

        return () => unsubscribe();
    }, []);



    return (
        <div className="flex h-screen bg-black text-white font-display">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex flex-wrap justify-between items-center gap-4 p-6 border-b border-gray-700 bg-gray-900">
                    <div className="flex flex-col gap-1">
                        <p className="text-2xl font-bold tracking-tight"> Reports</p>
                        <p className="text-sm text-gray-400">
                            Real-time view of all incoming system breakdown reports.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            className="flex items-center justify-center rounded-lg h-10 px-4 bg-gray-800 hover:bg-gray-700 text-sm font-bold"
                            onClick={() => window.location.reload()}
                        >
                            <span className="material-symbols-outlined mr-2">refresh</span>
                            Refresh
                        </button>
                    </div>
                </header>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Reports List */}
                    <div className="w-1/3 border-r border-gray-700 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-900">
                        {/* Filter & Search */}
                        <div className="flex items-center gap-2 mb-3">
                            <select
                                className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="complete">complete</option>
                                <option value="inprogress">In Progress</option>
                                <option value="rejected">Rejected</option>
                                <option value="Deleverd to admin">new</option>
                                <option value="Deleverd to technition">deleverd</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm flex-1"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <div
                                    key={report.id}
                                    onClick={() => setSelectedReport(report)}
                                    className={`bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 ${selectedReport?.id === report.id ? "ring-2 ring-blue-500" : ""
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold">{report.id.slice(-5)}</p>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${report.status === "pending"
                                                ? "bg-yellow-500 text-black"
                                                : report.status === "completed"
                                                    ? "bg-green-500 text-white"
                                                    : report.status === "rejected"
                                                        ? "bg-red-500 text-black"
                                                        : report.status === "Deleverd to admin"
                                                            ? "bg-blue-500 text-white"
                                                        : report.status === "Deleverd to technition"
                                                            ? "bg-yellow-500 text-black"
                                                             : report.status === "resolved"
                                                            ? "bg-green-500 text-white"
                                                            : "bg-gray-500 text-white"

                                                }`}
                                        >
                                            {/*{report.status || "new"}*/}

                                            {report.status === "Deleverd to admin" ? "New" : report.status && report.status === "Deleverd to technition" ? "deleverd" : report.status}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm font-medium">{report.itemName}</p>
                                    <p className="mt-1 text-sm font-medium">{report.message}</p>
                                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                        <p>{report.reporterName}</p>
                                        <p>
                                            {report.timestamps?.created
                                                ? new Date(report.timestamps.created).toLocaleTimeString()
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm mt-4 text-center">
                                No reports found.
                            </p>
                        )}
                    </div>

                    {/* Report Detail Panel */}
                    <div className="w-2/3 overflow-y-auto p-6 bg-gray-900">
                        {selectedReport ? (
                            <div className="flex flex-col gap-6">
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">
                                            Report {selectedReport.id.slice(-5)}
                                        </h2>
                                        <div className="flex gap-2">
                                           {/* <button
                                                onClick={() => handleStatusUpdate("approved")}
                                                className="rounded-lg h-10 px-4 bg-green-500 text-white text-sm font-bold hover:bg-green-600"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate("inprogress")}
                                                className="rounded-lg h-10 px-4 bg-blue-500 text-white text-sm font-bold hover:bg-blue-600"
                                            >
                                                In Progress
                                            </button>
                                            */}
                                            <button
                                                onClick={() => handleStatusUpdate("rejected")}
                                                className="rounded-lg h-10 px-4 bg-red-500 text-white text-sm font-bold hover:bg-red-600"
                                            >
                                                Rejected
                                            </button>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-600">
                                        {selectedReport.itemName || "No item name available"}

                                    </h2>

                                    <h2 className="text-xl font-bold text-green-400">

                                        {selectedReport.location}
                                    </h2>

                                    <p className="text-lg font-semibold mt-2">
                                        {selectedReport.message}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div>

                                        <h3 className="text-sm font-medium text-gray-400">User Details</h3>
                                        <p className="mt-1">{selectedReport.reporterName}</p>
                                        <p>{selectedReport.reporterEmail}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Status</h3>


                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${selectedReport.status === "pending"
                                                ? "bg-yellow-500 text-white"
                                                : selectedReport.status === "completed"
                                                    ? "bg-green-500 text-black"
                                                    : selectedReport.status === "rejected"
                                                        ? "bg-red-500 text-white"
                                                    : selectedReport.status === "Deleverd to admin"
                                                            ? "bg-blue-500 text-white"
                                                    : selectedReport.status === "Deleverd to technition"
                                                            ? "bg-yellow-500 text-black"
                                                        : "bg-gray-500 text-white"
                                                }`}
                                        >
                                            {/*{selectedReport.status}*/}
                                            {selectedReport.status === "Deleverd to admin" ? "New" : selectedReport.status && selectedReport.status === "Deleverd to technition" ? "deleverd" : selectedReport.status }
                                        </span>

                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Asigned Technition</h3>
                                        <p>{selectedReport.assignedTechnician || "not Assign Technition"}</p>
                                    </div>

                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Full Report</h3>
                                    <p className="mt-1 leading-relaxed">
                                        {selectedReport.discription || "No detailed description available."}
                                    </p>
                                </div>

                                {/* Technician Assignment */}
                                <div className="border-t border-gray-700 pt-6">
                                    <h3 className="text-lg font-bold mb-4">Assign Technician</h3>
                                    <div className="flex items-start gap-4">
                                        <select
                                            className="w-1/3 rounded-lg bg-gray-800 border-none text-white focus:ring-primary p-2"
                                            value={selectedTechnician}
                                            onChange={(e) => setSelectedTechnician(e.target.value)}
                                        >
                                            <option value="">Select Technician</option>
                                            {technicians.length > 0 ? (
                                                technicians.map((tech) => (
                                                    <option key={tech.uid} value={tech.name}>
                                                        {tech.name} ({tech.email})
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No technicians available</option>
                                            )}
                                        </select>

                                        <textarea
                                            className="w-2/3 rounded-lg bg-gray-800 border-none text-white focus:ring-primary p-2"
                                            placeholder="Add update or admin note..."
                                            rows="2"
                                            value={adminNote}
                                            onChange={(e) => setAdminNote(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={handleAssignTechnician}
                                            className="rounded-lg h-10 px-4 bg-blue-500 text-white text-sm font-bold"
                                        >
                                            Add Technician
                                        </button>
                                        {/*
                                        <button
                                            onClick={() => handleStatusUpdate("closed")}
                                            className="rounded-lg h-10 px-4 bg-red-500 text-white text-sm font-bold"
                                        >
                                            Close Report
                                        </button>
                                        */}
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <p className="text-gray-400 text-center mt-20">
                                Select a report to view details.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

import React, { useState } from "react";
import Sidebar from "../compornents/Sidebar";
import Header from "../compornents/Header";
import { auth, database } from "../firebaseConfig";
import { ref, get, set, update, serverTimestamp } from "firebase/database";

const Dashboard = () => {
  const [itemName, setItemName] = useState("");
  const [location, setLocation] = useState("Room 1");
  const [issueTitle, setIssueTitle] = useState("");
  const [description, setDescription] = useState("");

  const submitReport = async (e) => {
  e.preventDefault();

  if (!auth.currentUser) {
    alert("You must be logged in to submit a report");
    return;
  }

  try {
    // Find the user's custom ID (uid_userX) by searching for their Firebase UID
    const usersRef = ref(database, "users");
    const usersSnapshot = await get(usersRef);

    if (!usersSnapshot.exists()) {
      alert("No users found in the database!");
      return;
    }

    let userData = null;
    let userCustomId = null;

    // Loop through users to find one with matching firebaseUid
    usersSnapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      if (data.firebaseUid === auth.currentUser.uid) {
        userData = data;
        userCustomId = childSnapshot.key;
      }
    });

    if (!userData) {
      alert("User data not found!");
      return;
    }

    // Get and update breakdown counter
    const counterRef = ref(database, "breakdown_counter");
    const counterSnapshot = await get(counterRef);
    let counter = counterSnapshot.val() || 0;
    counter += 1;

    // Generate breakdown ID (breakdown_001 style)
    const breakdownId = "breakdown_" + counter.toString().padStart(3, "0");

    // Save report
    await set(ref(database, "breakdowns/" + breakdownId), {
      reporterUid: userCustomId, // uid_userX instead of Firebase UID
      reporterName: userData.username,
      reporterEmail: userData.email,
      reporterRole: userData.role,
      itemName,
      location,
      message: `${issueTitle}: ${description}`,
      status: "pending",
      assignedTechnician: null,
      fixDetails: null,
      timestamps: {
        created: serverTimestamp(),
        updated: serverTimestamp(),
      },
    });

    // Update counter
    await set(counterRef, counter);

    alert(" Report submitted successfully!");
    setItemName("");
    setLocation("Room 1");
    setIssueTitle("");
    setDescription("");
  } catch (error) {
    alert(" Error submitting report: " + error.message);
  }
};

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 dark:bg-background-dark text-gray-900 dark:text-gray-200">
      <aside className="w-64 flex-shrink-0 h-full sticky top-0">
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="sticky top-0 z-10">
          <Header />
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-900 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <p className="text-3xl font-bold tracking-tight dark:text-white">
                Submit a New System Breakdown Report
              </p>
            </div>

            <div className="bg-gray-900 dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <form className="space-y-6" onSubmit={submitReport}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col">
                    <p className="text-sm font-medium pb-2 dark:text-gray-300">
                      Item Name
                    </p>
                    <input
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g., Printer"
                      className="form-select w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </label>

                  <label className="flex flex-col">
                    <p className="text-sm font-medium pb-2 dark:text-gray-300">
                      Location
                    </p>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="form-select w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option>Room 1</option>
                      <option>Room 2</option>
                      <option>Room 3</option>
                      <option>Room 4</option>
                      <option>Room 5</option>
                    </select>
                  </label>
                </div>

                <label className="flex flex-col">
                  <p className="text-sm font-medium pb-2 dark:text-gray-300">
                    Issue Title
                  </p>
                  <input
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    placeholder="e.g., Unable to log in to CRM"
                    className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>

                <label className="flex flex-col">
                  <p className="text-sm font-medium pb-2 dark:text-gray-300">
                    Description of Issue
                  </p>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please provide a detailed description..."
                    className="form-textarea w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-32 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex min-w-[120px] max-w-[480px] items-center justify-center h-12 px-6 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

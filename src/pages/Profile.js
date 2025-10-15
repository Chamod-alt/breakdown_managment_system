import React, { useEffect, useState } from "react";
import Sidebar from "../compornents/Sidebar";
import Header from "../compornents/Header";
import { auth, database } from "../firebaseConfig";
import { ref, get } from "firebase/database";
import { 
  reauthenticateWithCredential, 
  EmailAuthProvider, 
  updatePassword 
} from "firebase/auth";


const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Fetch current logged-in user data
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

  // Wait until Firebase Auth finishes loading user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserData(user.uid);
      } else {
        console.error("No user logged in");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading Dashboard...
      </div>
    );

 const handlePasswordChange = async (e) => {
  e.preventDefault();
  setPasswordMessage("");

  if (newPassword !== confirmPassword) {
    setPasswordMessage("New password and confirm password do not match.");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");

    // Ask user for current password to reauthenticate
    const currentPasswordInput = window.prompt("Enter your current password:");
    if (!currentPasswordInput) {
      setPasswordMessage("Password change canceled.");
      return;
    }

    // Re-authenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPasswordInput);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
    setPasswordMessage("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err) {
    console.error(err);
    setPasswordMessage("Failed to update password: " + err.message);
  }
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
            {userData && (
              <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-md border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Welcome, {userData.username} 👋
                </h2>
                <div className="text-gray-300 text-sm space-y-1 mb-6">
                  <p>
                    <span className="font-semibold text-green-400">Email:</span>{" "}
                    {userData.email}
                  </p>
                  <p>
                    <span className="font-semibold text-green-400">Role:</span>{" "}
                    {userData.role}
                  </p>
                  <p>
                    <span className="font-semibold text-green-400">User ID:</span>{" "}
                    {userData.id}
                  </p>
                </div>

                {/* Password Change Form */}
                <div className="bg-gray-700 p-6 rounded-lg space-y-4">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Update Password
                    </button>
                  </form>
                  {passwordMessage && (
                    <p className="text-sm text-yellow-400 mt-2">{passwordMessage}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

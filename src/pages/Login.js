import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ref, get, child } from "firebase/database";
import { auth, database } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
  setLoading(true);
  try {
    // Firebase Auth login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Realtime DB reference
  const usersRef = ref(database, "users");
//  const usersRef = ref(database, `users/${firebaseUid}`);
const snapshot = await get(usersRef);
const allUsers = snapshot.val();

let userData = null;

Object.entries(allUsers).forEach(([key, value]) => {
  if (value.email === email) {
    userData = value;
  }
});

if (!userData) {
  alert("User not found in database!");
  return;
}

if (userData.role !== "manager") {
  alert("Access denied. Only managers can log in!");
  return;
}

    alert("Login successful!");
    navigate("/Dashboad");
  } catch (error) {
    console.error(error);
    alert("Login failed: " + error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f6f7f8] dark:bg-[#101922] font-[Inter] text-gray-800 dark:text-gray-200 overflow-x-hidden py-3">
      <div className="flex h-full flex-col items-center justify-center px-4 py-3 w-full max-w-lg border border-green-600">
        <div className="flex flex-col gap-3 p-4 items-center text-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-600 text-5xl">
              emergency_home
            </span>
            <p className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
              System Breakdown Information System
            </p>
          </div>
          <p className="text-[#617589] dark:text-gray-400 text-lg font-normal leading-normal">
            Admin Login
          </p>
        </div>

        <div className="flex flex-col gap-4 p-4 w-full">
          {/* Email */}
          <div className="flex flex-col w-full">
            <label className="flex flex-col w-full">
              <p className="text-[#111418] dark:text-white text-base font-medium leading-normal pb-2">
                Your Email
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input flex w-full rounded-lg text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#101922] h-14 placeholder:text-[#617589] dark:placeholder-gray-500 p-[15px] text-base"
              />
            </label>
          </div>

          {/* Password */}
          <div className="flex flex-col w-full">
            <label className="flex flex-col w-full">
              <p className="text-[#111418] dark:text-white text-base font-medium leading-normal pb-2">
                Password
              </p>
              <div className="flex w-full items-stretch rounded-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input flex w-full rounded-lg text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#101922] h-14 placeholder:text-[#617589] dark:placeholder-gray-500 p-[15px] rounded-r-none border-r-0 text-base"
                />
                <div
                  className="text-[#617589] dark:text-gray-400 flex border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#101922] items-center justify-center pr-[15px] rounded-r-lg border-l-0 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </div>
            </label>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg h-12 px-5 bg-green-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 dark:ring-offset-[#101922] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

       
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {auth,database} from "../firebaseConfig";
import {get,set,ref} from "firebase/database"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email,setemail] =useState("");
  const [password,setpassword] = useState("");
  const [username,setusername] =useState("");
 //navigate
  const navigate =useNavigate();

const Registeruser = async () => {
  try {
    // Create Firebase Auth user
    const newuser = await createUserWithEmailAndPassword(auth, email, password);

    // Reference to users node
    const usersRef = ref(database, "users");

    // Get all existing users to count them
    const snapshot = await get(usersRef);
    let userCount = 0;

    if (snapshot.exists()) {
      userCount = Object.keys(snapshot.val()).length;
    }

    // Generate your custom ID (uid_user1, uid_user2, etc.)
    const customUserId = `uid_user${userCount + 1}`;

    // Save user data using your custom ID
    await set(ref(database, "users/" + customUserId), {
      email: email,
      username: username,
      role: "reporter",
      firebaseUid: newuser.user.uid, // optional: link back to Firebase Auth user
    });

    alert("Register success!");
    navigate("/Userdashboad")
  } catch (error) {
    alert("Error: " + error.message);
  }
};

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f6f7f8] dark:bg-[#101922] font-[Inter] text-gray-800 dark:text-gray-200 overflow-x-hidden py-4">
     

      {/* Register Form */}
      <div className="flex flex-col items-center w-full max-w-md p-8 bg-dark dark:bg-background-dark rounded-xl shadow-lg border border-green-600">
        <div className="w-full text-center mb-8">

            <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-green-600 text-4xl">
            build_circle
          </span>
          <span className="text-3xl font-bold text-text-primary dark:text-white">
            System Breakdown Information System
          </span>
          
        </div>
        <br />
          <p className="text-xl font-black leading-tight tracking-tighter text-text-primary dark:text-white">
            Create an Account
          </p>
        </div>

        <div className="w-full flex flex-col gap-6">
          {/* Full Name */}
          <label className="flex flex-col w-full">
            <p className="text-base font-medium pb-2 text-text-primary dark:text-gray-300">
              Your Name
            </p>
            <input
              className="form-input w-full rounded-lg border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 h-14 p-[15px] placeholder:text-gray-400"
              placeholder="Enter your full name" onChange={(e)=>(setusername(e.target.value))}
            />
          </label>

          {/* Email */}
          <label className="flex flex-col w-full">
            <p className="text-base font-medium pb-2 text-text-primary dark:text-gray-300">
              Email Address
            </p>
            <input
              className="form-input w-full rounded-lg border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 h-14 p-[15px] placeholder:text-gray-400"
              placeholder="Enter your email address" onChange={(e) =>(setemail(e.target.value))}
            />
          </label>

          {/* Password */}
          <label className="flex flex-col w-full">
            <p className="text-base font-medium pb-2 text-text-primary dark:text-gray-300">
              Password
            </p>
            <div className="flex w-full items-stretch rounded-lg border border-secondary dark:border-gray-700 focus-within:ring-2 focus-within:ring-green-500/50">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input flex-1 rounded-l-lg border-0 bg-white dark:bg-gray-800 text-text-primary dark:text-white h-14 p-[15px] placeholder:text-gray-400 focus:outline-none"
                placeholder="Enter your password" onChange={(e) =>(setpassword(e.target.value))}
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                className="text-gray-500 dark:text-gray-400 flex items-center justify-center px-4 bg-white dark:bg-gray-800 rounded-r-lg"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </label>

          {/* Register Button */}
          <button className="flex w-full items-center justify-center h-12 px-5 bg-green-600 text-white text-base font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          onClick={Registeruser}>
            Register
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-primary dark:text-gray-300">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-medium text-green-600 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

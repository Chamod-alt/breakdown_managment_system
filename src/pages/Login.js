import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {auth,database} from "../firebaseConfig";
import {get,set,ref} from "firebase/database"
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email,setemail] =useState("");
  const[password,setpassword] =useState("");

  const navigate= useNavigate();

  const Login = async () => {
    try{
    const newuser = await signInWithEmailAndPassword(auth,email,password);
    const user = newuser.user
     alert("Login is success");
     navigate("/Userdashboad")
    }
    catch(error){
    alert("login is unsuccess");
    }
  }

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
            User Login
          </p>
        </div>

        <div className="flex flex-col gap-4 p-4 w-full">
          {/* Username */}
          <div className="flex flex-col w-full">
            <label className="flex flex-col w-full">
              <p className="text-[#111418] dark:text-white text-base font-medium leading-normal pb-2">
                Your Email
              </p>
              <input
                type="text"
                placeholder="Enter your username or email"
                className="form-input flex w-full rounded-lg text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#101922] h-14 placeholder:text-[#617589] dark:placeholder-gray-500 p-[15px] text-base"
                 onChange={(e) => (setemail(e.target.value))} />
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
                  placeholder="Enter your password"
                  className="form-input flex w-full rounded-lg text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#101922] h-14 placeholder:text-[#617589] dark:placeholder-gray-500 p-[15px] rounded-r-none border-r-0 text-base"
                  onChange ={(e) =>(setpassword(e.target.value))} />
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
          <button className="flex w-full items-center justify-center rounded-lg h-12 px-5 bg-green-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 dark:ring-offset-[#101922] transition"
          onClick={Login}>
            <span className="truncate">Login</span>
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center gap-3 px-4 py-3">
        
          <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">
            Don't have an account?{" "}
            <Link to ="/Register" className="font-bold text-green-600 hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center mt-8">
          <p className="text-[#617589] dark:text-gray-500 text-xs font-normal leading-normal">
            © 2025 System Breakdown Information System. All rights reserved.
          </p>
          <a
            className="text-[#617589] dark:text-gray-500 text-xs font-normal leading-normal hover:underline"
            href="#"
          >
            Support
          </a>
        </div>
      </div>
    </div>
  );
}

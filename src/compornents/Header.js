import React,{useEffect,useState} from "react";
import { auth, database } from "../firebaseConfig";
import { ref, get, onValue } from "firebase/database";
import { Link } from "react-router-dom";




const Header = () => {
  const [userData, setUserData] = useState(null);


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
       
      });
      return () => unsubscribe();
    }, []);

    return(
        <div>

<header className="flex items-center justify-between border-b border-green-200 dark:border-gray-700 px-8 py-4 bg-gray-900 dark:bg-background-dark">

        <div className="flex items-center gap-4 text-green-600">
          {/*<div className="size-6">
           <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8v-2h3V7h2v4h3v2h-3v4h-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold dark:text-white tracking-tight">
            System Breakdown
          </h2>

          */}
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p>{userData?.username}</p>
            <p>{userData?.email}</p>
            
          </div>
          
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCS74gsJvMzqsY68mET0YffZuTjWoyNod-QSVsXvQXoI3ayANxi77gSk6UW2U9h3LPv7vJCs_wq3FqoDXIBLFmuJIwRtREc7Bhv6OldzM0QzeCAv3UvdCney5ese08iYexWQwH3Xjch4kNT0-tiyGyxuqx7c2YIQmFO3jYwd-8-c8pUNoyATBkHb4G2fqE5ni9RkMX2xdqCAnEHtdAAOJWIfAgC9zbyx3Z5Bz9GR-aKVh3tswyAIyyH4p-jbVVRecBkqUHuNls1GHA')",
            }}
          />
        </div>
      </header>

      
        </div>
        );
};

export default Header;


import React, { useEffect, useState } from "react";
import Sidebar from "../compornents/Sidebar";
import { database, auth } from "../firebaseConfig";
import { ref, onValue, set, remove, update } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function ManageTechnicians() {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUID, setEditUID] = useState(null);

  const [technicians, setTechnicians] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch technicians in real-time
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

  // Generate custom UID like uid_tech1, uid_tech2...
  const getNextUID = () => {
    const techIDs = technicians.map((t) => t.uid);
    let counter = 1;
    while (techIDs.includes(`uid_tech${counter}`)) counter++;
    return `uid_tech${counter}`;
  };

  // Add or update technician
  const handleAddTechnician = async (e) => {
    e.preventDefault();
    if (!name || !email || (!isEditing && !password)) return;

    try {
      if (isEditing && editUID) {
        //  Update existing record
        await update(ref(database, `users/${editUID}`), {
          name,
          email,
        });
      } else {
        // Create new technician
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const authUID = userCredential.user.uid;
        const dbUID = getNextUID();

        await set(ref(database, `users/${dbUID}`), {
          name,
          email,
          role: "technician",
          uid: dbUID,
          authUID,
        });
      }

      // Clear + close form
      setName("");
      setEmail("");
      setPassword("");
      setIsEditing(false);
      setEditUID(null);
      setShowPopup(false);
    } catch (error) {
      console.error("Error adding/updating technician:", error.message);
      alert(error.message);
    }
  };

  // Delete technician
  const handleDelete = async (uid) => {
    if (window.confirm("Are you sure you want to delete this technician?")) {
      await remove(ref(database, `users/${uid}`));
    }
  };

  // Edit technician
  const handleEdit = (tech) => {
    setName(tech.name);
    setEmail(tech.email);
    setIsEditing(true);
    setEditUID(tech.uid);
    setShowPopup(true);
  };

  const filteredTechs = technicians.filter((tech) =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-black text-white font-display relative">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto bg-gray-900 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-black tracking-tight">Manage Technicians</h1>
            <button
              onClick={() => {
                setShowPopup(true);
                setIsEditing(false);
                setName("");
                setEmail("");
                setPassword("");
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Add Technician
            </button>
          </header>

          {/* Popup Form */}
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Background overlay with blur */}
              <div
                className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
                onClick={() => setShowPopup(false)}
              ></div>

              {/* Popup Box */}
              <section className="relative bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl z-10">
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 text-gray-300 hover:text-white"
                  onClick={() => setShowPopup(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <h2 className="text-2xl font-bold mb-6">
                  {isEditing ? "Edit Technician" : "Add New Technician"}
                </h2>

                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  onSubmit={handleAddTechnician}
                >
                  <div>
                    <label className="block text-base font-medium pb-2">
                      Technician Name
                    </label>
                    <input
                      className="form-input w-full rounded-lg border-gray-600 bg-gray-700 text-white focus:border-primary h-12 px-4"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      type="text"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-base font-medium pb-2">
                      Email
                    </label>
                    <input
                      className="form-input w-full rounded-lg border-gray-600 bg-gray-700 text-white focus:border-primary h-12 px-4"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      type="email"
                      required
                    />
                  </div>

                  {!isEditing && (
                    <div className="relative md:col-span-2">
                      <label className="block text-base font-medium pb-2">
                        Password
                      </label>
                      <input
                        className="form-input w-full rounded-lg border-gray-600 bg-gray-700 text-white focus:border-primary h-12 px-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        type="password"
                        required
                      />
                    </div>
                  )}

                  <div className="md:col-span-2 flex justify-end items-center">
                    <button
                      className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                      type="submit"
                    >
                      {isEditing ? "Update Technician" : "Add Technician"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}

          {/* Technician Table */}
          <section className="bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Existing Technicians</h2>
              <div className="relative w-64">
                <input
                  className="form-input w-full rounded-lg border-gray-600 bg-gray-700 text-white h-10 pl-10"
                  placeholder="Search technicians..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  search
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-4 text-sm font-semibold uppercase text-gray-400">
                      Name
                    </th>
                    <th className="p-4 text-sm font-semibold uppercase text-gray-400">
                      Email
                    </th>
                    <th className="p-4 text-sm font-semibold uppercase text-gray-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTechs.map((tech) => (
                    <tr
                      key={tech.uid}
                      className="border-b border-gray-700 hover:bg-gray-700/50"
                    >
                      <td className="p-4">{tech.name}</td>
                      <td className="p-4 text-gray-400">{tech.email}</td>
                      <td className="p-4 text-right">
                        <button
                          className="text-blue-400 hover:text-blue-300 p-2"
                          onClick={() => handleEdit(tech)}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          className="text-red-500 hover:text-red-400 p-2"
                          onClick={() => handleDelete(tech.uid)}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTechs.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center text-gray-500 py-4"
                      >
                        No technicians found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

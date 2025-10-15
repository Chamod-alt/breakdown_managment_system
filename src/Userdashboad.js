import React from "react";
import Sidebar from "./compornents/Sidebar"
import Header from "./compornents/Header";

const Dashboard = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-dark bg-dark dark:bg-background-dark text-gray-900 dark:text-gray-200">
      {/* Header */}
       <Header />
      {/* Sidebar + Main */}
      <div className="flex flex-1">
        {/* Sidebar */}
         <Sidebar />
        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto bg-gray-900 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            {/* Submit Report */}
            <div className="mb-8">
              <p className="text-3xl font-bold tracking-tight dark:text-white">
                Submit a New System Breakdown Report
              </p>
            </div>
            <div className="bg-gray-900 dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col">
                    <p className="text-sm font-medium pb-2 dark:text-gray-300">
                      Item Name
                    </p>
                    <input  placeholder="e.g., Printer"
                     className="form-select w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    
                    </ input>
                  </label>
                  <label className="flex flex-col">
                    <p className="text-sm font-medium pb-2 dark:text-gray-300">
                      Location
                    </p>
                    <select className="form-select w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>Room 1</option>
                      <option>Room 2</option>
                      <option>Room 3</option>
                      <option>Room 4</option>
                      <option>Room 5</option>
                    </select>
                  </label>
                </div>

                <label className="flex flex-col">
                  <p className="text-sm font-medium pb-2 dark:text-gray-300">Issue Title</p>
                  <input
                    placeholder="e.g., Unable to log in to CRM"
                    className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>

                <label className="flex flex-col">
                  <p className="text-sm font-medium pb-2 dark:text-gray-300">
                    Description of Issue
                  </p>
                  <textarea
                    placeholder="Please provide a detailed description..."
                    className="form-textarea w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-32 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </label>

                <div className="flex justify-end pt-4">
                  <button className="flex min-w-[120px] max-w-[480px] items-center justify-center h-12 px-6 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
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

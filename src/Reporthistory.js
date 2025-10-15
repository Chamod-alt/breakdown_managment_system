import React from "react";
import Sidebar from "./compornents/Sidebar";
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
            

            {/* Reports Table */}
            <div className="mt-12">
              <p className="text-3xl font-bold tracking-tight dark:text-white mb-8">
                Your Submitted Reports
              </p>
              <div className="bg-dark dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400">
                        search
                      </span>
                    </div>
                    <input
                      placeholder="Search reports..."
                      className="form-input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <select className="form-select rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-green-500 focus:border-green-500">
                      <option>All Statuses</option>
                      <option>Submitted</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-6 py-3">Report ID</th>
                        <th className="px-6 py-3">Date Submitted</th>
                        <th className="px-6 py-3">System</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th className="px-6 py-4 font-medium text-gray-900 dark:text-white" scope="row">
                          #12045
                        </th>
                        <td className="px-6 py-4">2023-10-27</td>
                        <td className="px-6 py-4">CRM Platform</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Resolved
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a className="font-medium text-green-600 hover:underline" href="#">
                            View Details
                          </a>
                        </td>
                      </tr>
                      {/* Add other rows as needed */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
           {/*...............................................*/}

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

        </main>
      </div>
    </div>
  );
};

export default Dashboard;

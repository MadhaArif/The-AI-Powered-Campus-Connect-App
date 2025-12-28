import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import { Building2, LoaderCircle } from "lucide-react";

const ManageJobs = () => {
  const [manageJobData, setManageJobData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { backendUrl, companyToken } = useContext(AppContext);

  const fetchManageJobsData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/company/company-jobs`,
        {
          headers: { Authorization: `Bearer ${companyToken}` },
        }
      );
      
      if (data.success) {
        setManageJobData(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const changeJobVisiblity = async (id) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/company/close-job/${id}`,
        {
          headers: { Authorization: `Bearer ${companyToken}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchManageJobsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchManageJobsData();
  }, []);

  useEffect(() => {
    document.title = "Campus Connect - Job Portal | Dashboard";
  }, []);

  return (
    <section className="bg-gray-50/30 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Manage Jobs</h1>
           <p className="text-gray-500 text-sm mt-1">Monitor and manage your posted job listings</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
           <span className="text-sm font-medium text-gray-600">Total Jobs:</span>
           <span className="text-lg font-bold text-indigo-600">{manageJobData ? manageJobData.length : 0}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <LoaderCircle className="animate-spin h-10 w-10 text-indigo-500" />
        </div>
      ) : !manageJobData || manageJobData.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <Building2 className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No Jobs Posted</h3>
          <p className="text-gray-500 mb-6">You haven't posted any jobs yet.</p>
          <Link to="/dashboard/add-job" className="btn-primary inline-flex items-center gap-2">
             Post a Job
          </Link>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full bg-transparent">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date Posted
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Applicants
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {manageJobData.reverse().map((job, index) => (
                <tr
                  key={job._id}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                       <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                       {job.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {moment(job.date).format("MMM D, YYYY")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <Link to="/dashboard/view-applications" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
                      {job.applicants || 0}
                    </Link>
                  </td>
                 
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={job.visible}
                        onChange={() => changeJobVisiblity(job._id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      <span className="ml-2 text-xs font-medium text-gray-600 min-w-[3rem] text-left">
                        {job.visible ? 'Active' : 'Closed'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </section>
  );
};

export default ManageJobs;

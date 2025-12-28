import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const ViewApplications = () => {
  const [viewApplicationsPageData, setViewApplicationsPageData] =
    useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const { backendUrl, companyToken } = useContext(AppContext);

  const fetchViewApplicationsPageData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/company/view-applicants`,
    
        {
          headers: { Authorization: `Bearer ${companyToken}` },
        }
      );
      if (data?.success) {
        setViewApplicationsPageData(data.applicants || []);
      } else {
        toast.error(data?.message || "Failed to load applications.");
      }
    } catch (error) {
      // console.error(error?.response?.data || "Error fetching applications");
      toast.error(
        error?.response?.data?.message || "Failed to fetch applications"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdatingStatus(id);
    try {
      const { data } = await axios.post(
        `${backendUrl}/company/change-status`,
        { id, status },
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
           
             },
        }
      );

      if (data?.success) {
        toast.success(data?.message || "Status updated successfully.");
        await fetchViewApplicationsPageData(); // Reload applications to reflect the update
      } else {
        toast.error(data?.message || "Failed to update status");
      }
    } catch (error) {
      // console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Error updating status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    document.title = "Campus Connect - Job Portal | Dashboard";
  }, []);

  useEffect(() => {
    fetchViewApplicationsPageData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Applications Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Review and manage candidate applications.</p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <Loader />
        </div>
      ) : !viewApplicationsPageData || viewApplicationsPageData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No applications yet</h3>
          <p className="text-gray-500 mt-1">Applications will appear here once candidates apply.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[180px]">
                    Job Applied For
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[180px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 bg-transparent">
                {viewApplicationsPageData.reverse().map((job, index) => (
                  <tr
                    key={job._id}
                    className="hover:bg-gray-50/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={job?.userId?.image || assets.profile_img}
                          alt={job?.userId?.name || "Applicant"}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                          onError={(e) =>
                            (e.target.src = assets.profile_img)
                          }
                        />
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {job?.userId?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">
                            {job?.userId?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                        {job?.jobId?.title}
                       </p>
                       <p className="text-xs text-gray-500">{job?.jobId?.companyId?.name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                       <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                          {job?.jobId?.location}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {job?.date ? moment(job.date).format("MMM D, YYYY") : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {job?.userId?.resume ? (
                        <a
                          href={job.userId.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline py-1.5 px-3 text-xs inline-flex items-center gap-1.5"
                          aria-label="View resume"
                        >
                          <span>Resume</span>
                          <img
                            src={assets.resume_download_icon}
                            alt=""
                            className="h-3 w-3 opacity-70"
                          />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {updatingStatus === job._id ? (
                        <div className="flex justify-center">
                          <LoaderCircle className="animate-spin h-5 w-5 text-indigo-500" />
                        </div>
                      ) : job.status === "Pending" ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(job._id, "Accepted")
                            }
                            className="text-xs font-semibold bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors shadow-sm"
                            disabled={updatingStatus === job._id}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(job._id, "Rejected")
                            }
                            className="text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors shadow-sm"
                            disabled={updatingStatus === job._id}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1.5 ${
                            job.status === "Accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                             job.status === "Accepted" ? "bg-green-500" : "bg-red-500"
                          }`}></span>
                          {job.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;

import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import moment from "moment";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Applications = () => {
  const {
    userApplication,
    applicationsLoading,
    backendUrl,
    userToken,
    userData,
    fetchUserData,
    fetchUserApplication,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResumeSave = async () => {
    if (!resumeFile) {
      toast.error("Please select a resume file");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const { data } = await axios.post(
        `${backendUrl}/user/upload-resume`,
        formData,
         {
          headers: { Authorization: `Bearer ${userToken}`,
           "Content-Type": "multipart/form-data",
         },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserApplication();
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      <section className="max-w-4xl mx-auto py-8">
        {/* Resume Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-50 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50"></div>
          
          <h1 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 rounded-lg">
              <img src={assets.profile_upload_icon} alt="" className="w-5 h-5 opacity-70" />
            </span>
            Your Resume
          </h1>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            {isEdit ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="flex-1 w-full sm:w-auto flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-xl p-6 cursor-pointer hover:bg-indigo-50 transition-colors group">
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  />
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <img
                      className="w-5 h-5 opacity-60"
                      src={assets.profile_upload_icon}
                      alt="Upload icon"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">
                    {resumeFile ? resumeFile.name : "Click to select resume (PDF)"}
                  </span>
                </label>

                <div className="flex gap-3 w-full sm:w-auto">
                   <button
                    disabled={!resumeFile || loading}
                    onClick={handleResumeSave}
                    className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-white font-medium transition-all shadow-md flex items-center justify-center gap-2 ${
                      !resumeFile || loading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 cursor-pointer hover:shadow-indigo-200 hover:-translate-y-0.5"
                    }`}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin w-5 h-5" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      "Save Resume"
                    )}
                  </button>
                  <button
                     onClick={() => {
                        setIsEdit(false);
                        setResumeFile(null);
                     }}
                     className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                  </div>
                  <div>
                    {userData?.resume ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">Current Resume</span>
                        <a
                          href={userData.resume}
                          target="_blank"
                          className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                          View PDF
                        </a>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 font-medium">
                        No resume uploaded
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-5 py-2.5 border border-indigo-200 text-indigo-600 rounded-xl text-sm hover:bg-indigo-50 transition-colors cursor-pointer font-semibold shadow-sm"
                >
                  {userData?.resume ? "Update Resume" : "Upload Resume"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Applications Table */}
        {applicationsLoading ? (
          <div className="flex justify-center items-center h-40">
            <LoaderCircle className="animate-spin h-8 w-8 text-indigo-500" />
          </div>
        ) : !userApplication || userApplication.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No Applications Yet</h3>
            <p className="text-gray-500 mb-6">Start applying to jobs to see them here.</p>
            <Link to="/all-jobs" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
               Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
               <h1 className="text-lg font-bold text-gray-800">Job Applications</h1>
               <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold">
                  {userApplication.length} Applied
               </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Applied Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {[...userApplication].reverse().map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-lg object-contain bg-white p-1 border border-gray-100"
                            src={
                              job?.companyId?.image || assets.company_icon
                            }
                            alt={job.companyId?.name}
                            onError={(e) => {
                              e.target.src = assets.company_icon;
                            }}
                          />
                          <span className="ml-3 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {job?.companyId?.name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {job?.jobId?.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                           <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                           </svg>
                           {job?.jobId?.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                        {moment(job.date).format("MMM D, YYYY")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium gap-1.5 border ${
                            job.status === "Pending"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                              : job.status === "Rejected"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : "bg-green-50 text-green-700 border-green-100"
                          }`}
                        >
                           <span className={`w-1.5 h-1.5 rounded-full ${
                              job.status === "Pending" ? "bg-yellow-500" :
                              job.status === "Rejected" ? "bg-red-500" : "bg-green-500"
                           }`}></span>
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
      {/* <Footer /> */}
    </>
  );
};

export default Applications;

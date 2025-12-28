import React, { useEffect, useState, useCallback , useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import moment from "moment";

const ProfileDetails = () => {
  const { backendUrl, userToken } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user/user-applications`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      
      if (data.success) {
        setUserInfo(data.user);
        setApplications(data.applications || []);
      }
    } catch (error) {
      // console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Memoized fetch function (won’t re-create unless backendUrl/userToken changes)
  const fetchUserProfile = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user/user-data`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (data.success && data.userData) {
        setUserInfo(data.userData);
      }
    } catch (error) {
      // console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, userToken]); // only re-create if these change

  // ✅ useEffect runs only once or when token/url changes
  useEffect(() => {
    fetchUserProfile();
  }, [userInfo]);

  useEffect(() => {
    fetchUserProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      {/* <Navbar /> */}
      <section className="max-w-5xl mx-auto px-4">
        {/* --- USER PROFILE --- */}
        <div className="bg-white rounded-3xl shadow-xl border border-indigo-50 overflow-hidden mb-10 relative">
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
          <div className="px-8 pb-8">
             <div className="relative flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 mb-6">
                <img
                  src={userInfo?.image}
                  alt={userInfo?.name || "User profile"}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                />
                <div className="flex-1 pt-2">
                   <h2 className="text-3xl font-bold text-gray-800">{userInfo?.name || "User"}</h2>
                   <p className="text-gray-500 font-medium">{userInfo?.email || "No email"}</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  {userInfo?.resume && (
                    <a
                      href={userInfo.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                    >
                      View Resume
                    </a>
                  )}
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 border-t border-gray-100 pt-8">
                <div className="md:col-span-2 space-y-6">
                   <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">About</h3>
                      <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                        {userInfo?.bio || "No bio provided"}
                      </p>
                   </div>
                </div>
                
                <div className="space-y-6">
                   {userInfo?.skills && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(userInfo.skills)
                          ? userInfo.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-indigo-100"
                              >
                                {skill}
                              </span>
                            ))
                          : userInfo.skills
                              ?.split(",")
                              .map((skill, i) => (
                                <span
                                  key={i}
                                  className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-indigo-100"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>


        {/* --- APPLICATIONS LIST --- */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
             <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
             </span>
             Applications History
          </h2>

          {applications.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
               <p className="text-gray-500 font-medium">No applications found yet.</p>
               <p className="text-sm text-gray-400 mt-1">Start applying to jobs to see them here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {[...applications].reverse().map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.companyId?.image}
                            alt={app.companyId?.name}
                            className="w-10 h-10 rounded-lg object-cover shadow-sm bg-white"
                          />
                          {app.companyId?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {app.jobId?.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {app.jobId?.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                           {app.jobId?.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                           className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                            app.status === "Shortlisted" || app.status === "Accepted"
                              ? "bg-green-100 text-green-700"
                              : app.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                           }`}
                        >
                           <span className={`w-1.5 h-1.5 rounded-full ${
                              app.status === "Shortlisted" || app.status === "Accepted" ? "bg-green-500" : app.status === "Rejected" ? "bg-red-500" : "bg-blue-500"
                           }`}></span>
                           {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {moment(app.date).format("MMM D, YYYY")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default ProfileDetails;

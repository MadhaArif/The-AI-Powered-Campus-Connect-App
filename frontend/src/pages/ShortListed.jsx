import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import moment from "moment";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { LoaderCircle, Search, Mail, Phone, Calendar, FileText, UserCheck } from "lucide-react";

const ShortListed = () => {
  const { backendUrl } = useContext(AppContext);
  const [shortlistedJobs, setShortlistedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShortlistedJobs = async () => {
    try {
      const token = localStorage.getItem("companyToken");

      if (!token) {
        toast.error("Company token not found");
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/company/shortlisted-applicants`,
        { headers: { token } }
      );

      if (data.success) {
        setShortlistedJobs(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlistedJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shortlisted Candidates</h1>
            <p className="text-gray-600">Manage and review your selected potential hires</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-200">
              Total Shortlisted: {shortlistedJobs.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <LoaderCircle className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading candidates...</p>
          </div>
        ) : shortlistedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Shortlisted Candidates Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Candidates you shortlist from the applications page will appear here for further review.
            </p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role Applied</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {shortlistedJobs.map((job, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={job.userId.image}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{job.userId.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {job.userId.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {job.jobId.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {moment(job.date).format("MMM D, YYYY")}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a
                          href={job.userId.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline py-2 px-4 text-sm inline-flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Resume
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortListed;

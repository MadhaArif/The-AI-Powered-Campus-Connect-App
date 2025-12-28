import axios from "axios";
import kConverter from "k-convert";
import { Clock, MapPin, User, Briefcase, Calendar, CheckCircle, ChevronRight, Share2, Building2 } from "lucide-react";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";

const ApplyJob = () => {
  const [jobData, setJobData] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [noSimilarJobs, setNoSimilarJobs] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();
  const {
    jobs,
    jobLoading,
    backendUrl,
    userToken,
    userData,
    userApplication = [],
  } = useContext(AppContext);

  const applyJob = async (jobId) => {
    
    try {
      if (!userData) {
        navigate("/candidate-login");
        return toast.error("Please login to apply");
      }
      if (!userData?.resume) {
        navigate("/applications");
        return toast.error("Please upload your resume");
      }

      const { data } = await axios.post(
        `${backendUrl}/user/apply-job`,
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
           
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setAlreadyApplied(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (jobs && id) {
      const data = jobs.find((job) => job._id === id);
      setJobData(data);
    }
  }, [id, jobs]);

  useEffect(() => {
    if (userApplication?.length > 0 && jobData) {
      const hasApplied = userApplication.some(
        (item) => item?.jobId?._id === jobData?._id
      );
      setAlreadyApplied(hasApplied);
    }
  }, [jobData, userApplication]);

  useEffect(() => {
    if (jobs && jobData) {
      const similarJobs = jobs.filter(
        (job) =>
          job._id !== jobData?._id &&
          job.companyId?.name === jobData?.companyId?.name
      );
      setNoSimilarJobs(similarJobs.length === 0);
    }
  }, [jobData, jobs]);

  if (jobLoading || !jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 pt-10 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Job Header Card */}
          <div className="glass-panel rounded-2xl overflow-hidden mb-8 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
            <div className="p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="w-24 h-24 flex-shrink-0 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center p-2 shadow-sm group">
                    <img
                      src={jobData?.companyId?.image || assets.company_icon}
                      alt={jobData?.companyId?.name || "Company logo"}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = assets.company_icon;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                      {jobData?.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                        <Building2 size={16} className="text-indigo-500" />
                        <span className="font-medium">{jobData?.companyId?.name || "Unknown Company"}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                        <User size={16} className="text-indigo-500" />
                        <span className="font-medium">{jobData?.level}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                        <MapPin size={16} className="text-indigo-500" />
                        <span className="font-medium">{jobData?.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-700 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                        <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                           <img src={assets.money_icon} alt="Salary" className="w-4 h-4 opacity-80" />
                        </span>
                        <div>
                          <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Salary</p>
                          <p className="font-bold text-gray-900">
                            RS. {jobData?.salary ? kConverter.convertTo(jobData.salary) : "Not disclosed"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                           <Clock size={16} className="text-blue-600" />
                        </span>
                        <div>
                          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Posted</p>
                          <p className="font-bold text-gray-900">{moment(jobData?.date).fromNow()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-start lg:items-end gap-4">
                   <div className="flex items-center gap-3 w-full lg:w-auto">
                     <button className="p-3 rounded-xl border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-300">
                        <Share2 size={20} />
                     </button>
                     <button
                       className={`${
                         alreadyApplied
                           ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200 font-bold py-3 px-8 rounded-xl flex items-center gap-2 w-full lg:w-auto justify-center"
                           : "btn-primary w-full lg:w-auto flex items-center justify-center gap-2"
                       }`}
                       onClick={() => applyJob(jobData?._id)}
                       disabled={alreadyApplied}
                     >
                       {alreadyApplied ? (
                         <>
                           <CheckCircle size={20} />
                           <span>Applied Successfully</span>
                         </>
                       ) : (
                         <>
                           <span>Apply Now</span>
                           <ChevronRight size={20} />
                         </>
                       )}
                     </button>
                   </div>
                   <p className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                      <span className="text-red-500 font-medium">*</span> Please read the description carefully before applying
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content - Job Description */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-indigo-600 rounded-full"></span>
                  Job Description
                </h2>
                <div
                  className="prose prose-lg prose-indigo max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: jobData?.description }}
                />
              </div>
            </div>

            {/* Right Sidebar - Similar Jobs */}
            <div className="w-full lg:w-1/3 space-y-8">
              <div className="glass-panel rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                  <span>More from {jobData?.companyId?.name}</span>
                  <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                     View all
                  </span>
                </h2>
                
                <div className="space-y-4">
                  {noSimilarJobs ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                      <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No other open positions at the moment.</p>
                    </div>
                  ) : (
                    jobs
                      .filter(
                        (job) =>
                          job._id !== jobData?._id &&
                          job.companyId?.name === jobData?.companyId?.name
                      )
                      .slice(0, 4)
                      .map((job) => (
                        <JobCard key={job._id} job={job} />
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;

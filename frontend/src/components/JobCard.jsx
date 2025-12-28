import React from "react";
import moment from "moment";
import kConverter from "k-convert";
import { assets } from "../assets/assets";
import { MapPin, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      key={job._id}
      onClick={() => {
        navigate(`/apply-job/${job._id}`);
        scrollTo(0, 0);
      }}
      className="group flex flex-col sm:flex-row gap-4 rounded-xl glass-panel p-6 card-hover cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-all group-hover:scale-110" />
      
      <div className="shrink-0 relative z-10">
        <img
          className="w-16 h-16 object-contain p-2 border border-gray-100 rounded-xl bg-white shadow-sm group-hover:scale-105 transition-transform"
          src={job.companyId?.image || assets.company_icon}
          alt={`${job.companyId?.name || "Company"} Logo`}
        />
      </div>
      
      <div className="flex-1 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl text-gray-800 font-bold mb-1 group-hover:text-indigo-600 transition-colors">
              {job.title}
            </h1>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"></span>
              {job.companyId?.name || "Unknown Company"}
            </p>
          </div>
          <span className="hidden sm:inline-flex px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            {job.level}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 mt-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 border border-gray-100">
            <MapPin size={14} className="text-indigo-500" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 border border-gray-100">
            <Clock size={14} className="text-indigo-500" />
            <span>{moment(job.date).fromNow()}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 border border-gray-100">
            <img src={assets.money_icon} alt="Salary" className="w-4 h-4 opacity-60" />
            <span className="font-semibold text-gray-700">
              RS. {job.salary ? kConverter.convertTo(job.salary) : "Not disclosed"}
            </span>
          </div>
        </div>
      </div>

      <div className="sm:hidden mt-2 relative z-10">
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
          {job.level}
        </span>
      </div>
    </div>
  );
};

export default JobCard;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { Bell, Filter, Calendar, BookOpen } from "lucide-react";

const Announcements = () => {
  const { backendUrl } = useContext(AppContext);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseCode, setCourseCode] = useState("");

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/lms/announcements`, {
        params: courseCode ? { courseCode } : {},
      });
      if (data.success) setAnnouncements(data.announcements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-12 px-5 mb-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Announcements</h1>
          <p className="text-indigo-100 max-w-2xl text-lg">
            Stay updated with the latest news, updates, and important notices.
          </p>
          
          {/* Filter Bar */}
          <div className="mt-8 max-w-xl relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-indigo-300" />
            </div>
            <input
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Filter by course code..."
              className="block w-full pl-10 pr-4 py-3 border-none rounded-xl leading-5 bg-white/10 backdrop-blur-md text-white placeholder-indigo-200 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/50 transition-all shadow-lg"
            />
            <button
              onClick={fetchAnnouncements}
              className="absolute inset-y-1 right-1 px-4 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader />
            <p className="mt-4 text-gray-500 animate-pulse">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center glass-panel rounded-2xl shadow-sm"
          >
            <div className="w-16 h-16 bg-gray-50/50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No announcements</h3>
            <p className="text-gray-500 mt-1 max-w-md">
              There are no announcements to display at the moment.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {announcements.map((a, index) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group glass-panel rounded-2xl p-6 card-hover relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 rounded-bl-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex items-start gap-4 relative z-10">
                   <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      Date.now() - Number(a.date) < 48 * 60 * 60 * 1000 
                      ? "bg-red-50 text-red-500" 
                      : "bg-indigo-50 text-indigo-500"
                   }`}>
                      <Bell size={20} />
                   </div>
                   
                   <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {a.title}
                        </h2>
                        {Date.now() - Number(a.date) < 48 * 60 * 60 * 1000 && (
                          <span className="shrink-0 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                         <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(a.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                         </span>
                         {a.courseCode && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                               <BookOpen size={10} />
                               {a.courseCode}
                            </span>
                         )}
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {a.body}
                      </p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Announcements;

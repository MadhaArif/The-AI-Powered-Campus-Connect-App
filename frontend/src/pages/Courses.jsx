import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { Search, BookOpen, ExternalLink, Calendar, User, FileText } from "lucide-react";
import { motion } from "framer-motion";

const Courses = () => {
  const { backendUrl } = useContext(AppContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/lms/courses`, {
        params: search ? { search } : {},
      });
      if (data.success) setCourses(data.courses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-12 px-5 mb-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Academic Courses</h1>
          <p className="text-indigo-100 max-w-2xl text-lg">
            Access your course materials, assignments, and resources in one place.
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-xl relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-300" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course code or title..."
              className="block w-full pl-10 pr-4 py-3 border-none rounded-xl leading-5 bg-white/10 backdrop-blur-md text-white placeholder-indigo-200 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/50 transition-all shadow-lg"
            />
            <button
              onClick={fetchCourses}
              className="absolute inset-y-1 right-1 px-4 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader />
            <p className="mt-4 text-gray-500 animate-pulse">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center glass-panel rounded-2xl shadow-sm"
          >
            <div className="w-16 h-16 bg-gray-50/50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No courses found</h3>
            <p className="text-gray-500 mt-1 max-w-md">
              We couldn't find any courses matching your search. Try different keywords.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, index) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group glass-panel rounded-2xl p-6 card-hover relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 transition-colors duration-300">
                    <BookOpen className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  {c.lmsLink && (
                    <a
                      href={c.lmsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      LMS <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                  {c.code}
                </h2>
                <h3 className="text-sm font-medium text-gray-600 mb-4 line-clamp-1">
                  {c.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User size={16} className="text-gray-400" />
                    <span>{c.instructor}</span>
                  </div>
                </div>

                {Array.isArray(c.assignments) && c.assignments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={16} className="text-indigo-500" />
                      <span className="text-sm font-semibold text-gray-700">Assignments</span>
                    </div>
                    <ul className="space-y-2">
                      {c.assignments.slice(0, 2).map((a, idx) => (
                        <li key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg">
                          <span className="font-medium text-gray-700 truncate max-w-[60%]">{a.title}</span>
                          {a.dueDate && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <Calendar size={10} />
                              {new Date(a.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </li>
                      ))}
                      {c.assignments.length > 2 && (
                        <li className="text-xs text-center text-indigo-600 font-medium pt-1">
                          +{c.assignments.length - 2} more assignments
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses;


import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JobCategories, JobLocations } from "../assets/assets";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { slideRigth, SlideUp } from "../utils/Animation";

function AllJobs() {
  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const {
    jobs,
    searchFilter,
    setSearchFilter,
    setIsSearched,
    isSearched,
    fetchJobsData,
  } = useContext(AppContext);

  const { category } = useParams();
  const navigate = useNavigate();

  const jobsPerPage = 6;

  const [searchInput, setSearchInput] = useState({
    title: "",
    location: "",
    selectedCategories: [],
    selectedLocations: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchJobsData();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!jobs?.length) return;

    let filtered = [...jobs];

    if (category !== "all") {
      filtered = filtered.filter(
        (job) => job.category.toLowerCase() === category.toLowerCase()
      );
    }

    setJobData(filtered);
    setSearchInput({
      title: isSearched ? searchFilter.title : "",
      location: isSearched ? searchFilter.location : "",
      selectedCategories: [],
      selectedLocations: [],
    });

    setCurrentPage(1);
  }, [category, jobs, isSearched, searchFilter]);

  useEffect(() => {
    let results = [...jobData];

    if (searchInput.title.trim()) {
      results = results.filter((job) =>
        job.title.toLowerCase().includes(searchInput.title.trim().toLowerCase())
      );
    }

    if (searchInput.location.trim()) {
      results = results.filter((job) =>
        job.location
          .toLowerCase()
          .includes(searchInput.location.trim().toLowerCase())
      );
    }

    if (searchInput.selectedCategories.length > 0) {
      results = results.filter((job) =>
        searchInput.selectedCategories.includes(job.category)
      );
    }

    if (searchInput.selectedLocations.length > 0) {
      results = results.filter((job) =>
        searchInput.selectedLocations.includes(job.location)
      );
    }

    setFilteredJobs(results);
    setCurrentPage(1);
  }, [jobData, searchInput]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (cat) => {
    setSearchInput((prev) => {
      const updated = prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat];
      return { ...prev, selectedCategories: updated };
    });
  };

  const handleLocationToggle = (loc) => {
    setSearchInput((prev) => {
      const updated = prev.selectedLocations.includes(loc)
        ? prev.selectedLocations.filter((l) => l !== loc)
        : [...prev.selectedLocations, loc];
      return { ...prev, selectedLocations: updated };
    });
  };

  const clearAllFilters = () => {
    setSearchInput({
      title: "",
      location: "",
      selectedCategories: [],
      selectedLocations: [],
    });
    setSearchFilter({ title: "", location: "" });
    setIsSearched(false);
    navigate("/all-jobs/all");
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginatedJobs = useMemo(() => {
    return [...filteredJobs]
      .reverse()
      .slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
  }, [filteredJobs, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      <section>
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md shadow-indigo-200"
          >
            <Filter size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <motion.div
          variants={slideRigth(0.5)}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row md:gap-8 lg:gap-16"
        >
          {/* Filters */}
          <div
            className={`lg:w-1/4 h-fit sticky top-24 bg-white p-6 rounded-xl border border-gray-100 shadow-sm ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Search
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Job Title</label>
                    <input
                      type="text"
                      name="title"
                      value={searchInput.title}
                      onChange={handleSearchChange}
                      placeholder="e.g. Frontend Developer"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={searchInput.location}
                      onChange={handleSearchChange}
                      placeholder="e.g. Remote"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Category
                </h2>
                <ul className="space-y-2.5">
                  {JobCategories.map((cat, i) => (
                    <li key={i} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        id={`cat-${i}`}
                        checked={searchInput.selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                      />
                      <label
                        htmlFor={`cat-${i}`}
                        className="ml-3 text-sm text-gray-600 group-hover:text-indigo-600 transition-colors cursor-pointer select-none"
                      >
                        {cat}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Locations
                </h2>
                <ul className="space-y-2.5">
                  {JobLocations.map((loc, i) => (
                    <li key={i} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        id={`loc-${i}`}
                        checked={searchInput.selectedLocations.includes(loc)}
                        onChange={() => handleLocationToggle(loc)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                      />
                      <label
                        htmlFor={`loc-${i}`}
                        className="ml-3 text-sm text-gray-600 group-hover:text-indigo-600 transition-colors cursor-pointer select-none"
                      >
                        {loc}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 capitalize tracking-tight">
                  {category === "all"
                    ? "Latest Jobs"
                    : `Jobs in ${
                        category.charAt(0).toUpperCase() + category.slice(1)
                      }`}
                </h1>
                <p className="text-gray-500 mt-1">
                  Find your dream job from top university recruiters
                </p>
              </div>
              
              {filteredJobs.length > 0 && (
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm border border-indigo-100 shadow-sm">
                  {filteredJobs.length} {filteredJobs.length === 1 ? "Opportunity" : "Opportunities"} Found
                </span>
              )}
            </div>

            <motion.div
              variants={SlideUp(0.5)}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job, i) => <JobCard key={i} job={job} />)
              ) : (
                <div className="text-center glass-panel py-12 px-6 rounded-2xl">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    We couldn't find any jobs matching your current filters. Try removing some filters or search for something else.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="btn-primary"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </motion.div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-indigo-600 transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl border text-center font-semibold transition-all duration-300 ${
                      currentPage === i + 1
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-indigo-600 transition-all duration-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </section>
      {/* <Footer /> */}
    </>
  );
}

export default AllJobs;

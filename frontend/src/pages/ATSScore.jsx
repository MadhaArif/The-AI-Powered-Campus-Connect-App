import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { 
  Upload, FileText, CheckCircle, AlertTriangle, XCircle, Loader2, Sparkles, 
  TrendingUp, AlertCircle, Briefcase, Copy, Check, Award, ArrowRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import toast from "react-hot-toast";

const ATSScore = () => {
  const { backendUrl, userToken } = useContext(AppContext);
  
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState("general"); // 'general' or 'match'
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/jobs/all-jobs`);
        if (data.success) {
          setJobs(data.jobs);
        }
      } catch (error) {
        // console.error("Failed to fetch jobs for dropdown", error);
      }
    };
    fetchJobs();
  }, [backendUrl]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setResume(file);
      } else {
        toast.error("Please upload a PDF file.");
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleJobSelect = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    if (jobId) {
      const job = jobs.find(j => j._id === jobId);
      if (job) {
        setJobDescription(job.description);
      }
    } else {
      setJobDescription("");
    }
  };

  const analyzeResume = async () => {
    if (!userToken) {
      toast.error("Please login to use this feature.");
      return;
    }

    if (!resume) {
      toast.error("Please upload your resume first.");
      return;
    }

    if (mode === "match" && !jobDescription.trim()) {
      toast.error("Please provide a job description or select a job for matching.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      const { data } = await axios.post(`${backendUrl}/ats/analyze`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setResult(data.analysis);
        toast.success("Analysis Complete!");
      } else {
        toast.error(data.message || "Analysis failed.");
      }
    } catch (error) {
      console.error("ATS Error:", error);
      const msg = error?.response?.data?.message || error.message || "Something went wrong.";
      toast.error(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const copyKeywords = () => {
    if (result?.missingKeywords) {
      navigator.clipboard.writeText(result.missingKeywords.join(", "));
      setCopied(true);
      toast.success("Keywords copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  
  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-50 from-green-100 to-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 from-yellow-100 to-yellow-50 border-yellow-200";
    return "bg-red-50 from-red-100 to-red-50 border-red-200";
  };

  const getRank = (score) => {
    if (score >= 90) return { label: "Top 1% Candidate", icon: "🏆", color: "text-yellow-500", bg: "bg-yellow-50" };
    if (score >= 80) return { label: "Excellent Match", icon: "🌟", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 70) return { label: "Strong Contender", icon: "💪", color: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 60) return { label: "Good Start", icon: "👍", color: "text-indigo-600", bg: "bg-indigo-50" };
    if (score >= 50) return { label: "Needs Improvement", icon: "📈", color: "text-orange-600", bg: "bg-orange-50" };
    return { label: "Needs Work", icon: "🚧", color: "text-red-600", bg: "bg-red-50" };
  };

  const copyKeyword = (keyword) => {
    navigator.clipboard.writeText(keyword);
    toast.success(`Copied "${keyword}"`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Header */}
      <div className="bg-slate-900 py-12 px-5 mb-10 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-900/50 to-transparent"></div>
         
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" /> AI-Powered Resume Analysis
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                ATS & CV Matchmaker
              </h1>
              <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                Optimize your resume to pass Applicant Tracking Systems and land your dream job.
              </p>
            </motion.div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-6">
              
              {/* Mode Switcher */}
              <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
                <button
                  onClick={() => setMode("general")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    mode === "general" 
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  General Audit
                </button>
                <button
                  onClick={() => setMode("match")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    mode === "match" 
                      ? "bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Job Match
                </button>
              </div>

              {/* Upload Area */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">1. Upload Resume (PDF)</label>
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? "border-indigo-500 bg-indigo-50 scale-[1.02]" 
                      : resume 
                        ? "border-green-500 bg-green-50"
                        : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {resume ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <p className="text-slate-900 font-semibold truncate max-w-xs">{resume.name}</p>
                      <p className="text-slate-500 text-xs mt-1">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); 
                          setResume(null);
                        }}
                        className="mt-3 text-red-500 text-xs font-bold hover:text-red-700 uppercase tracking-wide z-20 relative"
                      >
                        Change File
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-slate-700 font-medium">Drag & drop resume</p>
                      <p className="text-slate-400 text-xs mt-1">or click to browse</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description Area */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                   <label className="block text-sm font-bold text-slate-700">
                     2. {mode === "match" ? "Target Job" : "Context (Optional)"}
                   </label>
                   {mode === "match" && (
                     <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">REQUIRED</span>
                   )}
                </div>

                {mode === "match" && jobs.length > 0 && (
                  <div className="relative mb-3">
                    <select
                      value={selectedJobId}
                      onChange={handleJobSelect}
                      className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-slate-50 text-slate-700 text-sm"
                    >
                      <option value="">Select a Job from Platform...</option>
                      {jobs.map((job) => (
                        <option key={job._id} value={job._id}>
                          {job.title} at {job.companyId?.name || "Unknown Company"}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                )}

                {(mode === "general" || mode === "match") && (
                  <textarea
                    value={jobDescription}
                    onChange={(e) => {
                       setJobDescription(e.target.value);
                       if (selectedJobId && e.target.value !== jobs.find(j => j._id === selectedJobId)?.description) {
                         setSelectedJobId(""); 
                       }
                    }}
                    placeholder={mode === "match" ? "Paste the job description here..." : "Paste job description for context (optional)..."}
                    className="w-full h-32 p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-600 placeholder-slate-400 bg-slate-50 text-sm"
                  ></textarea>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={analyzeResume}
                disabled={loading || !resume}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transform transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading || !resume
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-indigo-200" />
                    {mode === "match" ? "Run Match Analysis" : "Audit Resume"}
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Results Section */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-10 bg-white border-2 border-dashed border-slate-200 rounded-2xl min-h-[500px]"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <TrendingUp className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">
                    {mode === "match" ? "Ready to Match?" : "Ready to Audit?"}
                  </h3>
                  <p className="text-slate-500 max-w-sm">
                    {mode === "match" 
                      ? "Select a job and upload your resume to see your compatibility score." 
                      : "Upload your resume to get a detailed ATS audit and actionable feedback."}
                  </p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Score Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                      <div className="flex-1 text-center md:text-left">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${getRank(result.score).bg} ${getRank(result.score).color}`}>
                            {getRank(result.score).icon} {getRank(result.score).label}
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">
                          Overall ATS Score
                        </h2>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                          {result.summary}
                        </p>
                        <div className="flex flex-wrap gap-2">
                           <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                             parsed by Gemini 2.0
                           </div>
                           <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                             {mode === "match" ? "Job Match Mode" : "General Audit Mode"}
                           </div>
                        </div>
                      </div>
                      
                      <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                          {/* Circular Progress Background */}
                          <svg className="w-full h-full transform -rotate-90">
                              <circle
                                  cx="96"
                                  cy="96"
                                  r="88"
                                  stroke="#f1f5f9"
                                  strokeWidth="16"
                                  fill="transparent"
                              />
                              <motion.circle
                                  cx="96"
                                  cy="96"
                                  r="88"
                                  stroke="currentColor"
                                  strokeWidth="16"
                                  fill="transparent"
                                  strokeDasharray={553}
                                  strokeDashoffset={553 - (553 * result.score) / 100}
                                  className={getScoreColor(result.score)}
                                  strokeLinecap="round"
                                  initial={{ strokeDashoffset: 553 }}
                                  animate={{ strokeDashoffset: 553 - (553 * result.score) / 100 }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                              />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className={`text-5xl font-black ${getScoreColor(result.score)}`}>
                                <CountUp end={result.score} duration={2} />
                              </span>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
                          </div>
                      </div>
                    </div>
                  </div>

                  {/* Missing Keywords - High Value Action */}
                  {result.missingKeywords?.length > 0 && (
                    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Quick Wins: Missing Keywords</h3>
                                    <p className="text-xs text-slate-500">Add these to boost your score immediately</p>
                                </div>
                            </div>
                            <button 
                                onClick={copyKeywords}
                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-indigo-200 shadow-md"
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? "Copied All" : "Copy All"}
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {result.missingKeywords.map((keyword, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => copyKeyword(keyword)}
                                    className="group flex items-center gap-1.5 px-3 py-2 bg-white border border-indigo-100 rounded-lg text-sm font-medium text-slate-700 hover:border-indigo-300 hover:shadow-md transition-all"
                                >
                                    <span>{keyword}</span>
                                    <Copy className="w-3 h-3 text-slate-300 group-hover:text-indigo-500" />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                  )}

                  {/* 2-Column Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Strengths */}
                      <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm h-full">
                          <div className="flex items-center gap-2 mb-4">
                              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                  <CheckCircle className="w-5 h-5" />
                              </div>
                              <h3 className="font-bold text-slate-800">What You Did Well</h3>
                          </div>
                          <ul className="space-y-3">
                              {result.strengths?.map((s, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-green-50/50 p-2 rounded-lg">
                                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                      {s}
                                  </li>
                              ))}
                          </ul>
                      </div>
                      
                      {/* Weaknesses & Formatting */}
                      <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm h-full">
                          <div className="flex items-center gap-2 mb-4">
                              <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                  <AlertCircle className="w-5 h-5" />
                              </div>
                              <h3 className="font-bold text-slate-800">Areas for Improvement</h3>
                          </div>
                          
                          <div className="space-y-4">
                              {/* Weaknesses */}
                              <ul className="space-y-3">
                                  {result.weaknesses?.map((w, i) => (
                                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-red-50/50 p-2 rounded-lg">
                                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                          {w}
                                      </li>
                                  ))}
                              </ul>

                              {/* Formatting Issues (if any) */}
                              {result.formattingIssues?.length > 0 && (
                                  <div className="mt-4 pt-4 border-t border-slate-100">
                                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Formatting Check</h4>
                                      <ul className="space-y-2">
                                          {result.formattingIssues.map((issue, i) => (
                                              <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                                                  {issue}
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>

                  {/* Action Plan - Interactive */}
                  <div className="bg-indigo-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                     <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                               <div className="bg-indigo-800 p-2 rounded-lg border border-indigo-700">
                                 <TrendingUp className="w-6 h-6 text-yellow-400" />
                               </div>
                               Step-by-Step Improvement Plan
                            </h3>
                            <span className="bg-indigo-800 px-3 py-1 rounded-full text-xs font-bold text-indigo-200 border border-indigo-700">
                                {result.improvementPlan?.length || 0} Steps
                            </span>
                        </div>
                        
                        <div className="grid gap-3">
                           {result.improvementPlan?.map((step, i) => (
                              <label key={i} className="flex items-start gap-4 bg-indigo-800/30 p-4 rounded-xl border border-indigo-700/30 hover:bg-indigo-800/60 transition-colors cursor-pointer group select-none">
                                 <div className="relative flex items-center justify-center pt-1">
                                    <input type="checkbox" className="peer w-5 h-5 appearance-none border-2 border-indigo-400 rounded checked:bg-green-500 checked:border-green-500 transition-colors" />
                                    <Check className="w-3.5 h-3.5 text-white absolute top-1.5 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                 </div>
                                 <div className="flex-1">
                                    <p className="text-indigo-100 font-medium leading-relaxed group-hover:text-white transition-colors">
                                        {step}
                                    </p>
                                 </div>
                              </label>
                           ))}
                        </div>
                     </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScore;

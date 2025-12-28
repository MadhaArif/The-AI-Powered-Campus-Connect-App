import React, { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { 
  Briefcase, 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Plus, 
  Trash2, 
  Download, 
  Sparkles, 
  Wand2,
  FileText,
  CheckCircle,
  Loader2,
  X,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { backendUrl, userToken } = useContext(AppContext);
  const resumeRef = useRef();

  const [loadingAI, setLoadingAI] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  
  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: [],
    experience: [
      { id: 1, role: "", company: "", duration: "", description: "" }
    ],
    education: [
      { id: 1, degree: "", school: "", year: "" }
    ]
  });

  const [newSkill, setNewSkill] = useState("");

  // --- Handlers ---

  const handleInputChange = (e, section, index = null) => {
    const { name, value } = e.target;
    if (section === "personal") {
      setResumeData(prev => ({ ...prev, [name]: value }));
    } else if (index !== null) {
      const updatedList = [...resumeData[section]];
      updatedList[index][name] = value;
      setResumeData(prev => ({ ...prev, [section]: updatedList }));
    }
  };

  const addItem = (section) => {
    const newItem = section === "experience" 
      ? { id: Date.now(), role: "", company: "", duration: "", description: "" }
      : { id: Date.now(), degree: "", school: "", year: "" };
    
    setResumeData(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const removeItem = (section, index) => {
    const updatedList = resumeData[section].filter((_, i) => i !== index);
    setResumeData(prev => ({ ...prev, [section]: updatedList }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setResumeData(prev => ({ 
      ...prev, 
      skills: prev.skills.filter(skill => skill !== skillToRemove) 
    }));
  };

  // --- AI Suggestion ---

  const getAISuggestions = async () => {
    if (!targetRole.trim()) {
      toast.error("Please enter a target role first.");
      return;
    }
    if (!userToken) {
      toast.error("Please login to use AI features.");
      return;
    }

    setLoadingAI(true);
    try {
      const { data } = await axios.post(`${backendUrl}/resume/suggest`, { role: targetRole }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      if (data.success) {
        const { summary, skills, experiencePoints } = data.suggestions;
        
        // Merge suggestions
        setResumeData(prev => ({
          ...prev,
          summary: prev.summary ? prev.summary : summary,
          skills: [...new Set([...prev.skills, ...skills])], // Merge unique
        }));

        // Optionally append a sample experience if empty
        if (resumeData.experience.length === 1 && !resumeData.experience[0].role) {
             setResumeData(prev => ({
                 ...prev,
                 experience: [{
                     id: Date.now(),
                     role: targetRole,
                     company: "Example Company",
                     duration: "202X - Present",
                     description: experiencePoints[0] || "Led key initiatives..."
                 }]
             }));
        }

        toast.success("AI Suggestions Applied!");
      } else {
        toast.error(data.message || "Failed to get suggestions");
      }
    } catch (error) {
      // console.error("AI Error:", error);
      toast.error("Something went wrong with AI generation.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleReview = async () => {
    if (!userToken) {
        toast.error("Please login to use AI Review.");
        return;
    }
    setReviewing(true);
    try {
        const { data } = await axios.post(`${backendUrl}/resume/review`, { resumeData }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        if (data.success) {
            setReviewResult({ ...data.review, isDemo: data.isDemo });
            setShowReviewModal(true);
            toast.success("Resume Review Complete!");
        } else {
            toast.error(data.message || "Review failed");
        }
    } catch (error) {
        // console.error("Review Error:", error);
        toast.error("Failed to review resume.");
    } finally {
        setReviewing(false);
    }
  };

  // --- PDF Download ---

  const downloadPDF = async () => {
    const element = resumeRef.current;
    if (!element) {
        toast.error("Resume element not found!");
        return;
    }

    const toastId = toast.loading("Generating PDF...");

    try {
        const opt = {
            margin: [0.5, 0.5], // [top/bottom, left/right] in inches
            filename: `${resumeData.fullName.replace(/\s+/g, '_') || 'Resume'}_CV.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                scrollY: 0
            },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Directly use the element if possible, or clone if needed for specific styling
        // Using the original element often avoids issues with missing styles in clones
        await html2pdf().set(opt).from(element).save();
        
        toast.success("PDF Downloaded!", { id: toastId });

    } catch (err) {
        console.error("PDF Error:", err);
        toast.error(`Download failed: ${err.message || 'Unknown error'}`, { id: toastId });
        
        // Fallback to print if html2pdf fails
        setTimeout(() => {
             if (window.confirm("PDF generation failed. Try printing to PDF instead?")) {
                 window.print();
             }
        }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <style>{`
        @media print {
            body * {
                visibility: hidden;
            }
            #resume-preview, #resume-preview * {
                visibility: visible;
            }
            #resume-preview {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 0;
                box-shadow: none;
                border: none;
                background: white;
            }
            @page {
                size: auto;
                margin: 0mm;
            }
        }
        
        /* FIX for html2canvas/Tailwind v4: Override oklch colors with hex */
        #resume-preview .text-gray-900 { color: #111827 !important; }
        #resume-preview .text-gray-800 { color: #1f2937 !important; }
        #resume-preview .text-gray-700 { color: #374151 !important; }
        #resume-preview .text-gray-600 { color: #4b5563 !important; }
        #resume-preview .text-gray-500 { color: #6b7280 !important; }
        
        #resume-preview .text-blue-900 { color: #1e3a8a !important; }
        #resume-preview .text-blue-800 { color: #1e40af !important; }
        #resume-preview .text-blue-700 { color: #1d4ed8 !important; }
        #resume-preview .text-blue-600 { color: #2563eb !important; }
        #resume-preview .text-blue-500 { color: #3b82f6 !important; }

        #resume-preview .bg-white { background-color: #ffffff !important; }
        #resume-preview .bg-gray-50 { background-color: #f9fafb !important; }
        #resume-preview .bg-blue-50 { background-color: #eff6ff !important; }
        
        #resume-preview .border-gray-800 { border-color: #1f2937 !important; }
        #resume-preview .border-gray-300 { border-color: #d1d5db !important; }
        #resume-preview .border-gray-200 { border-color: #e5e7eb !important; }
         #resume-preview .border-gray-100 { border-color: #f3f4f6 !important; }
         #resume-preview .border-blue-100 { border-color: #dbeafe !important; }

         /* Override shadow to avoid oklch in box-shadow */
         #resume-preview { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
       `}</style>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-5 text-center text-white">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <FileText className="w-8 h-8" />
          Free AI Resume Builder
        </h1>
        <p className="text-blue-100 mt-2">Create a professional resume tailored to your target role in minutes.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: Editor Form */}
        <div className="space-y-6">
            
            {/* Role & AI Assist */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Role (e.g., Full Stack Developer)</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="Enter role to get AI suggestions..."
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                        onClick={getAISuggestions}
                        disabled={loadingAI}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 font-medium disabled:opacity-70"
                    >
                        {loadingAI ? <Wand2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 text-yellow-300" />}
                        {loadingAI ? "Thinking..." : "AI Suggest"}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    * Enter a role and click "AI Suggest" to auto-fill summary and skills tailored to that job.
                </p>
            </div>

            {/* Personal Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="fullName" placeholder="Full Name" value={resumeData.fullName} onChange={(e) => handleInputChange(e, "personal")} className="p-3 border rounded-lg w-full" />
                    <input name="email" placeholder="Email" value={resumeData.email} onChange={(e) => handleInputChange(e, "personal")} className="p-3 border rounded-lg w-full" />
                    <input name="phone" placeholder="Phone" value={resumeData.phone} onChange={(e) => handleInputChange(e, "personal")} className="p-3 border rounded-lg w-full" />
                    <input name="location" placeholder="Location (City, Country)" value={resumeData.location} onChange={(e) => handleInputChange(e, "personal")} className="p-3 border rounded-lg w-full" />
                    <input name="linkedin" placeholder="LinkedIn URL" value={resumeData.linkedin} onChange={(e) => handleInputChange(e, "personal")} className="p-3 border rounded-lg w-full" />
                    <input name="github" placeholder="GitHub/Portfolio URL" value={resumeData.github} onChange={(e) => handleInputChange(e, "personal")} className="p-3 border rounded-lg w-full" />
                </div>
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" /> Professional Summary
                </h3>
                <textarea 
                    name="summary" 
                    value={resumeData.summary} 
                    onChange={(e) => handleInputChange(e, "personal")} 
                    placeholder="Brief summary of your career and goals..."
                    className="w-full p-3 border rounded-lg h-32 resize-none"
                ></textarea>
            </div>

            {/* Experience */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-500" /> Experience
                    </h3>
                    <button onClick={() => addItem("experience")} className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="mb-6 border-b border-gray-100 pb-4 last:border-0 last:pb-0 relative group">
                        <button onClick={() => removeItem("experience", index)} className="absolute top-0 right-0 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <input name="role" placeholder="Job Title" value={exp.role} onChange={(e) => handleInputChange(e, "experience", index)} className="p-2 border rounded" />
                            <input name="company" placeholder="Company Name" value={exp.company} onChange={(e) => handleInputChange(e, "experience", index)} className="p-2 border rounded" />
                        </div>
                        <input name="duration" placeholder="Duration (e.g. Jan 2022 - Present)" value={exp.duration} onChange={(e) => handleInputChange(e, "experience", index)} className="p-2 border rounded w-full mb-3" />
                        <textarea name="description" placeholder="Description of responsibilities..." value={exp.description} onChange={(e) => handleInputChange(e, "experience", index)} className="p-2 border rounded w-full h-24 resize-none" />
                    </div>
                ))}
            </div>

            {/* Education */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-500" /> Education
                    </h3>
                    <button onClick={() => addItem("education")} className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="mb-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 relative group">
                        <button onClick={() => removeItem("education", index)} className="absolute top-0 right-0 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                            <input name="school" placeholder="School / University" value={edu.school} onChange={(e) => handleInputChange(e, "education", index)} className="p-2 border rounded" />
                            <input name="degree" placeholder="Degree / Major" value={edu.degree} onChange={(e) => handleInputChange(e, "education", index)} className="p-2 border rounded" />
                        </div>
                        <input name="year" placeholder="Year (e.g. 2024)" value={edu.year} onChange={(e) => handleInputChange(e, "education", index)} className="p-2 border rounded w-full" />
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-blue-500" /> Skills
                </h3>
                <div className="flex gap-2 mb-4">
                    <input 
                        value={newSkill} 
                        onChange={(e) => setNewSkill(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="Add a skill..." 
                        className="flex-1 p-2 border rounded-lg"
                    />
                    <button onClick={addSkill} className="bg-gray-800 text-white px-4 rounded-lg hover:bg-black">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 group">
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="hover:text-red-500"><X className="w-4 h-4" /></button>
                        </span>
                    ))}
                </div>
            </div>

        </div>

        {/* RIGHT: Live Preview */}
        <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h2 className="font-bold text-gray-700">Live Preview</h2>
                <div className="flex gap-2">
                    <button 
                        onClick={handleReview}
                        disabled={reviewing}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-70"
                    >
                        {reviewing ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {reviewing ? "Reviewing..." : "AI Review"}
                    </button>
                    <button 
                        onClick={downloadPDF}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-md transition-transform active:scale-95"
                    >
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>
            </div>

            {/* RESUME PAPER */}
            <div className="overflow-auto bg-gray-200 p-4 rounded-xl border border-gray-300">
                <div 
                    id="resume-preview"
                    ref={resumeRef}
                    className="bg-white mx-auto shadow-2xl"
                    style={{ 
                        width: '8.5in', 
                        minHeight: '11in', 
                        padding: '0.5in',
                        fontFamily: 'Georgia, serif' // Classic resume font
                    }}
                >
                    {/* Header */}
                    <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                        <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900">{resumeData.fullName || "YOUR NAME"}</h1>
                        <div className="flex justify-center gap-4 text-sm text-gray-600 mt-2 flex-wrap">
                            {resumeData.email && <span className="flex items-center gap-1"><Mail size={12}/> {resumeData.email}</span>}
                            {resumeData.phone && <span className="flex items-center gap-1"><Phone size={12}/> {resumeData.phone}</span>}
                            {resumeData.location && <span className="flex items-center gap-1"><MapPin size={12}/> {resumeData.location}</span>}
                        </div>
                        <div className="flex justify-center gap-4 text-sm text-blue-800 mt-1 flex-wrap">
                            {resumeData.linkedin && <a href={resumeData.linkedin} className="hover:underline flex items-center gap-1"><Linkedin size={12}/> LinkedIn</a>}
                            {resumeData.github && <a href={resumeData.github} className="hover:underline flex items-center gap-1"><Github size={12}/> Portfolio/GitHub</a>}
                        </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                        <div className="mb-5">
                            <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-blue-900 tracking-wider">Professional Summary</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {resumeData.skills.length > 0 && (
                        <div className="mb-5">
                            <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 text-blue-900 tracking-wider">Skills</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {resumeData.skills.join(" • ")}
                            </p>
                        </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                        <div className="mb-5">
                            <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3 text-blue-900 tracking-wider">Experience</h2>
                            {resumeData.experience.map((exp, i) => (
                                <div key={i} className="mb-3">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-800">{exp.role || "Job Title"}</h3>
                                        <span className="text-sm text-gray-500 italic">{exp.duration || "Dates"}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 font-semibold mb-1">{exp.company || "Company"}</div>
                                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                        <div className="mb-5">
                            <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-3 text-blue-900 tracking-wider">Education</h2>
                            {resumeData.education.map((edu, i) => (
                                <div key={i} className="mb-2">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-800">{edu.school || "University"}</h3>
                                        <span className="text-sm text-gray-500 italic">{edu.year || "Year"}</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{edu.degree || "Degree"}</p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>

      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && reviewResult && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                <div className="p-6 border-b flex justify-between items-center bg-purple-50">
                    <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> AI Resume Audit
                    </h2>
                    <button onClick={() => setShowReviewModal(false)} className="text-gray-500 hover:text-red-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Score */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-2xl border-4 border-purple-200">
                            {reviewResult.score || 0}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">ATS Compatibility Score</h3>
                            <p className="text-sm text-gray-500">Based on standard ATS parsing rules</p>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500" /> Improvements Needed
                        </h3>
                        <ul className="space-y-2">
                            {reviewResult.feedback?.map((point, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-orange-50 p-2 rounded-lg">
                                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Improved Summary */}
                    {reviewResult.improvedSummary && (
                        <div>
                            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <Wand2 className="w-4 h-4 text-blue-500" /> Suggested Summary
                            </h3>
                            <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700 border border-blue-100 italic">
                                "{reviewResult.improvedSummary}"
                                <button 
                                    onClick={() => {
                                        setResumeData(prev => ({ ...prev, summary: reviewResult.improvedSummary }));
                                        toast.success("Summary updated!");
                                    }}
                                    className="block mt-2 text-blue-600 text-xs font-bold hover:underline"
                                >
                                    Apply This Summary
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end">
                    <button 
                        onClick={() => setShowReviewModal(false)} 
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition"
                    >
                        Close & Continue Editing
                    </button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Helper for skill removal icon
const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);

export default ResumeBuilder;

import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const AddJob = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Programming");
  const [location, setLocation] = useState("Dhaka");
  const [level, setLevel] = useState("Intermediate");
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(false);

  const { backendUrl, companyToken } = useContext(AppContext);

  const postJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/company/post-job`,
        {
          title,
          description,
          category,
          location,
          level,
          salary,
        },
        {
          headers: { token: companyToken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setDescription("");
        setCategory("");
        setLocation("");
        setLevel("");
        setSalary(null);

        if (quillRef.current) {
          quillRef.current.root.innerHTML = "";
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write job description here...",
      });

      quillRef.current.on("text-change", () => {
        const html = editorRef.current.querySelector(".ql-editor").innerHTML;
        setDescription(html);
      });
    }
  }, []);

  useEffect(() => {
    document.title = "Campus Connect - Job Portal | Dashboard";
  }, []);

  return (
    <section className="bg-gray-50/30 min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
           <h1 className="text-2xl font-bold text-gray-800">Post a New Job</h1>
           <p className="text-gray-500 mt-1">Create a job listing to find the best talent</p>
        </div>

        <form onSubmit={postJob} className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 md:p-8">
             {/* Job Title */}
             <div className="mb-8">
               <label className="block text-gray-700 font-semibold mb-2">
                 Job Title
               </label>
               <input
                 type="text"
                 placeholder="e.g. Senior Frontend Developer"
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 required
               />
             </div>

             {/* Job Description */}
             <div className="mb-8">
               <label className="block text-gray-700 font-semibold mb-2">
                 Job Description
               </label>
               <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                  <div
                    ref={editorRef}
                    className="bg-white min-h-[200px]"
                    style={{
                      border: "none",
                    }}
                  />
               </div>
               <p className="text-xs text-gray-500 mt-2 text-right">Detailed description helps candidates understand the role better.</p>
             </div>

             {/* Form Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Job Category */}
               <div>
                 <label className="block text-gray-700 font-semibold mb-2">
                   Job Category
                 </label>
                 <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Designing">Designing</option>
                      <option value="Networking">Networking</option>
                      <option value="Management">Management</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                    </div>
                 </div>
               </div>

               {/* Job Location */}
               <div>
                 <label className="block text-gray-700 font-semibold mb-2">
                   Job Location
                 </label>
                 <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Karachi">Karachi</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Gujranwala">Gujranwala</option>
                      <option value="Mardan">Mardan</option>
                      <option value="Sahiwal">Sahiwal</option>
                      <option value="Okara">Okara</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                    </div>
                 </div>
               </div>

               {/* Job Level */}
               <div>
                 <label className="block text-gray-700 font-semibold mb-2">
                   Job Level
                 </label>
                 <div className="relative">
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Beginner">Intern</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Senior">Senior</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                    </div>
                 </div>
               </div>

               {/* Salary */}
               <div>
                 <label className="block text-gray-700 font-semibold mb-2">
                   Salary Range
                 </label>
                 <input
                   type="number"
                   placeholder="e.g. 50000"
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                   value={salary}
                   onChange={(e) => setSalary(e.target.value)}
                   required
                 />
               </div>
             </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setDescription("");
                setCategory("Programming");
                setLocation("Dhaka");
                setLevel("Intermediate");
                setSalary("");
                if (quillRef.current) quillRef.current.root.innerHTML = "";
              }}
              className="btn-outline"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin h-5 w-5" />
                  <span>Posting Job...</span>
                </>
              ) : (
                "Post Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddJob;

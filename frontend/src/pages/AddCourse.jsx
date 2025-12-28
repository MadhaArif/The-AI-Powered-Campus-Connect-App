import React, { useState, useContext } from "react";
import Quill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { LoaderCircle, BookOpen, Clock, Users, Layout, Video } from "lucide-react";
import { AppContext } from "../context/AppContext";

const AddCourse = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!companyToken) {
        toast.error("You are not logged in as a company.");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/company/add-course`,
        { title, description },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setDescription("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
          <p className="text-gray-600">Share knowledge and skills with the student community</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Course Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Advanced React Patterns"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-indigo-500" />
                  Course Description
                </label>
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                  <Quill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    className="bg-white h-64"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                }}
                className="btn-outline"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5" />
                    Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;

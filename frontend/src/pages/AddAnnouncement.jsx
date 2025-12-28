import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const AddAnnouncement = () => {
  const { backendUrl, companyToken, userToken } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !body || !date) {
      toast.error("Title, body and date are required");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        title,
        body,
        date: new Date(date).getTime(),
        courseCode,
      };
      const token = companyToken || userToken;
      const { data } = await axios.post(`${backendUrl}/lms/announcements`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Announcement created");
        setTitle("");
        setBody("");
        setDate("");
        setCourseCode("");
      } else {
        toast.error(data.message || "Failed to create announcement");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50/30 min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Add Announcement</h1>
          <p className="text-gray-500 mt-1">Create an announcement for students</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exam Schedule Update"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Message</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter your announcement details..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Date</label>
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Course Code */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Course Code (Optional)</label>
                  <input
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CS101"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setBody("");
                    setDate("");
                    setCourseCode("");
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
                  {loading ? <LoaderCircle className="w-5 h-5 animate-spin" /> : "Post Announcement"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAnnouncement;


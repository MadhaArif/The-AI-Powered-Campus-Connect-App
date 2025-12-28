import React, { useState, useContext } from "react";
import Quill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { LoaderCircle, Calendar, MapPin, AlignLeft, CalendarDays } from "lucide-react";
import { AppContext } from "../context/AppContext";

const AddEvent = () => {
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
        `${backendUrl}/company/add-event`,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
          <p className="text-gray-600">Organize workshops, seminars, or social gatherings</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Tech Summit 2024"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-indigo-500" />
                  Event Details
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
                    <CalendarDays className="w-5 h-5" />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Event Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border border-indigo-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Venue & Location</h3>
                <p className="text-sm text-gray-600">Don't forget to include the venue details or meeting link in the description.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CalendarDays className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Date & Time</h3>
                <p className="text-sm text-gray-600">Clearly specify the start and end time to help participants plan their schedule.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;

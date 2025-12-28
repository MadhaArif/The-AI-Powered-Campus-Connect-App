import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(`${backendUrl}/events/${id}`);
      if (data.success) {
        setEvent(data.event);
      } else {
        setError(data.message || "Failed to fetch event details");
      }
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          (e?.message?.includes("Network") ? "Network error" : "Server error")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/events")}
          className="text-indigo-600 hover:underline flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
        </button>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-5">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/events")}
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="relative h-64 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <img
              src={assets.work_1} // Placeholder, ideally event should have an image
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
              <span className="bg-indigo-600/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                {event.category || "Event"}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-indigo-400" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-indigo-400" />
                  {new Date(event.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-indigo-400" />
                  {new Date(event.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  About this Event
                </h2>
                <div className="w-20 h-1 bg-indigo-500 rounded-full"></div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors font-semibold text-sm cursor-pointer">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed">
              <p>{event.description}</p>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-500 mb-1">Interested in joining?</p>
                <p className="text-lg font-bold text-gray-800">
                  Don't miss out on this opportunity!
                </p>
              </div>
              <button className="btn-primary py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 w-full md:w-auto">
                Register for Event
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { SlideUp } from "../utils/Animation";
import { Search, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching events from:", `${backendUrl}/events`);
      const { data } = await axios.get(`${backendUrl}/events`, {
        params: search ? { search } : {},
      });
      console.log("Events fetched:", data);
      if (data.success) setEvents(data.events);
      else setError(data.message || "Failed to fetch events");
    } catch (e) {
      console.error("Error fetching events:", e);
      setError(
        e?.response?.data?.message ||
          (e?.message?.includes("Network") ? "Network error" : "Server error")
      );
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <section className="max-w-7xl mx-auto px-5 py-10 min-h-screen">
        <div className="rounded-2xl overflow-hidden mb-12 shadow-xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
          <div className="relative z-10 p-10 md:p-14 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Campus Events</h1>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-8">
              Discover workshops, seminars, hackathons, and meetups happening around you.
            </p>
            
            <div className="max-w-xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white rounded-xl shadow-lg p-2">
                <Search className="text-gray-400 ml-3 w-5 h-5" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for events..."
                  className="w-full px-4 py-3 text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
                />
                <button
                  onClick={fetchEvents}
                  className="btn-primary rounded-lg py-3 px-6 shadow-none hover:shadow-lg cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 bg-red-50 inline-block px-4 py-2 rounded-lg border border-red-100">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="glass-panel rounded-2xl p-10 text-center max-w-lg mx-auto">
            <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Events Found</h3>
            <p className="text-gray-500">We couldn't find any events matching your criteria. Try adjusting your search.</p>
          </div>
        ) : (
          <motion.div
            variants={SlideUp(0.3)}
            initial="hidden"
            whileInView="visible"
            className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {events.map((e, i) => (
              <div key={e._id} className="group glass-panel rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="relative overflow-hidden h-48">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src={[assets.work_1, assets.work_2, assets.work_3][i % 3]}
                    alt={e.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    {Date.now() - Number(e.date) < 7 * 24 * 60 * 60 * 1000 && (
                      <span className="bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        UPCOMING
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                    <span className="text-white bg-indigo-600/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium">
                      {e.category || "Event"}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-indigo-50 text-indigo-700 rounded-lg px-3 py-1 text-center min-w-[60px]">
                      <span className="block text-xs font-bold uppercase tracking-wider">{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="block text-xl font-bold">{new Date(e.date).getDate()}</span>
                    </div>
                    <div className="flex-1 ml-4">
                      <h2 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {e.title}
                      </h2>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="line-clamp-1">{e.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  {e.description && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                      {e.description}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-xs font-medium">
                       <Clock className="w-3.5 h-3.5 mr-1.5" />
                       {new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <button 
                      onClick={() => navigate(`/event/${e._id}`)}
                      className="text-indigo-600 font-semibold text-sm flex items-center group/btn cursor-pointer"
                    >
                      Details 
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
};

export default Events;

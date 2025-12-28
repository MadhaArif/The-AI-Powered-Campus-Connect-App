import React, { useContext, useEffect, useState } from "react";
import FeaturedJob from "../components/FeaturedJob";
import Hero from "../components/Hero";
import JobCategory from "../components/JobCategory";
// import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";
import Counter from "../components/Counter";
import Download from "../components/Download";
// import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { Megaphone, CalendarDays, BookText, MapPin } from "lucide-react";
import { SlideUp } from "../utils/Animation";
import { motion } from "framer-motion";

import { assets } from "../assets/assets";

const Home = () => {
  const { fetchJobsData, backendUrl } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    fetchJobsData();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const { data } = await axios.get(`${backendUrl}/events`);
        if (data.success) setEvents(data.events.slice(0, 3));
      } catch (error) {
        const isNetworkError =
          error?.code === "ERR_NETWORK" ||
          /Network Error|ERR_CONNECTION_REFUSED|ECONNREFUSED/i.test(
            error?.message || ""
          );
        if (!isNetworkError) {
          // console.error("Events fetch error:", error?.message || error);
        }
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <Hero />
      
      {/* Trusted Companies Strip */}
      <div className="py-10 glass-panel border-y border-white/20 mb-12 overflow-hidden mx-5 rounded-xl">
        <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">Trusted by leading companies</p>
        <div className="flex justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 flex-wrap px-6">
          <img src={assets.microsoft_logo} alt="Microsoft" className="h-8 md:h-10 object-contain hover:scale-110 transition-transform duration-300" />
          <img src={assets.walmart_logo} alt="Walmart" className="h-8 md:h-10 object-contain hover:scale-110 transition-transform duration-300" />
          <img src={assets.accenture_logo} alt="Accenture" className="h-8 md:h-10 object-contain hover:scale-110 transition-transform duration-300" />
          <img src={assets.samsung_logo} alt="Samsung" className="h-8 md:h-10 object-contain hover:scale-110 transition-transform duration-300" />
          <img src={assets.amazon_logo} alt="Amazon" className="h-8 md:h-10 object-contain hover:scale-110 transition-transform duration-300" />
          <img src={assets.adobe_logo} alt="Adobe" className="h-8 md:h-10 object-contain hover:scale-110 transition-transform duration-300" />
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-5 mb-16">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              href: "/courses",
              icon: <BookText className="w-8 h-8" />,
              color: "text-white",
              bg: "bg-gradient-to-br from-blue-500 to-blue-600",
              title: "Courses",
              desc: "Browse subjects & assignments"
            },
            {
              href: "/announcements",
              icon: <Megaphone className="w-8 h-8" />,
              color: "text-white",
              bg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
              title: "Announcements",
              desc: "Latest campus updates"
            },
            {
              href: "/events",
              icon: <CalendarDays className="w-8 h-8" />,
              color: "text-white",
              bg: "bg-gradient-to-br from-purple-500 to-purple-600",
              title: "Events",
              desc: "Join workshops & seminars"
            }
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative overflow-hidden flex flex-col items-center text-center p-8 rounded-3xl glass-panel card-hover group border border-white/20"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-700 animate-shimmer" />
              
              <div className={`w-20 h-20 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform duration-300 ring-4 ring-white/30`}>
                {item.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 font-medium">
                {item.desc}
              </p>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          variants={SlideUp(0.4)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Upcoming <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Events</span>
            </h2>
            <a href="/events" className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:underline flex items-center gap-1 transition-all">
              View All <span className="text-lg">→</span>
            </a>
          </div>
          
          {loadingEvents ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500 py-10 glass-panel rounded-xl border border-gray-100">
              No upcoming events found
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((e) => (
                <motion.div
                  key={e._id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/event/${e._id}`)}
                  className="group flex flex-col h-full glass-panel rounded-2xl border border-white/20 card-hover overflow-hidden transition-all duration-300 cursor-pointer"
                >
                  <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500 w-full" />
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-indigo-100">
                        {new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {e.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                      {e.description || "No description available."}
                    </p>
                    
                    <div className="pt-4 border-t border-gray-100 mt-auto flex items-center text-xs text-gray-400 font-medium gap-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{e.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      <JobCategory />
      <FeaturedJob />
      <Testimonials />
      <Counter />
      <Download />
    </>
  );
};

export default Home;

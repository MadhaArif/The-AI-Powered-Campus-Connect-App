import React, { useContext, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SlideUp } from "../utils/Animation";
// Import Swiper components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Hero = () => {
  const navigate = useNavigate();

  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const { setSearchFilter, setIsSearched } = useContext(AppContext);

  // Campus-themed slider images - using Pexels images instead of Unsplash
  const sliderImages = [
    "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg",
    "https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg",
    "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg",
    "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg",
    "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg",
  ];

  const searchHandler = (e) => {
    e.preventDefault();

    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });

    setIsSearched(true);

    if (titleRef.current.value || locationRef.current.value) {
      navigate("/all-jobs/all");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-lg">
      {/* Image Slider */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index} className="overflow-hidden">
              <div 
                className="h-full w-full bg-cover bg-center animate-ken-burns"
                style={{ 
                  backgroundImage: `url(${image})`,
                  filter: 'brightness(0.35)'
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Content */}
      <div className="relative z-10 py-20 px-6 md:px-20">
        <div className="text-center max-w-2xl mx-auto">
          {/* Heading */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-lg"
            variants={SlideUp(0.4)}
            initial="hidden"
            animate="visible"
          >
            Connect. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Collaborate.</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
              Grow Together.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-gray-100 mb-12 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md opacity-90"
            variants={SlideUp(0.4)}
            initial="hidden"
            animate="visible"
          >
            The ultimate platform for university talent. Find jobs, join events, and build your future.
          </motion.p>

          {/* Search Form */}
          <motion.form
            onSubmit={searchHandler}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2 sm:p-3 flex flex-col sm:flex-row gap-2 sm:gap-3 items-center w-full max-w-4xl mx-auto shadow-2xl"
            variants={SlideUp(0.5)}
            initial="hidden"
            animate="visible"
          >
            {/* Job Title Input */}
            <div className="flex items-center px-5 py-4 bg-white/90 rounded-xl flex-grow w-full sm:w-auto hover:bg-white transition-all duration-300 group focus-within:ring-2 focus-within:ring-indigo-400 shadow-inner">
              <Search className="text-gray-400 mr-3 shrink-0 w-6 h-6 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                name="job"
                placeholder="What are you looking for?"
                aria-label="Title"
                autoComplete="on"
                className="w-full outline-none text-lg bg-transparent placeholder-gray-500 text-gray-800 font-medium"
                ref={titleRef}
              />
            </div>

            {/* Location Input */}
            <div className="flex items-center px-5 py-4 bg-white/90 rounded-xl flex-grow w-full sm:w-auto hover:bg-white transition-all duration-300 group focus-within:ring-2 focus-within:ring-indigo-400 shadow-inner">
              <MapPin className="text-gray-400 mr-3 shrink-0 w-6 h-6 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                name="location"
                placeholder="Department or Campus"
                aria-label="Location"
                autoComplete="on"
                className="w-full outline-none text-lg bg-transparent placeholder-gray-500 text-gray-800 font-medium"
                ref={locationRef}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 text-lg cursor-pointer shadow-lg hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Search
            </button>
          </motion.form>
          
          <div className="mt-8 flex justify-center gap-4 text-sm text-gray-300 font-medium">
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> 500+ Jobs Added</span>
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> 50+ Events</span>
          </div>
        </div>
    </div>
      </section>
    );
};

export default Hero;

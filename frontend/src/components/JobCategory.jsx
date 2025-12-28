import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryIcon } from "../assets/assets";
import { motion } from "framer-motion";
import { SlideLeft, slideRigth } from "../utils/Animation";

const JobCategory = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const handleClick = useCallback(
    (index, name) => {
      setActiveIndex(index);
      setTimeout(() => setActiveIndex(null), 150);
      navigate(`/all-jobs/${encodeURIComponent(name)}`);
      window.scrollTo(0, 0);
    },
    [navigate]
  );

  return (
    <section className="mt-24">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Popular Job Categories
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover top job categories tailored to your skills and career goals.
        </p>
      </div>

      {/* Grid of Categories */}
      <motion.div
        variants={SlideLeft(0.3)}
        initial="hidden"
        whileInView={"visible"}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6"
      >
        {Array.isArray(categoryIcon) &&
          categoryIcon.map((icon, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                onClick={() => handleClick(index, icon.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleClick(index, icon.name);
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                className={`relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 cursor-pointer transition-all duration-300 flex flex-col items-center text-center border border-gray-50 ${
                  isActive ? "scale-[0.98] ring-2 ring-indigo-500" : "hover:-translate-y-1"
                }`}
              >
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white duration-300 shadow-sm">
                  <img
                    className="w-7 h-7 md:w-8 md:h-8 group-hover:invert group-hover:brightness-0 transition-all"
                    src={icon.icon}
                    alt={icon.name}
                    title={icon.name}
                    loading="lazy"
                  />
                </div>
                <span className="font-semibold text-gray-700 text-sm group-hover:text-indigo-600 transition-colors">
                  {icon.name}
                </span>
              </div>
            );
          })}
      </motion.div>
    </section>
  );
};

export default JobCategory;

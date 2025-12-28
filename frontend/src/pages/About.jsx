import React from "react";
import Counter from "../components/Counter";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { SlideLeft, SlideUp } from "../utils/Animation";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      {/* Hero / Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-5 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            About Campus Connect
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Bridging the gap between talent and opportunity. We help students launch their careers and companies find their next stars.
          </motion.p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-5 py-12">
        <Counter />

        {/* Mission Statement */}
        <div className="mt-20 mb-20">
          <div className="max-w-4xl text-center mx-auto space-y-8">
            <motion.div
              variants={SlideUp(0.3)}
              initial="hidden"
              whileInView="visible"
              className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-indigo-50 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
              <p className="text-xl md:text-2xl leading-relaxed text-gray-700 font-medium">
                "Our mission is to democratize access to career opportunities for students everywhere, regardless of their background or location."
              </p>
            </motion.div>
            
            <motion.p
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView="visible"
              className="text-lg leading-relaxed text-gray-600 max-w-3xl mx-auto"
            >
              We believe that every student deserves a chance to showcase their skills. Campus Connect provides the tools, resources, and network needed to navigate the transition from campus to career with confidence.
            </motion.p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-24 mb-24">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm">Process</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              How It Works?
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Simple steps to get you hired. We've streamlined the process to make your job search efficient and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Work Step 1 */}
            <motion.div
              variants={SlideLeft(0.2)}
              initial="hidden"
              whileInView="visible"
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="flex justify-center mb-8 relative">
                <div className="absolute inset-0 bg-indigo-50 rounded-full scale-75 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                <img
                  src={assets.work_1}
                  alt="Resume Assessment"
                  className="h-20 w-20 object-contain relative z-10"
                />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-indigo-600 transition-colors">
                Free Resume Assessments
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Employers on average spend 31 seconds scanning resumes. We help yours stand out instantly.
              </p>
            </motion.div>

            {/* Work Step 2 */}
            <motion.div
              variants={SlideLeft(0.4)}
              initial="hidden"
              whileInView="visible"
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="flex justify-center mb-8 relative">
                <div className="absolute inset-0 bg-blue-50 rounded-full scale-75 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                <img
                  src={assets.work_2}
                  alt="Job Fit Scoring"
                  className="h-20 w-20 object-contain relative z-10"
                />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                Job Fit Scoring
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced AI algorithm scores your resume against job criteria to find your perfect match.
              </p>
            </motion.div>

            {/* Work Step 3 */}
            <motion.div
              variants={SlideLeft(0.6)}
              initial="hidden"
              whileInView="visible"
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
            >
               <div className="flex justify-center mb-8 relative">
                <div className="absolute inset-0 bg-indigo-50 rounded-full scale-75 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                <img
                  src={assets.work_3}
                  alt="Help Every Step"
                  className="h-20 w-20 object-contain relative z-10"
                />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-indigo-600 transition-colors">
                Help Every Step
              </h3>
              <p className="text-gray-600 leading-relaxed">
                From application to interview, receive expert guidance throughout your job search journey.
              </p>
            </motion.div>
          </div>
        </div>

        <Testimonials />
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default About;

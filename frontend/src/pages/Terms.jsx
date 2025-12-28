import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { faqs } from "../assets/assets";

import { motion } from "framer-motion";
import { SlideLeft, SlideUp } from "../utils/Animation";
import { FileText, Shield, Info } from "lucide-react";

const Terms = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-16 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-full mb-6"
            >
              <FileText className="w-6 h-6 text-indigo-100" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
            >
              Terms and Conditions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-indigo-100 text-lg max-w-2xl mx-auto"
            >
              Please read these terms carefully before using our services.
            </motion.p>
          </div>
        </div>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
          {/* Terms Content */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                variants={SlideUp(0.3)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                key={faq.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {faq.title}
                  </h2>
                  <div className="text-gray-600 space-y-4 pl-11 leading-relaxed">
                    <p>{faq.description1}</p>
                    {faq.description2 && (
                      <p>{faq.description2}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Legal Notice */}
          <motion.div
            variants={SlideUp(0.3)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Legal Notice
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  By using our services, you agree to these terms and conditions in
                  full. If you disagree with any part of these terms, please do not
                  use our services. These terms are subject to change without prior notice.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Terms;

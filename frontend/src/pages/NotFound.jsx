import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-gray-50/30">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-white/20 shadow-xl relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

        {/* 404 Text */}
        <h1 className="text-9xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center gap-2 group"
          >
            <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center justify-center gap-2 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Go Back</span>
          </button>
        </div>

      </div>
      
      {/* Footer Text */}
      <p className="mt-8 text-xs text-gray-400 font-medium uppercase tracking-widest">
        Campus Connect
      </p>
    </div>
  );
};

export default NotFound;

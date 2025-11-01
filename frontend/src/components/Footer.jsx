import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-20 py-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo and Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/">
            <img
              className="w-[120px] object-contain"
              src={assets.logo}
              alt="CampusConnect Logo"
            />
          </Link>
          <span className="hidden sm:block text-gray-500 h-6 lg:flex items-center">
            |
          </span>
          <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
            © {new Date().getFullYear()} CampusConnect | All rights reserved.
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-gray-600 text-sm sm:text-base font-medium">
          <Link
            to="/"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            About
          </Link>
          <Link
            to="/features"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            to="/contact"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Contact
          </Link>
          <Link
            to="/privacy"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

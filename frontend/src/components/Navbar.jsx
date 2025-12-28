import {
  Briefcase,
  ChevronDown,
  Search,
  LoaderCircle,
  LogOut,
  Menu,
  X,
  GraduationCap,
  BookText,
  Megaphone,
  CalendarDays,
  Info,
  FileText,
  MessageSquare,
  Video,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const exploreRef = useRef(null);
  const moreRef = useRef(null);
  const { isLogin, userData, userDataLoading, setIsLogin, setSearchFilter, setIsSearched } =
    useContext(AppContext);
  const location = useLocation();

  const navigate = useNavigate();

  const menu = [
    { name: "Home", path: "/" },
    { name: "All Jobs", path: "/all-jobs/all" },
    { name: "Courses", path: "/courses" },
    { name: "Announcements", path: "/announcements" },
    { name: "Events", path: "/events" },
    { name: "ATS & Matchmaker", path: "/ats-score" },
    { name: "Interview Room", path: "/video-interview" },
    { name: "About", path: "/about" },
    { name: "Terms", path: "/terms" },
    { name: "Chat", path: "/chat" },
  ];

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('[aria-label="Toggle menu"]')
      ) {
        setIsMobileMenuOpen(false);
      }

      if (exploreRef.current && !exploreRef.current.contains(event.target)) {
        setIsExploreOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    toast.success("Logout successfully");
    navigate("/candidate-login");
    setIsLogin(false);
  };
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-panel border-b border-gray-100 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Wrapper ensures spacing across all screen sizes */}
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-10">
        <nav className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300">
                CampusConnect
              </span>
            </div>
          </Link>

          {/* Middle Cluster: Menu + Search (desktop only) */}
          <div className="hidden lg:flex flex-1 items-center justify-start gap-6 pl-8">
            {/* Navigation Menu */}
            <div className="flex items-center gap-1 bg-white/40 p-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-sm">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-indigo-600 bg-white shadow-sm ring-1 ring-black/5"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-white/60"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/all-jobs/all"
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-indigo-600 bg-white shadow-sm ring-1 ring-black/5"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-white/60"
                  }`
                }
              >
                Jobs
              </NavLink>

              <div className="relative" ref={exploreRef}>
                <button
                  onClick={() => setIsExploreOpen((p) => !p)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isExploreOpen
                      ? "text-indigo-600 bg-white shadow-sm ring-1 ring-black/5"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-white/60"
                  }`}
                >
                  Explore
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isExploreOpen ? "rotate-180" : ""}`} />
                </button>
                {isExploreOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-indigo-100/20 z-50 overflow-hidden p-2 animate-dropdown">
                    <div className="space-y-1">
                      <Link
                        to="/resume-builder"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <FileText size={16} />
                        </div>
                        <span className="font-medium">Resume Builder</span>
                      </Link>
                      <Link
                        to="/courses"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <BookText size={16} />
                        </div>
                        <span className="font-medium">Courses</span>
                      </Link>
                      <Link
                        to="/announcements"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <Megaphone size={16} />
                        </div>
                        <span className="font-medium">Announcements</span>
                      </Link>
                      <Link
                        to="/events"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <CalendarDays size={16} />
                        </div>
                        <span className="font-medium">Events</span>
                      </Link>
                      <Link
                        to="/ats-score"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <FileText size={16} />
                        </div>
                        <span className="font-medium">ATS Analyzer</span>
                      </Link>
                      <Link
                        to="/video-interview"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <Video size={16} />
                        </div>
                        <span className="font-medium">Interview Room</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setIsMoreOpen((p) => !p)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isMoreOpen
                      ? "text-indigo-600 bg-white shadow-sm ring-1 ring-black/5"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-white/60"
                  }`}
                >
                  More
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isMoreOpen ? "rotate-180" : ""}`} />
                </button>
                {isMoreOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-indigo-100/20 z-50 overflow-hidden p-2 animate-dropdown">
                    <div className="space-y-1">
                      <Link
                        to="/about"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors group"
                      >
                        <Info size={16} className="text-gray-400 group-hover:text-indigo-500" />
                        <span className="font-medium">About Us</span>
                      </Link>
                      <Link
                        to="/terms"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors group"
                      >
                        <FileText size={16} className="text-gray-400 group-hover:text-indigo-500" />
                        <span className="font-medium">Terms & Conditions</span>
                      </Link>
                      <Link
                        to="/chat"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors group"
                      >
                        <MessageSquare size={16} className="text-gray-400 group-hover:text-indigo-500" />
                        <span className="font-medium">Chat</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const term = searchTerm.trim();
                setSearchFilter({ title: term, location: "" });
                setIsSearched(!!term);
                navigate("/all-jobs/all");
              }}
              className="hidden xl:flex items-center"
            >
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search jobs..."
                  className="w-64 pl-9 pr-3 py-2 rounded-full border border-transparent bg-gray-100/50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all shadow-sm placeholder:text-gray-400"
                />
              </div>
            </form>
          </div>

          {/* Right Cluster: Profile/Login + Mobile toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop Buttons */}
            {userDataLoading ? (
              <LoaderCircle className="animate-spin text-indigo-600 hidden lg:block" />
            ) : isLogin ? (
              <div
                className="hidden lg:flex items-center gap-3 relative"
                ref={profileMenuRef}
              >
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                  aria-expanded={isProfileMenuOpen}
                >
                  <img
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform"
                    src={userData?.image || assets.profile_img}
                    alt="User profile"
                    onError={(e) => {
                      e.currentTarget.src = assets.profile_img;
                    }}
                  />
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {userData?.name?.split(' ')[0] || "User"}
                    </p>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 group-hover:text-indigo-500 transition-all duration-300 ${isProfileMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 origin-top-right rounded-2xl border border-gray-100 bg-white shadow-xl shadow-indigo-100/20 z-50 overflow-hidden p-1.5 animate-dropdown">
                    <div className="px-3 py-2 border-b border-gray-50 mb-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{userData?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                    </div>
                    
                    <Link
                      to="/applied-applications"
                      className="flex items-center px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors gap-3"
                    >
                      <Briefcase size={16} />
                      Applied Jobs
                    </Link>

                    <button
                      className="w-full text-left flex items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors gap-3"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Link
                  to="/recruiter-login"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                >
                  Recruiter Login
                </Link>
                <Link
                  to="/candidate-login"
                  className="relative px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
                >
                  <span className="relative z-10">Candidate Login</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>
      <div className="hidden lg:block absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-100 to-transparent opacity-50" />
        {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        ref={mobileMenuRef}
      >
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/20"
          onClick={toggleMenu}
        />
        <div className="relative flex flex-col w-[85%] max-w-sm h-full bg-white shadow-2xl shadow-indigo-500/20">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <Link
              to="/"
              onClick={toggleMenu}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                CampusConnect
              </span>
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {/* Mobile Quick Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const term = searchTerm.trim();
                setSearchFilter({ title: term, location: "" });
                setIsSearched(!!term);
                navigate("/all-jobs/all");
                toggleMenu();
              }}
              className="mb-6"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for jobs..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>
            </form>
            <ul className="space-y-1">
              {menu.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                        ? "bg-indigo-50 text-indigo-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {userDataLoading ? (
              <div className="flex justify-center mt-8">
                <LoaderCircle className="animate-spin text-indigo-600" />
              </div>
            ) : isLogin ? (
              <div className="mt-8 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-xl">
                  <img
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                    src={userData?.image || assets.profile_img}
                    alt="User profile"
                    onError={(e) => {
                      e.currentTarget.src = assets.profile_img;
                    }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                  </div>
                </div>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/applied-applications"
                      onClick={toggleMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <Briefcase size={18} />
                      Applied Jobs
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="mt-8 pt-6 border-t border-gray-50 space-y-3">
                <Link
                  to="/recruiter-login"
                  onClick={toggleMenu}
                  className="block w-full bg-white text-gray-700 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 border border-gray-200 text-center transition-colors"
                >
                  Recruiter Login
                </Link>
                <Link
                  to="/candidate-login"
                  onClick={toggleMenu}
                  className="block w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all text-center"
                >
                  Candidate Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

  );
};

export default Navbar;

import { useContext, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { Bell, LoaderCircle, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Added this

  const { companyData, companyLoading, backendUrl, companyToken, userToken } = useContext(AppContext);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifcationAll, setNotifactionAll] = useState([]);
 

  const sidebarLinks = [
    {
      id: "manage-jobs",
      name: "Manage Jobs",
      path: "/dashboard/manage-jobs",
      icon: assets.home_icon,
    },
    {
      id: "add-job",
      name: "Add Job",
      path: "/dashboard/add-job",
      icon: assets.add_icon,
    },
    {
      id: "add-event",
      name: "Add Event",
      path: "/dashboard/add-event",
      icon: assets.add_icon,
    },
    {
      id: "add-announcement",
      name: "Add Announcement",
      path: "/dashboard/add-announcement",
      icon: assets.add_icon,
    },
    {
      id: "add-course",
      name: "Add Course",
      path: "/dashboard/add-course",
      icon: assets.add_icon,
    },
    {
      id: "view-applications",
      name: "Apply Applicants",
      path: "/dashboard/view-applications",
      icon: assets.person_tick_icon,
    },
    {
      id: "short-applications",
      name: "ShortListed Applications",
      path: "/dashboard/short-applications",
      icon: assets.person_tick_icon,
    },
  ];

  const fetchNotications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/notification/all`, {
        headers: {
          Authorization: `Bearer ${companyToken || userToken}`,
        },
      });

      if (data.success) {
        setNotifactionAll(data?.notifications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    fetchNotications();
  }, []);

  
  const handleClearNotifications = async (id) => {
  try {
    const { data } = await axios.put(
      `${backendUrl}/notification/read/${id}`,
      {}, // no body needed
      {
        headers: { Authorization: `Bearer ${companyToken || userToken}` },
      }
    );

    if (data.success) {
      toast.success(data.message || "All notifications marked as read.");
      setNotifactionAll([]); // clear list or refetch to refresh
      setIsNotifOpen(false); // close popover
    } else {
      toast.error(data.message || "Failed to update notifications.");
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Error updating notifications."
    );
  }
};


  const handleLogout = () => {
    localStorage.removeItem("companyToken");
    toast.success("Logout successfully");
    navigate("/recruiter-login");
  };

  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      document.title = "Campus Connect - | Dashboard";
      navigate("/dashboard/manage-jobs");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30">
      <header className="flex items-center justify-between py-3 bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6 border-b border-white/20 shadow-sm">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 group"
        >
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-indigo-200 transition-all">
             C
           </div>
           <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
             Campus Connect
           </span>
        </Link>
        {companyLoading ? (
          <LoaderCircle className="animate-spin text-indigo-500" />
        ) : companyData ? (
          <div className="flex items-center gap-5">
            {/* 🔔 Notification Button */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative p-2.5 rounded-full bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 ring-1 ring-gray-200 hover:ring-indigo-100"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {notifcationAll.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[10px] font-bold items-center justify-center">
                      {notifcationAll.filter((n) => !n.read).length}
                    </span>
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-80 glass-panel z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-800">
                      Notifications
                    </h3>
                    <button
                      onClick={() => setIsNotifOpen(false)}
                      className="p-1 rounded-full hover:bg-gray-200/50 text-gray-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <ul className="max-h-[300px] overflow-y-auto">
                    {notifcationAll.length > 0 ? (
                      notifcationAll.map((notif) => (
                        <li
                          key={notif._id}
                          className="flex items-start gap-3 p-4 text-sm hover:bg-indigo-50/50 cursor-pointer border-b border-gray-50 last:border-none transition-colors"
                        >
                          <img
                            src={
                              notif?.userId?.image || assets.profile_img
                            }
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                            onError={(e) =>
                              (e.target.src = assets.profile_img)
                            }
                          />
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-gray-800">
                              {notif?.userId?.name}
                            </span>
                            <p className="text-gray-600 text-xs leading-relaxed">
                              {notif?.message}
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
                        <Bell size={24} className="opacity-20" />
                        <span className="text-xs">No notifications yet</span>
                      </li>
                    )}
                  </ul>

                  <div className="flex items-center justify-between p-3 bg-gray-50/50 border-t border-gray-100">
                    <button
                      onClick={()=>handleClearNotifications("all")}
                      className="text-xs font-medium text-gray-500 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => navigate("/notifications")}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors px-2 py-1 rounded hover:bg-indigo-50"
                    >
                      View All
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden md:block">
                 <p className="text-sm font-bold text-gray-800 leading-none mb-1">{companyData?.name}</p>
                 <p className="text-xs text-indigo-500 font-medium leading-none">Admin</p>
              </div>
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500">
                 <img
                   className="w-9 h-9 rounded-full object-cover border-2 border-white"
                   src={companyData?.image}
                   alt={`${companyData?.name}'s profile`}
                 />
              </div>
            </div>
            
            <button
              className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-red-200"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : null}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="md:w-72 w-20 glass-panel border-r border-white/20 flex flex-col shrink-0 py-6 overflow-y-auto rounded-none">
          <nav className="space-y-1 px-3">
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.id}
                className={({ isActive }) =>
                  `flex items-center py-3.5 px-4 gap-4 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200"
                      : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
                  }`
                }
                end={item.path === "/dashboard/manage-jobs"}
              >
                <div className={`p-1 rounded-lg transition-transform group-hover:scale-110`}>
                   <item.icon className="w-5 h-5" />
                </div>
                <span className="md:block hidden font-medium text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

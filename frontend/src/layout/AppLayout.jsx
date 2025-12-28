import React from "react";
import BackendStatusBar from "../components/BackendStatusBar";

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <main className="w-[90%] m-auto overflow-hidden rounded-2xl bg-white/80 backdrop-blur border border-indigo-100 shadow-sm">
        <BackendStatusBar />
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

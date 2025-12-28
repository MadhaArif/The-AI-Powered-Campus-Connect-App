import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const BackendStatusBar = () => {
  const { backendOnline, pingBackend } = useContext(AppContext);
  if (backendOnline) return null;
  return (
    <div className="w-full bg-yellow-100 border border-yellow-200 text-yellow-800 text-sm px-4 py-2 rounded-md mb-4 flex items-center justify-between">
      <span>Backend offline — some data may be unavailable.</span>
      <button
        onClick={pingBackend}
        className="text-xs px-3 py-1 rounded-md bg-yellow-200 hover:bg-yellow-300 transition cursor-pointer"
      >
        Retry
      </button>
    </div>
  );
};

export default BackendStatusBar;

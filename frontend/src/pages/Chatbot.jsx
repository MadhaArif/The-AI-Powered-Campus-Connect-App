import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Loader, Bot, UserRound, Send, Sparkles, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const { backendUrl, userToken, companyToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I can help with jobs, applications, notifications, and campus FAQs.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const endRef = useRef(null);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/chat`,
        { message: text },
        {
          headers: {
            Authorization:
              userToken
                ? `Bearer ${userToken}`
                : companyToken
                ? `Bearer ${companyToken}`
                : undefined,
          },
        }
      );
      if (data?.success) {
        const reply = data?.answer || "I couldn't process that.";
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
        setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
        setOnline(true);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Error responding. Try again." },
        ]);
        setOnline(false);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network error. Please try later." },
      ]);
      setOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (label) => {
    const l = String(label).toLowerCase();
    if (l.includes("open all jobs")) navigate("/all-jobs/all");
    else if (l.includes("upload resume")) navigate("/applications");
    else if (l.includes("view applied")) navigate("/applied-applications");
    else if (l.includes("open dashboard")) navigate("/dashboard");
    else if (l.includes("add job")) navigate("/dashboard/add-job");
    else if (l.includes("manage jobs")) navigate("/dashboard/manage-jobs");
    else if (l.includes("view notifications")) navigate("/dashboard");
    else setInput(label);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gray-50/30">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-gray-900/5">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 p-6 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                AI Career Assistant
              </h2>
              <p className="text-indigo-100 text-sm font-medium flex items-center gap-2">
                <Sparkles size={12} className="text-yellow-300" />
                Powered by CampusConnect Intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${online ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${online ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-sm font-medium text-white">{online ? "Online" : "Offline"}</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center border border-indigo-50 shadow-sm shrink-0">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] px-5 py-3.5 text-sm leading-relaxed shadow-md ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl rounded-tr-none"
                      : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>

                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shadow-md shrink-0">
                    <UserRound className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 pl-2"
            >
               <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
               </div>
               <div className="flex gap-1.5 bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
               </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm"
          >
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Suggested Actions</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={`${s}-${i}`}
                  onClick={() => handleSuggestion(s)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
                >
                  <Sparkles size={12} className="text-indigo-500" />
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center gap-2 bg-gray-50 p-2 rounded-[2rem] border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all shadow-inner">
            <div className="pl-3 text-gray-400">
              <MessageSquare size={20} />
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask anything about jobs, campus life..."
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 text-gray-700 placeholder:text-gray-400 resize-none h-[44px] max-h-32"
              style={{ minHeight: '44px' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg hover:shadow-indigo-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200"
            >
              <Send size={18} className={loading ? "opacity-0" : "ml-0.5"} />
              {loading && <Loader size={18} className="absolute inset-0 m-auto animate-spin" />}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Chatbot;

import axios from "axios";
import { LoaderCircle, Lock, Mail, Upload, UserRound, Eye, EyeOff } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";

const CandidatesSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, setUserData, setUserToken, setIsLogin } =
    useContext(AppContext);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const userSignupHanlder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/user/register-user`,
        formData,
         {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      );

      if (data.success) {
        setUserToken(data.token);
        setUserData(data.userData);
        setIsLogin(true);
        toast.success(data.message);
        navigate("/");
        localStorage.setItem("userToken", data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <UserRound className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-lg opacity-0 animate-pulse"></div>
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Join CampusConnect
              </h1>
              <p className="text-gray-600 text-sm">
                Create your account and start your career journey
              </p>
            </div>

            {/* Signup Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 overflow-hidden">
              <div className="p-8">
                <form className="space-y-6" onSubmit={userSignupHanlder}>
                  {/* Profile Picture Upload */}
                  <div className="flex flex-col items-center">
                    <label className="relative cursor-pointer group">
                      <div className="relative">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all duration-300 ${
                          previewUrl 
                            ? "border-blue-300 shadow-lg" 
                            : "border-dashed border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-50"
                        }`}>
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-1 transition-colors" />
                              <span className="text-xs text-gray-500 group-hover:text-blue-600">Upload Photo</span>
                            </div>
                          )}
                        </div>
                        {previewUrl && (
                          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                    </label>
                  </div>

                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <UserRound className="w-4 h-4" />
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="relative w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="relative w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="relative w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400 pr-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        required
                      />
                      <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center group-hover:border-blue-500 ${
                        agreeTerms 
                          ? "bg-blue-500 border-blue-500" 
                          : "bg-white border-gray-300"
                      }`}>
                        {agreeTerms && (
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors flex-1">
                      I agree to the{" "}
                      <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    disabled={loading || !agreeTerms}
                    className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 flex justify-center items-center gap-2 ${
                      loading || !agreeTerms
                        ? "cursor-not-allowed opacity-50" 
                        : "cursor-pointer hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
                    }`}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin h-5 w-5" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <UserRound className="w-5 h-5" />
                        <span>Create My Account</span>
                      </>
                    )}
                  </button>

                  {/* Login Link */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        to="/candidate-login"
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline inline-flex items-center gap-1"
                      >
                        Sign In
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                Start connecting with top employers • Your dream career awaits
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CandidatesSignup;
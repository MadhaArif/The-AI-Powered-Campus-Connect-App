import axios from "axios";
import { Lock, Mail, Upload, UserRound, LoaderCircle, Building2 } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RecruiterSignup = () => {
  const [companyLogo, setCompanyLogo] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, setCompanyData, setCompanyToken } =
    useContext(AppContext);
  const navigate = useNavigate();

  const recruiterSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", companyLogo);

      const { data } = await axios.post(
        `${backendUrl}/company/register-company`,
        formData,
         {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ ensure correct header
        },
      }
      );

      if (data.success) {
        setCompanyToken(data.token);
        setCompanyData(data.companyData);
        localStorage.setItem("companyToken", data.token);
        toast.success(data.message);
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-indigo-500/20 rounded-2xl blur-lg opacity-0 animate-pulse"></div>
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Recruiter Sign Up
              </h1>
              <p className="text-gray-600 text-sm">
                Welcome! Create your company account
              </p>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="p-8">
                <form className="space-y-6" onSubmit={recruiterSignup}>
                  {/* Logo Upload */}
                  <div className="flex flex-col items-center mb-6">
                    <label className="relative cursor-pointer group">
                      <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-indigo-500 transition-colors duration-200">
                        {companyLogo ? (
                          <img
                            src={URL.createObjectURL(companyLogo)}
                            alt="Company logo preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setCompanyLogo(e.target.files[0])}
                        required
                      />
                      <span className="block text-xs text-center mt-3 text-gray-500 font-medium group-hover:text-indigo-600 transition-colors">
                        {companyLogo ? "Change logo" : "Upload company logo"}
                      </span>
                    </label>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <UserRound className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Company name"
                          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          placeholder="Email id"
                          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          placeholder="Create password"
                          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <label
                    htmlFor="terms-checkbox"
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 group"
                  >
                    <div className="relative flex items-center">
                      <input
                        id="terms-checkbox"
                        type="checkbox"
                        className="peer h-4 w-4 border-2 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors checked:border-indigo-600 checked:bg-indigo-600"
                        required
                      />
                    </div>
                    <span>
                      I agree to the{" "}
                      <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                        Terms and Conditions
                      </Link>
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full btn-primary flex justify-center items-center gap-2 ${
                      loading
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin h-5 w-5" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        to="/recruiter-login"
                        className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline"
                      >
                        Log In
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                Start hiring top talent for your company today
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default RecruiterSignup;
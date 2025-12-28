import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import About from "./pages/About";
import AllJobs from "./pages/AllJobs";
import Applications from "./pages/Applications";
import ApplyJob from "./pages/ApplyJob";
import CandidatesLogin from "./pages/CandidatesLogin";
import CandidatesSignup from "./pages/CandidatesSignup";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import Courses from "./pages/Courses";
import Announcements from "./pages/Announcements";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import RecruiterLogin from "./pages/RecruiterLogin";
import RecruiterSignup from "./pages/RecruiterSignup";
import Dashboard from "./pages/Dashboard";
import AddJobs from "./pages/AddJobs";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import { AppContext } from "./context/AppContext";
import ShortListed from "./pages/ShortListed";
import ProfileDetails from "./pages/ProfileDetails";
import Chatbot from "./pages/Chatbot";
import ATSScore from "./pages/ATSScore";
import ResumeBuilder from "./pages/ResumeBuilder";
import VideoInterview from "./pages/VideoInterview";
import AddEvent from "./pages/AddEvent";
import AddAnnouncement from "./pages/AddAnnouncement";
import AddCourse from "./pages/AddCourse";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import CustomCursor from "./components/CustomCursor";

const App = () => {
  const { companyToken } = useContext(AppContext);
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/dashboard");
  return (
    <>
    <ScrollToTop />
    <CustomCursor />
    {!hideLayout && <Navbar />}
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-jobs/:category" element={<AllJobs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/ats-score" element={<ATSScore />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/video-interview" element={<VideoInterview />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/events" element={<Events />} />
        
          <Route path="/applied-applications" element={<ProfileDetails />} />
        <Route path="/candidate-login" element={<CandidatesLogin />} />
        <Route path="/candidate-signup" element={<CandidatesSignup />} />
        <Route path="/recruiter-login" element={<RecruiterLogin />} />
        <Route path="/recruiter-signup" element={<RecruiterSignup />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={<AddJobs />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="add-event" element={<AddEvent />} />
          <Route path="add-announcement" element={<AddAnnouncement />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="applied-applications" element={<ProfileDetails />} />
          <Route path="view-applications" element={<ViewApplications />} />
          <Route path="short-applications" element={<ShortListed />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
     {!hideLayout && <Footer />}
     </>
  );
};

export default App;

import { generateAIResponse } from "../src/utils/aiProvider.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

export const chatRespond = async (req, res) => {
  try {
    const { message = "" } = req.body || {};
    const text = String(message).toLowerCase().trim();
    let suggestions = ["Open All Jobs", "Upload resume", "View applied applications"];

    const intents = [
      {
        test: /^(hi|hello|hey)\b|assistance|help/i,
        answer:
          "Hello! I can help with jobs, applications, resume upload, and recruiter tools.",
        suggestions: ["Open All Jobs", "Upload resume", "View applied applications"],
      },
      {
        test: /\b(yes|yeah|yup|pls|plz|plzz|please)\b/i,
        answer:
          "Great. Tell me your area (e.g., Web Dev, Data Science) or open All Jobs and search.",
        suggestions: ["Open All Jobs", "View applied applications"],
      },
      {
        test: /(apply|application|submit)\b.*(job|role)|\bapply\b/i,
        answer:
          "Steps to apply: 1) Open All Jobs, 2) Select a job, 3) Click Apply, 4) Ensure your resume is uploaded from Applications.",
        suggestions: ["Open All Jobs", "Upload resume", "View applied applications"],
      },
      {
        test: /(resume|cv)\b|upload.*(resume|cv)/i,
        answer:
          "Upload resume from Applications: open Applications and use 'Select resume' then Save. PDF only.",
        suggestions: ["Upload resume", "View applied applications"],
      },
      {
        test: /(applied|applications|status)\b/i,
        answer:
          "View applied applications in Applications. Status appears as Pending/Accepted/Rejected per job.",
        suggestions: ["View applied applications", "Open Applications"],
      },
      {
        test: /(want|need)\b.*\b(job|jobs)\b/i,
        answer:
          "Open All Jobs and search by keyword (e.g., Web Dev, React) then Apply to matching roles.",
        suggestions: ["Open All Jobs", "View applied applications"],
      },
      {
        test: /(recruiter|post|manage)\b.*(job|jobs)/i,
        answer:
          "Recruiters can add and manage jobs from Dashboard: Add Job, Manage Jobs, and view notifications.",
        suggestions: ["Open Dashboard", "Manage jobs"],
      },
      {
        test: /\brec\b/i,
        answer:
          "Recruiters use Dashboard to add jobs, manage applicants, and send notifications.",
        suggestions: ["Open Dashboard", "Manage jobs"],
      },
      {
        test: /(notification|alert)\b/i,
        answer:
          "Notifications are shown in Dashboard. You can mark them as read and clear them after reviewing.",
        suggestions: ["Open Dashboard", "View notifications"],
      },
      {
        test: /(password|reset|forgot)\b/i,
        answer:
          "Use the login page's 'Forgot Password' to reset. If unavailable, contact support via email.",
        suggestions: ["Open Home", "Contact support"],
      },
      {
        test: /(profile|update|photo|name)\b/i,
        answer:
          "Update your profile photo and details from your profile page. Ensure image is PNG/JPG/WebP.",
        suggestions: ["Open Applications", "View applied applications"],
      },
      {
        test: /(recommend|suggest|find)\b.*(job|jobs)|react|frontend|backend|developer/i,
        answer:
          "Use All Jobs search: enter keywords like 'React' and filter by location/category. Open a job to read details and Apply.",
        suggestions: ["Open All Jobs", "View applied applications"],
      },
      {
        test: /\b(web|software)\b.*\b(dev|engineer|developer)\b/i,
        answer:
          "Search All Jobs for Web Developer roles. Filter by location/category and Apply.",
        suggestions: ["Open All Jobs", "View applied applications"],
      },
    ];

    let matched = intents.find((i) => i.test.test(text));
    let answer = matched?.answer;
    suggestions = matched?.suggestions || suggestions;

    let context = "";
    try {
      const jobsCount = await Job.countDocuments({ visible: true });
      context += `Visible jobs: ${jobsCount}. `;
      if (req.accountType === "user" && req.userData?._id) {
        const appliedCount = await JobApplication.countDocuments({ userId: req.userData._id });
        context += `Your applied applications: ${appliedCount}. `;
        if (Array.isArray(req.userData.skills) && req.userData.skills.length) {
          context += `Your skills: ${req.userData.skills.slice(0, 5).join(", ")}. `;
        }
      }
      if (req.accountType === "company" && req.companyData?._id) {
        const postedCount = await Job.countDocuments({ companyId: req.companyData._id });
        context += `Your posted jobs: ${postedCount}. `;
      }
    } catch {}

    if (!answer) {
      const ai = await generateAIResponse(`${context}\n${message}`);
      answer =
        ai ||
        "I can help with jobs, applications, resume upload, recruiter dashboard, and notifications. Tell me what you want to do.";
    }
    res.json({ success: true, answer, suggestions });
  } catch {
    res.status(500).json({ success: false, message: "Chat service error." });
  }
};

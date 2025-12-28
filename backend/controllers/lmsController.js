import Course from "../models/Course.js";
import Announcement from "../models/Announcement.js";

export const getCourses = async (req, res) => {
  try {
    const { search, code } = req.query;
    const filter = {};
    if (code) filter.code = code;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { instructor: { $regex: search, $options: "i" } },
      ];
    }
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

export const createCourse = async (req, res) => {
  try {
    if (req.accountType !== "company" || !req.companyData?._id) {
      return res.status(403).json({ success: false, message: "Only company accounts can create courses" });
    }
    const { code, title, instructor, lmsLink, assignments } = req.body;
    if (!code || !title || !instructor) {
      return res
        .status(400)
        .json({ success: false, message: "Code, title and instructor are required" });
    }
    const exists = await Course.findOne({ code });
    if (exists) {
      return res.status(409).json({ success: false, message: "Course code already exists" });
    }
    const course = await Course.create({
      code,
      title,
      instructor,
      lmsLink: lmsLink || "",
      assignments: Array.isArray(assignments) ? assignments : [],
    });
    res.status(201).json({ success: true, message: "Course created", course });
  } catch {
    res.status(500).json({ success: false, message: "Failed to create course" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    if (req.accountType !== "company" || !req.companyData?._id) {
      return res.status(403).json({ success: false, message: "Only company accounts can update courses" });
    }
    const { id } = req.params;
    const update = req.body || {};
    const course = await Course.findByIdAndUpdate(id, update, { new: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, message: "Course updated", course });
  } catch {
    res.status(500).json({ success: false, message: "Failed to update course" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    if (req.accountType !== "company" || !req.companyData?._id) {
      return res.status(403).json({ success: false, message: "Only company accounts can delete courses" });
    }
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, message: "Course deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete course" });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const { courseCode } = req.query;
    const filter = {};
    if (courseCode) filter.courseCode = courseCode;
    const announcements = await Announcement.find(filter).sort({ date: -1, createdAt: -1 });
    res.json({ success: true, count: announcements.length, announcements });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch announcements" });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    if (req.accountType !== "company" || !req.companyData?._id) {
      return res.status(403).json({ success: false, message: "Only company accounts can create announcements" });
    }
    const { title, body, date, courseCode } = req.body;
    if (!title || !body || !date) {
      return res
        .status(400)
        .json({ success: false, message: "Title, body and date are required" });
    }
    const announcement = await Announcement.create({
      title,
      body,
      date,
      courseCode: courseCode || "",
    });
    res.status(201).json({ success: true, message: "Announcement created", announcement });
  } catch {
    res.status(500).json({ success: false, message: "Failed to create announcement" });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    if (req.accountType !== "company" || !req.companyData?._id) {
      return res.status(403).json({ success: false, message: "Only company accounts can delete announcements" });
    }
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement)
      return res.status(404).json({ success: false, message: "Announcement not found" });
    res.json({ success: true, message: "Announcement deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete announcement" });
  }
};

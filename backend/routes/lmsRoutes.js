import express from "express";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "../controllers/lmsController.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import userAuthMiddleware from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.get("/courses", optionalAuth, getCourses);
router.post("/courses", userAuthMiddleware, createCourse);
router.put("/courses/:id", userAuthMiddleware, updateCourse);
router.delete("/courses/:id", userAuthMiddleware, deleteCourse);

router.get("/announcements", optionalAuth, getAnnouncements);
router.post("/announcements", userAuthMiddleware, createAnnouncement);
router.delete("/announcements/:id", userAuthMiddleware, deleteAnnouncement);

export default router;


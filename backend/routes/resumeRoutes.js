import express from "express";
import { getResumeSuggestions, reviewResume } from "../controllers/resumeController.js";
import userAuth from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

// Optional: protect with userAuth if you want only logged-in users to use it
router.post("/suggest", userAuth, getResumeSuggestions);
router.post("/review", userAuth, reviewResume);

export default router;

import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/atsController.js";
import userAuth from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

// Configure Multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  }
});

router.post("/analyze", userAuth, upload.single("resume"), analyzeResume);

export default router;

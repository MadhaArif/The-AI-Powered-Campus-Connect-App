import express from "express";
import { chatRespond } from "../controllers/chatController.js";
import rateLimiter from "../middlewares/rateLimiter.js";
import optionalAuth from "../middlewares/optionalAuth.js";

const router = express.Router();

router.post("/chat", optionalAuth, rateLimiter, chatRespond);

export default router;

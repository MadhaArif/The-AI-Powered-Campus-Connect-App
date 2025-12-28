import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import userAuthMiddleware from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.get("/", optionalAuth, getEvents);
router.get("/:id", optionalAuth, getEventById);
router.post("/", userAuthMiddleware, createEvent);
router.put("/:id", userAuthMiddleware, updateEvent);
router.delete("/:id", userAuthMiddleware, deleteEvent);

export default router;


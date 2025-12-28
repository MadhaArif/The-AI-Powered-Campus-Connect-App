import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;

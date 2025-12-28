import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    instructor: { type: String, required: true, trim: true },
    lmsLink: { type: String, default: "" },
    assignments: [
      {
        title: String,
        dueDate: Number,
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;

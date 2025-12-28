import multer from "multer";

const storage = multer.diskStorage({});

const FILE_LIMITS = {
  image: 5 * 1024 * 1024,
  resume: 10 * 1024 * 1024,
};

const allowedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const allowedResumeTypes = ["application/pdf"];

const fileFilter = (req, file, cb) => {
  try {
    const field = file.fieldname;
    const type = file.mimetype;
    if (field === "image") {
      if (!allowedImageTypes.includes(type)) {
        return cb(new Error("Only image files are allowed."));
      }
    } else if (field === "resume") {
      if (!allowedResumeTypes.includes(type)) {
        return cb(new Error("Only PDF resume is allowed."));
      }
    }
    cb(null, true);
  } catch (e) {
    cb(e);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_LIMITS.resume, // upper cap; field-based handled by fileFilter + route logic
  },
});

export default upload;

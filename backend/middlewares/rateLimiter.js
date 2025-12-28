const buckets = new Map();

const windowMs = 60 * 1000;
const maxRequests = 60;

const rateLimiter = (req, res, next) => {
  try {
    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, start: now };
    if (now - bucket.start > windowMs) {
      bucket.count = 0;
      bucket.start = now;
    }
    bucket.count += 1;
    buckets.set(key, bucket);
    if (bucket.count > maxRequests) {
      return res
        .status(429)
        .json({ success: false, message: "Too many requests. Please slow down." });
    }
    next();
  } catch {
    next();
  }
};

export default rateLimiter;

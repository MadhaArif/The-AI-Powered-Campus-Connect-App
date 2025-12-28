import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Company from "../models/Company.js";

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.token;
    if (!authHeader) return next();
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let account = await User.findById(decoded.id).select("-password");
    let accountType = "user";
    if (!account) {
      account = await Company.findById(decoded.id).select("-password");
      accountType = "company";
    }
    if (account) {
      req.accountData = account;
      req.accountType = accountType;
      if (accountType === "user") {
        req.userData = account;
      } else {
        req.companyData = account;
      }
    }
    next();
  } catch {
    next();
  }
};

export default optionalAuth;

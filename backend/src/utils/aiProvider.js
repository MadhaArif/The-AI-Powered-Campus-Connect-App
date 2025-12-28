import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateAIResponse = async (message) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    const genAI = new GoogleGenerativeAI(key);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = `
You are CampusConnect's assistant for a university job portal.
Portal routes:
- All Jobs: browse/filter jobs ("/all-jobs/all")
- Applications: upload resume, view applied jobs ("/applications")
- Dashboard: recruiters manage jobs and view notifications ("/dashboard")
Guidelines:
- Answer with clear, actionable steps for this portal only.
- Prefer concise bullets; avoid external links or hallucinations.
- If asked for how-to, give steps with the above pages.
- If unclear, ask the user a focused follow-up question.
User question:
${message}
`;
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.();
    if (typeof text === "string" && text.trim()) {
      return text.trim();
    }
    return null;
  } catch {
    return null;
  }
};

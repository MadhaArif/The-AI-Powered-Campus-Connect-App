import { GoogleGenerativeAI } from "@google/generative-ai";

export const getResumeSuggestions = async (req, res) => {
  try {
    const { role } = req.body;
    console.log("🔹 AI Suggestion Request for Role:", role);

    if (!role) {
      return res.json({ success: false, message: "Job role is required." });
    }

    const mockData = {
      summary: `(Mock) A highly motivated ${role} with a proven track record of building scalable web applications. Skilled in modern technologies and passionate about solving complex problems.`,
      skills: ["React.js", "Node.js", "MongoDB", "Express", "JavaScript", "TypeScript", "Git", "REST APIs"],
      experiencePoints: [
        `Developed and maintained key features for a high-traffic ${role} platform.`,
        "Collaborated with cross-functional teams to deliver projects on time.",
        "Optimized application performance, reducing load times by 30%."
      ]
    };

    const key = process.env.GEMINI_API_KEY;
    if (!key || key.trim() === "") {
      console.warn("⚠️ GEMINI_API_KEY is missing. Returning mock data.");
      return res.json({ success: true, suggestions: mockData });
    }

    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are a professional career coach and resume writer.
        Provide resume content suggestions for the role: "${role}".
        
        Return a strict JSON object with the following structure:
        {
          "summary": "A strong, professional summary (2-3 sentences) suitable for a resume for this role.",
          "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"],
          "experiencePoints": [
            "Action-oriented bullet point example 1 (e.g., 'Optimized X by Y%')",
            "Action-oriented bullet point example 2",
            "Action-oriented bullet point example 3"
          ]
        }
        
        Do not include markdown formatting.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const suggestions = JSON.parse(cleanedText);

      return res.json({ success: true, suggestions });

    } catch (aiError) {
      console.warn("⚠️ AI Generation Failed (Quota or Error). Returning mock data.", aiError.message);
      return res.json({ 
        success: true, 
        suggestions: mockData,
        warning: "AI limit reached. Showing offline suggestions." 
      });
    }

  } catch (error) {
    console.error("Error generating suggestions:", error);
    res.status(500).json({ success: false, message: "AI generation failed" });
  }
};

export const reviewResume = async (req, res) => {
  try {
    const { resumeData } = req.body;
    console.log("🔹 AI Review Request for:", resumeData?.fullName);

    if (!resumeData) {
      return res.json({ success: false, message: "Resume data is required." });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key || key.trim() === "") {
      console.warn("⚠️ GEMINI_API_KEY is missing. Returning mock review.");
      return res.json({ 
        success: true, 
        isDemo: true, // Flag to indicate this is a demo
        review: {
          score: 75,
          feedback: [
            "This is a DEMO result because the AI API Key is missing.",
            "Please add GEMINI_API_KEY to your backend .env file to get real analysis.",
            "Ensure your resume uses active voice and measurable achievements."
          ],
          improvedSummary: `(Demo) Highly skilled professional with expertise in ${resumeData.skills?.[0] || 'your field'}. Proven ability to deliver high-quality results in fast-paced environments. (Add your API Key for real improvements)`
        }
      });
    }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert ATS Resume Auditor. Review the following resume data:
      ${JSON.stringify(resumeData)}

      1. Check for spelling/grammar errors.
      2. Analyze if the content is ATS-friendly (uses action verbs, keywords).
      3. Suggest improvements.

      Return a strict JSON object:
      {
        "score": 85,
        "feedback": ["Point 1", "Point 2"],
        "improvedSummary": "Polished summary...",
        "improvedExperience": [
           { "id": 1, "role": "...", "company": "...", "description": "Polished description..." } 
           // Map to the input experience IDs if possible, or just provide the polished text
        ]
      }
      Do not include markdown formatting.
    `;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      let review;
      try {
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        review = JSON.parse(cleanedText);
      } catch (e) {
        return res.json({ success: false, message: "Failed to parse AI review." });
      }

      res.json({ success: true, review });

    } catch (aiError) {
       console.warn("⚠️ AI Review Failed (Quota or Error). Returning mock review.", aiError.message);
       return res.json({ 
        success: true, 
        isDemo: true,
        review: {
          score: 75,
          feedback: [
            "AI Service is currently busy (Quota Exceeded). This is a placeholder review.",
            "Try again later for a real analysis.",
            "General tip: Ensure your resume uses active voice."
          ],
          improvedSummary: `(Offline Mode) Highly skilled professional with expertise in ${resumeData.skills?.[0] || 'your field'}. (AI unavailable)`
        }
      });
    }

  } catch (error) {
    console.error("Resume Review Error:", error);
    res.json({ success: false, message: error.message });
  }
};

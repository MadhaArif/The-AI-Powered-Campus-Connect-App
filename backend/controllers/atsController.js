import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const analyzeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const file = req.file;

    if (!file) {
      return res.json({ success: false, message: "Please upload a resume (PDF)" });
    }

    // 1. Extract text from PDF
    console.log("📄 Processing PDF...");
    const dataBuffer = file.buffer;
    
    if (!dataBuffer) {
        throw new Error("File buffer is empty or invalid.");
    }
    
    // Using pdf-parse v1.1.1 (Function based) via createRequire
    const pdfData = await pdf(dataBuffer);
    const resumeText = pdfData.text;

    console.log("✅ Text Extracted (Length):", resumeText?.length);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.json({ success: false, message: "Could not extract text from the PDF." });
    }

    // 2. Prepare AI Prompt
    const key = process.env.GEMINI_API_KEY;
    
    // FALLBACK: LOCAL ANALYSIS if key is missing
    if (!key || key.trim() === "") {
      console.log("⚠️ GEMINI_API_KEY missing. Performing local keyword analysis.");
      const analysis = localAnalyze(resumeText, jobDescription);
      return res.json({ success: true, analysis });
    }

    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are an expert ATS (Applicant Tracking System) analyzer. 
        Analyze the following resume text.
        ${jobDescription ? `Compare it against this Job Description: "${jobDescription}"` : "Analyze it generally for a modern professional role."}
        
        Resume Text:
        "${resumeText.substring(0, 10000)}" 
        
        Provide a strict JSON response with the following structure:
        {
          "score": number (0-100),
          "summary": "Brief professional summary of the resume content",
          "strengths": ["Point 1", "Point 2", "Point 3"],
          "weaknesses": ["Point 1", "Point 2", "Point 3"],
          "missingKeywords": ["Keyword 1", "Keyword 2", "Keyword 3"],
          "formattingIssues": ["Issue 1", "Issue 2"],
          "improvementPlan": ["Actionable step 1", "Actionable step 2", "Actionable step 3"]
        }
        
        Do not include markdown formatting (like \`\`\`json). Just return the raw JSON string.
      `;

      // 3. Generate Content
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // 4. Parse JSON
      let analysisData;
      try {
        // Clean up potential markdown code blocks if the AI adds them despite instructions
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        analysisData = JSON.parse(cleanedText);
      } catch (e) {
        console.error("AI Response Parsing Error:", e);
        return res.json({ success: false, message: "Failed to parse AI analysis result." });
      }

      res.json({ success: true, analysis: analysisData });

    } catch (aiError) {
      console.warn("⚠️ AI Generation Failed (Quota or Error). Returning local analysis.", aiError.message);
      const analysis = localAnalyze(resumeText, jobDescription);
      // Add a flag to indicate this is a fallback
      analysis.warning = "AI limit reached. Using basic keyword analysis.";
      return res.json({ success: true, analysis });
    }

  } catch (error) {
    console.error("ATS Analysis Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// --- Local Analysis Helper (Fallback) ---
const localAnalyze = (text, jobDesc) => {
  const lowerText = text.toLowerCase();
  const lowerJob = jobDesc ? jobDesc.toLowerCase() : "";
  
  // 1. Keyword Dictionary
  const techKeywords = [
    "javascript", "react", "node", "python", "java", "c++", "sql", "mongodb", 
    "aws", "docker", "git", "html", "css", "typescript", "angular", "vue", 
    "express", "flask", "django", "spring", "kubernetes", "linux", "rest api", "graphql"
  ];
  
  const softSkills = [
    "communication", "teamwork", "leadership", "problem solving", "adaptability", 
    "time management", "creativity", "collaboration", "agile", "scrum"
  ];

  const sections = ["education", "experience", "projects", "skills", "summary", "profile", "contact"];

  // 2. Find Matches
  const foundTech = techKeywords.filter(k => lowerText.includes(k));
  const foundSoft = softSkills.filter(k => lowerText.includes(k));
  const foundSections = sections.filter(k => lowerText.includes(k));

  // 3. Job Description Matching (if provided)
  let jobMatches = [];
  let missingJobKeywords = [];
  if (lowerJob) {
    // Extract potential keywords from JD (simple split by space/punctuation, filter for length > 4)
    const potentialJobKeywords = [...new Set(lowerJob.match(/\b\w{4,}\b/g) || [])];
    
    // Filter against our known lists to be safer, or just use raw overlaps
    jobMatches = potentialJobKeywords.filter(k => lowerText.includes(k));
    missingJobKeywords = potentialJobKeywords.filter(k => !lowerText.includes(k)).slice(0, 5); // Top 5 missing
  } else {
    // If no JD, suggest random missing tech keywords that aren't in resume
    missingJobKeywords = techKeywords.filter(k => !lowerText.includes(k)).sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  // 4. Calculate Score
  // Base score: 40
  // +2 per tech skill (max 30)
  // +2 per soft skill (max 10)
  // +5 per section found (max 20)
  // JD Bonus: up to 10 based on match %
  
  let score = 40;
  score += Math.min(foundTech.length * 2, 30);
  score += Math.min(foundSoft.length * 2, 10);
  score += Math.min(foundSections.length * 5, 20);

  if (lowerJob && jobMatches.length > 0) {
    // Boost if matches JD
    score += 10; 
  }
  
  score = Math.min(Math.round(score), 95); // Cap at 95

  // 5. Generate Response
  return {
    score: score,
    summary: `Local Analysis: The resume contains ${foundTech.length} technical skills and ${foundSoft.length} soft skills. It appears to include ${foundSections.length} standard sections. ${lowerJob ? "Job description provided for context." : "No specific job description provided."}`,
    strengths: [
      ...foundTech.slice(0, 3).map(k => `Proficient in ${k}`),
      ...foundSoft.slice(0, 2).map(k => `Demonstrates ${k}`),
      foundSections.length >= 4 ? "Good structure with key sections" : "Clear layout"
    ],
    weaknesses: [
      foundSections.length < 4 ? "Missing some standard sections (e.g., Projects or Summary)" : "Could expand on project details",
      foundTech.length < 3 ? "Limited technical skills listed" : "Could quantify achievements more",
      "Formatting could be more consistent"
    ],
    missingKeywords: missingJobKeywords.length > 0 ? missingJobKeywords : ["Agile", "Testing", "Documentation"],
    formattingIssues: ["Check font consistency", "Ensure margins are standard"],
    improvementPlan: [
      "Add more quantifiable metrics (numbers/percentages)",
      `Consider adding these keywords: ${missingJobKeywords.slice(0, 3).join(", ")}`,
      "Proofread for minor typos"
    ]
  };
};

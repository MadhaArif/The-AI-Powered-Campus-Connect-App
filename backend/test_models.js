import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const key = process.env.GEMINI_API_KEY;

if (!key) {
  console.error("❌ No API Key found in .env");
  process.exit(1);
}

async function listModelsRaw() {
  console.log("🔍 Listing models via REST API...");
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
        console.error("❌ API Error:", JSON.stringify(data.error, null, 2));
    } else {
        console.log("✅ Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                // Just print all models to be sure
                console.log(` - ${m.name} (Methods: ${m.supportedGenerationMethods ? m.supportedGenerationMethods.join(", ") : "None"})`);
            });
        } else {
            console.log("No models found in response.");
        }
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

listModelsRaw();

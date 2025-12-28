import { PDFParse } from "pdf-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
    console.log("----------------------------------------");
    console.log("Testing PDFParse import and usage...");
    
    try {
        console.log("Imported PDFParse:", PDFParse);
        console.log("Type of PDFParse:", typeof PDFParse);

        // Mock PDF Buffer (This won't be a valid PDF, but should trigger PDFParse to try)
        // Or better, let's see if we can instantiate it.
        
        try {
            const parser = new PDFParse({ data: Buffer.from("test") });
            console.log("✅ Successfully instantiated new PDFParse()");
        } catch (e) {
            console.log("❌ Instantiation failed:", e.message);
        }

    } catch (error) {
        console.error("❌ Critical Error:", error);
    }
    console.log("----------------------------------------");
}

test();

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import fs from "fs";
import path from "path";

async function test() {
    try {
        console.log("PDFParse:", PDFParse);
        // Create a dummy PDF buffer or read one if available. 
        // Since I don't have a PDF easily, I will just check if I can instantiate it.
        // But it needs data.
        
        // I will trust the API I read.
        // constructor(options) { ... options.data ... }
        
        console.log("PDFParse seems to be a class.");
    } catch (e) {
        console.error(e);
    }
}

test();

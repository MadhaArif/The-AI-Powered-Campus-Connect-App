import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

console.log("Type of pdf:", typeof pdf);
console.log("pdf content:", pdf);

if (typeof pdf === 'function') {
    console.log("pdf is a function");
} else if (pdf.default && typeof pdf.default === 'function') {
    console.log("pdf.default is a function");
}

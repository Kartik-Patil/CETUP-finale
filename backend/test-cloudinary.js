// Test Cloudinary Configuration
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

console.log("\n🔍 Testing Cloudinary Configuration...\n");

// Log environment variables (safely)
console.log("Environment Variables:");
console.log("  CLOUDINARY_URL:", process.env.CLOUDINARY_URL ? "✓ Set" : "✗ NOT SET");
console.log("  CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ NOT SET");
console.log("  CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ NOT SET");
console.log("  CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ NOT SET");

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    url: process.env.CLOUDINARY_URL
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

console.log("\n📋 Cloudinary Configuration:");
const config = cloudinary.config();
console.log("  Cloud Name:", config.cloud_name || "❌ MISSING");
console.log("  API Key:", config.api_key || "❌ MISSING");
console.log("  API Secret:", config.api_secret ? "✓ Set" : "❌ MISSING");

// Test API connection
console.log("\n🔗 Testing API Connection...");
cloudinary.api.ping()
  .then(result => {
    console.log("✅ SUCCESS! Cloudinary connection works!");
    console.log("Response:", result);
  })
  .catch(error => {
    console.error("❌ FAILED! Cannot connect to Cloudinary");
    console.error("Error:", error.message);
    if (error.error) {
      console.error("Details:", error.error);
    }
  });

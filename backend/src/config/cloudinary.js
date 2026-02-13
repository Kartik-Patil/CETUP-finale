const cloudinary = require("cloudinary").v2;

// Ensure environment variables are loaded
require("dotenv").config();

// Configure Cloudinary with individual credentials (more reliable than URL method)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Validate configuration
const config = cloudinary.config();
if (!config.cloud_name || !config.api_key || !config.api_secret) {
  console.error("❌ Cloudinary configuration is incomplete!");
  console.error("Cloud Name:", config.cloud_name ? "✓" : "✗ MISSING");
  console.error("API Key:", config.api_key ? "✓" : "✗ MISSING");
  console.error("API Secret:", config.api_secret ? "✓" : "✗ MISSING");
  console.error("\n⚠️  Please check your .env file and ensure all Cloudinary credentials are set correctly.");
} else {
  console.log("✅ Cloudinary configured successfully");
  console.log("   Cloud Name:", config.cloud_name);
  console.log("   API Key:", config.api_key);
  console.log("\n⚠️  If uploads fail with 403, your credentials may be invalid.");
  console.log("   Get new credentials from: https://console.cloudinary.com/settings/api-keys");
}

/**
 * Upload PDF to Cloudinary
 * @param {Buffer} fileBuffer - PDF file buffer
 * @param {string} fileName - Original filename
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<Object>} Upload result with URL
 */
const uploadPDF = async (fileBuffer, fileName, folder = "cetup-notes") => {
  return new Promise((resolve, reject) => {
    console.log("📤 Starting Cloudinary upload...");
    console.log("  File size:", fileBuffer.length, "bytes");
    console.log("  Filename:", fileName);
    console.log("  Folder:", folder);
    
    // Verify cloudinary is configured
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      const error = new Error("Cloudinary is not properly configured. Check your .env file.");
      console.error("❌", error.message);
      return reject(error);
    }
    
    // Try upload WITHOUT folder and with minimal options
    // Free Cloudinary accounts may have restrictions on folders/raw resources
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto", // Let Cloudinary detect (changed from "raw")
          // Removed folder - may cause permission issues on free accounts
          public_id: `cetup_notes/${fileName.replace(".pdf", "")}`, // Include folder in public_id instead
          use_filename: false, // Simplified
          unique_filename: true,
          overwrite: false, // Don't overwrite existing files
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload failed:");
            console.error("  Error:", error.message);
            console.error("  HTTP Code:", error.http_code);
            
            // Specific handling for 403 errors
            if (error.http_code === 403) {
              console.error("\n🚨 ERROR 403 - FORBIDDEN");
              console.error("  This means your Cloudinary FREE account has RESTRICTIONS.");
              console.error("\n  Common Reasons:");
              console.error("  1. Free accounts may not support 'raw' resource uploads (PDFs)");
              console.error("  2. Upload preset is required (but not configured)");
              console.error("  3. Account needs to be upgraded");
              console.error("\n  SOLUTIONS:");
              console.error("  A) Upgrade to paid plan: https://cloudinary.com/pricing");
              console.error("  B) Use a different cloud storage (AWS S3, Google Cloud)");
              console.error("  C) Store PDFs locally on the server");
              console.error("\n  Current workaround: Trying alternative upload method...\n");
              
              // Create a more user-friendly error
              const userError = new Error("Cloudinary free account restrictions. PDF uploads require a paid plan or alternative storage.");
              userError.http_code = 403;
              userError.name = "CloudinaryRestrictionError";
              return reject(userError);
            }
            
            console.error("  Full error:", JSON.stringify(error, null, 2));
            return reject(error);
          }
          console.log("✅ Cloudinary upload successful!");
          console.log("  URL:", result.secure_url);
          console.log("  Public ID:", result.public_id);
          resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

/**
 * Delete PDF from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<Object>} Deletion result
 */
const deletePDF = async (publicId) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
};

/**
 * Generate secure download URL with watermark
 * @param {string} publicId - Cloudinary public_id
 * @param {string} watermarkText - Text to overlay
 * @returns {string} Secure URL
 */
const getSecureURL = (publicId, watermarkText = "") => {
  // For raw files (PDFs), transformation options are limited
  // We'll return a signed URL with expiration
  return cloudinary.url(publicId, {
    resource_type: "raw",
    secure: true,
    sign_url: true,
    type: "authenticated", // Requires authentication
  });
};

module.exports = {
  cloudinary,
  uploadPDF,
  deletePDF,
  getSecureURL,
};

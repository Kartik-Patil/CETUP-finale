const fs = require("fs");
const path = require("path");
const { uploadPDF: uploadToCloudinary, deletePDF: deleteFromCloudinary } = require("../config/cloudinary");

/**
 * Local file storage fallback for when Cloudinary fails or is restricted
 */
const saveToLocalStorage = async (fileBuffer, fileName) => {
  const uploadDir = path.join(__dirname, "../../uploads/notes");
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filePath = path.join(uploadDir, fileName);
  
  // Save file
  await fs.promises.writeFile(filePath, fileBuffer);
  
  return {
    filename: fileName,
    path: filePath,
    url: `/uploads/notes/${fileName}`,
    storage_type: "local"
  };
};

const deleteFromLocalStorage = async (fileName) => {
  const filePath = path.join(__dirname, "../../uploads/notes", fileName);
  
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
};

/**
 * Try Cloudinary first, fallback to local storage if it fails with 403
 */
const uploadPDFWithFallback = async (fileBuffer, fileName) => {
  try {
    // Try Cloudinary first
    console.log("\n🔄 Attempting Cloudinary upload...");
    const cloudinaryResult = await uploadToCloudinary(fileBuffer, fileName);
    
    console.log("✅ SUCCESS: Uploaded to Cloudinary");
    console.log("   URL:", cloudinaryResult.secure_url);
    console.log("   Public ID:", cloudinaryResult.public_id);
    
    return {
      storage_type: "cloudinary",
      public_id: cloudinaryResult.public_id,
      secure_url: cloudinaryResult.secure_url,
      original_name: fileName
    };
  } catch (error) {
    // If Cloudinary fails with 403 (restrictions), use local storage
    if (error.http_code === 403 || error.name === "CloudinaryRestrictionError") {
      console.log("\n⚠️  Cloudinary restricted (403), using local storage fallback...");
      console.log("   Reason:", error.message);
      
      const localResult = await saveToLocalStorage(fileBuffer, fileName);
      
      console.log("✅ SUCCESS: Uploaded to Local Storage");
      console.log("   Path:", localResult.path);
      console.log("   URL:", localResult.url);
      
      return {
        storage_type: "local",
        filename: localResult.filename,
        url: localResult.url,
        original_name: fileName
      };
    }
    
    // For other errors, rethrow
    console.error("\n❌ Upload failed with error:", error.message);
    throw error;
  }
};

module.exports = {
  uploadPDFWithFallback,
  deleteFromLocalStorage
};

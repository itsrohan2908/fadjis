const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

(async () => {
  console.log("🚀 Initializing premium Sharp compression pipeline (Windows-Safe)...");
  
  const sourceFolder = path.join(__dirname, "public", "assets", "flower-bg-frames");
  const outputFolder = path.join(__dirname, "public", "assets", "flower-bg-frames-optimized");
  
  try {
    if (!fs.existsSync(sourceFolder)) {
      throw new Error(`Directory not found: ${sourceFolder}`);
    }

    // Create the clean output folder if it doesn't exist
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    const files = fs.readdirSync(sourceFolder).filter(file => file.endsWith(".webp"));
    console.log(`📸 Found ${files.length} WebP frames to optimize...`);

    let optimizedCount = 0;

    for (const file of files) {
      const inputPath = path.join(sourceFolder, file);
      const outputPath = path.join(outputFolder, file);

      // Compress from source folder and save cleanly into the output folder
      await sharp(inputPath)
        .webp({ 
          quality: 72,      // Sweet spot for scrolling canvas sequences
          effort: 6,        // Max CPU effort for tightest mathematical file size
          smartSubsample: true 
        })
        .toFile(outputPath);

      optimizedCount++;
      if (optimizedCount % 50 === 0 || optimizedCount === files.length) {
        console.log(`⚡ Compressed ${optimizedCount}/${files.length} frames...`);
      }
    }

    console.log("\n✨ Success! Compression pipeline finished beautifully.");
    console.log(`👉 Your optimized files are sitting in: ${outputFolder}`);
    console.log("👉 Swap the folder names or copy these files over when your dev server is stopped!");

  } catch (error) {
    console.error("❌ Compression failed:", error.message);
  }
})();
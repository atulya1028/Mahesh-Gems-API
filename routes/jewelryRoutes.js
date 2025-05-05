const express = require("express");
   const router = express.Router();
   const multer = require("multer");
   const { CloudinaryStorage } = require("multer-storage-cloudinary");
   const cloudinary = require("../config/cloudinary");
   const { createJewelry, getAllJewelry, getJewelryById } = require("../controllers/jewelryController");

   const storage = new CloudinaryStorage({
     cloudinary,
     params: async (req, file) => {
       const ext = file.mimetype.split("/")[1].toLowerCase();
       console.log("File format:", ext); // Debug: Log file format

       const allowedImageFormats = ["jpeg", "jpg", "png"];
       const allowedVideoFormats = ["mp4", "webm", "ogg"];

       if (file.fieldname === "images" && !allowedImageFormats.includes(ext)) {
         throw new Error(`Unsupported image format: ${ext}. Allowed formats: ${allowedImageFormats.join(", ")}`);
       }
       if (file.fieldname === "videos" && !allowedVideoFormats.includes(ext)) {
         throw new Error(`Unsupported video format: ${ext}. Allowed formats: ${allowedVideoFormats.join(", ")}`);
       }

       return {
         folder: "Uploads",
         format: ext,
         public_id: Date.now() + "-" + file.originalname.replace(/\s+/g, "-").split(".")[0],
         resource_type: file.fieldname === "videos" ? "video" : "image",
       };
     },
   });

   const upload = multer({
     storage,
     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
     fileFilter: (req, file, cb) => {
       const ext = file.mimetype.split("/")[1].toLowerCase();
       const allowedImageFormats = ["jpeg", "jpg", "png"];
       const allowedVideoFormats = ["mp4", "webm", "ogg"];
       
       if (
         (file.fieldname === "images" && allowedImageFormats.includes(ext)) ||
         (file.fieldname === "videos" && allowedVideoFormats.includes(ext))
       ) {
         cb(null, true);
       } else {
         cb(new Error(`Invalid file type for ${file.fieldname}`), false);
       }
     },
   });

   // Custom middleware to handle multer errors
   const handleMulterError = (err, req, res, next) => {
     if (err instanceof multer.MulterError) {
       if (err.code === "LIMIT_FILE_SIZE") {
         return res.status(400).json({ error: "File too large. Maximum size is 5MB." });
       }
       return res.status(400).json({ error: err.message });
     }
     next(err);
   };

   router.post(
     "/",
     upload.fields([{ name: "images", maxCount: 10 }, { name: "videos", maxCount: 5 }]),
     handleMulterError,
     createJewelry
   );
   router.get("/", getAllJewelry);
   router.get("/:id", getJewelryById);

   module.exports = router;
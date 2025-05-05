const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const {
  createJewelry,
  getAllJewelry,
  getJewelryById,
} = require("../controllers/jewelryController");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Uploads",
    format: async (req, file) => {
      const ext = file.mimetype.split("/")[1];
      console.log("File format:", ext); // Debug: Log file format
      return ext === "jpeg" || ext === "jpg" || ext === "png" || ext === "mp4" || ext === "webm" || ext === "ogg"
        ? ext
        : "jpg"; // Default to jpg if unsupported
    },
    public_id: (req, file) =>
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-").split(".")[0],
  },
});
const upload = multer({ storage });

router.post("/", upload.fields([{ name: "images", maxCount: 10 }, { name: "videos", maxCount: 5 }]), createJewelry);
router.get("/", getAllJewelry);
router.get("/:id", getJewelryById);

module.exports = router;
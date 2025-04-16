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
    folder: "uploads",
    format: async (req, file) => file.mimetype.split("/")[1],
    public_id: (req, file) =>
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-").split(".")[0],
  },
});
const upload = multer({ storage });

router.post("/", upload.single("image"), createJewelry);
router.get("/", getAllJewelry);
router.get("/:id", getJewelryById);

module.exports = router;

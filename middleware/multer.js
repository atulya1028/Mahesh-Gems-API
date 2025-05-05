const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Uploads",
    resource_type: "auto",
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
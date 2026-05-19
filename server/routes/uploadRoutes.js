const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");


// SINGLE IMAGE
router.post(
  "/",
  upload.single("image"),
  (req, res) => {
    res.json({
      imageUrl: req.file.path,
    });
  }
);


// MULTIPLE IMAGES
router.post(
  "/multiple",
  upload.array("images", 5),
  (req, res) => {
    const imageUrls =
      req.files.map(
        (file) => file.path
      );

    res.json({
      imageUrls,
    });
  }
);

module.exports = router;
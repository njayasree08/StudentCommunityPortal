const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const File = require("../models/File");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// UPLOAD DIRECTORY
// ==========================================
const uploadDirectory = path.join(
  __dirname,
  "../uploads"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true
  });
}

// ==========================================
// MULTER STORAGE
// ==========================================
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {

    const extension =
      path.extname(file.originalname);

    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1000000000
      )}${extension}`;

    cb(null, uniqueName);
  }
});

const upload = multer({

  storage,

  limits: {
    fileSize: 10 * 1024 * 1024
  }

});

// ==========================================
// PRIVATE FILE UPLOAD
// ==========================================
router.post(
  "/private",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          message:
            "Please select a file"
        });
      }

      const newFile =
        await File.create({

          originalName:
            req.file.originalname,

          filename:
            req.file.filename,

          path:
            req.file.path,

          mimeType:
            req.file.mimetype,

          size:
            req.file.size,

          owner:
            req.user.userId,

          visibility:
            "private"

        });

      res.status(201).json({

        message:
          "File uploaded successfully",

        file: {
          id: newFile._id,
          originalName:
            newFile.originalName
        }

      });

    } catch (error) {

      console.error(
        "Private file upload error:",
        error
      );

      res.status(500).json({
        message:
          "Server error"
      });
    }
  }
);

// ==========================================
// GET MY PRIVATE FILES
// ==========================================
router.get(
  "/private",
  authMiddleware,
  async (req, res) => {

    try {

      const files =
        await File.find({

          owner:
            req.user.userId,

          visibility:
            "private"

        })
          .select(
            "_id originalName createdAt"
          )
          .sort({
            createdAt: -1
          });

      res.json({
        files
      });

    } catch (error) {

      console.error(
        "Get private files error:",
        error
      );

      res.status(500).json({
        message:
          "Server error"
      });
    }
  }
);

// ==========================================
// COMMUNITY FILE UPLOAD
// ==========================================
router.post(
  "/community",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          message:
            "Please select a file"
        });
      }

      const newFile =
        await File.create({

          originalName:
            req.file.originalname,

          filename:
            req.file.filename,

          path:
            req.file.path,

          mimeType:
            req.file.mimetype,

          size:
            req.file.size,

          owner:
            req.user.userId,

          visibility:
            "community"

        });

      res.status(201).json({

        message:
          "Community file uploaded successfully",

        file: {
          id: newFile._id,
          originalName:
            newFile.originalName
        }

      });

    } catch (error) {

      console.error(
        "Community upload error:",
        error
      );

      res.status(500).json({
        message:
          "Server error"
      });
    }
  }
);

// ==========================================
// GET COMMUNITY FILES
// ==========================================
router.get(
  "/community",
  authMiddleware,
  async (req, res) => {

    try {

      const files =
        await File.find({
          visibility:
            "community"
        })
          .select(
            "_id originalName createdAt owner"
          )
          .populate(
            "owner",
            "name"
          )
          .sort({
            createdAt: -1
          });

      res.json({
        files
      });

    } catch (error) {

      console.error(
        "Get community files error:",
        error
      );

      res.status(500).json({
        message:
          "Server error"
      });
    }
  }
);

// ==========================================
// OPEN / READ FILE
// ==========================================
router.get(
  "/:id/open",
  authMiddleware,
  async (req, res) => {

    try {

      const file =
        await File.findById(
          req.params.id
        );

      if (!file) {
        return res.status(404).json({
          message:
            "File not found"
        });
      }

      const isOwner =
        file.owner.toString() ===
        req.user.userId;

      const isAdmin =
        req.user.role === "admin";

      const isCommunity =
        file.visibility ===
        "community";

      if (
        !isCommunity &&
        !isOwner &&
        !isAdmin
      ) {
        return res.status(403).json({
          message:
            "You do not have access to this file"
        });
      }

      if (
        !fs.existsSync(file.path)
      ) {
        return res.status(404).json({
          message:
            "Physical file not found"
        });
      }

      /*
       * Inline allows browsers to display
       * PDFs, images and text files directly.
       */
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(
          file.originalName
        )}"`
      );

      res.setHeader(
        "Content-Type",
        file.mimeType
      );

      res.sendFile(
        path.resolve(file.path)
      );

    } catch (error) {

      console.error(
        "Open file error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to open file"
      });
    }
  }
);

// ==========================================
// DELETE FILE
// ==========================================
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const file =
        await File.findById(
          req.params.id
        );

      if (!file) {
        return res.status(404).json({
          message:
            "File not found"
        });
      }

      const isOwner =
        file.owner.toString() ===
        req.user.userId;

      const isAdmin =
        req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          message:
            "You cannot delete this file"
        });
      }

      if (
        fs.existsSync(file.path)
      ) {
        fs.unlinkSync(file.path);
      }

      await File.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "File deleted successfully"
      });

    } catch (error) {

      console.error(
        "Delete file error:",
        error
      );

      res.status(500).json({
        message:
          "Server error"
      });
    }
  }
);

module.exports = router;
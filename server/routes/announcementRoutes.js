const express = require("express");

const Announcement = require("../models/Announcement");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ======================================================
// GET ALL ANNOUNCEMENTS
// GET /api/announcements
// ======================================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isActive: true
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Announcements retrieved successfully",
      count: announcements.length,
      data: announcements
    });

  } catch (error) {
    console.error("Get announcements error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ======================================================
// GET SINGLE ANNOUNCEMENT
// GET /api/announcements/:id
// ======================================================

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const announcement = await Announcement.findOne({
      _id: req.params.id,
      isActive: true
    }).populate("createdBy", "name email");

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found"
      });
    }

    res.status(200).json({
      message: "Announcement retrieved successfully",
      data: announcement
    });

  } catch (error) {
    console.error("Get announcement error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ======================================================
// CREATE ANNOUNCEMENT
// POST /api/announcements
// ADMIN ONLY
// ======================================================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { title, content } = req.body;

      // Validate fields
      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content are required"
        });
      }

      // Prevent empty values
      if (title.trim().length === 0) {
        return res.status(400).json({
          message: "Title cannot be empty"
        });
      }

      if (content.trim().length === 0) {
        return res.status(400).json({
          message: "Content cannot be empty"
        });
      }

      // Create announcement
      const announcement = new Announcement({
        title: title.trim(),
        content: content.trim(),
        createdBy: req.user.userId
      });

      await announcement.save();

      // Return populated announcement
      const populatedAnnouncement =
        await Announcement.findById(announcement._id)
          .populate("createdBy", "name email");

      res.status(201).json({
        message: "Announcement created successfully",
        data: populatedAnnouncement
      });

    } catch (error) {
      console.error("Create announcement error:", error);

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


// ======================================================
// UPDATE ANNOUNCEMENT
// PUT /api/announcements/:id
// ADMIN ONLY
// ======================================================

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { title, content, isActive } = req.body;

      const announcement = await Announcement.findById(
        req.params.id
      );

      if (!announcement) {
        return res.status(404).json({
          message: "Announcement not found"
        });
      }

      // Update only supplied fields
      if (title !== undefined) {
        if (title.trim().length === 0) {
          return res.status(400).json({
            message: "Title cannot be empty"
          });
        }

        announcement.title = title.trim();
      }

      if (content !== undefined) {
        if (content.trim().length === 0) {
          return res.status(400).json({
            message: "Content cannot be empty"
          });
        }

        announcement.content = content.trim();
      }

      if (isActive !== undefined) {
        announcement.isActive = Boolean(isActive);
      }

      await announcement.save();

      const updatedAnnouncement =
        await Announcement.findById(announcement._id)
          .populate("createdBy", "name email");

      res.status(200).json({
        message: "Announcement updated successfully",
        data: updatedAnnouncement
      });

    } catch (error) {
      console.error("Update announcement error:", error);

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


// ======================================================
// DELETE ANNOUNCEMENT
// DELETE /api/announcements/:id
// ADMIN ONLY
// ======================================================

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const announcement = await Announcement.findById(
        req.params.id
      );

      if (!announcement) {
        return res.status(404).json({
          message: "Announcement not found"
        });
      }

      await Announcement.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Announcement deleted successfully"
      });

    } catch (error) {
      console.error("Delete announcement error:", error);

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


module.exports = router;
const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET CURRENT USER
// ==========================================

router.get(
  "/me",
  authMiddleware,
  async (req, res) => {
    try {

      const user =
        await User.findById(
          req.user.userId
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      res.json({
        user
      });

    } catch (error) {

      console.error(
        "Get profile error:",
        error
      );

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


// ==========================================
// GET ALL USERS
// ==========================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {

      const users =
        await User.find()
          .select(
            "_id name email role profileImage"
          )
          .sort({
            name: 1
          });

      res.json({
        users
      });

    } catch (error) {

      console.error(
        "Get users error:",
        error
      );

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


// ==========================================
// UPDATE PROFILE
// NAME + EMAIL + PASSWORD
// ==========================================

router.put(
  "/me",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        name,
        email,
        currentPassword,
        newPassword
      } = req.body;


      // --------------------------------------
      // FIND USER
      // --------------------------------------

      const user =
        await User.findById(
          req.user.userId
        );

      if (!user) {

        return res.status(404).json({
          message: "User not found"
        });

      }


      // --------------------------------------
      // NAME
      // --------------------------------------

      if (name !== undefined) {

        if (!name.trim()) {

          return res.status(400).json({
            message:
              "Name cannot be empty"
          });

        }

        user.name =
          name.trim();

      }


      // --------------------------------------
      // EMAIL
      // --------------------------------------

      if (
        email !== undefined &&
        email.trim() !== user.email
      ) {

        const newEmail =
          email
            .trim()
            .toLowerCase();


        // Check email format
        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(newEmail)
        ) {

          return res.status(400).json({
            message:
              "Please enter a valid email address"
          });

        }


        // Check whether email already exists
        const existingUser =
          await User.findOne({
            email: newEmail,
            _id: {
              $ne: user._id
            }
          });

        if (existingUser) {

          return res.status(400).json({
            message:
              "This email is already being used"
          });

        }


        // Current password required
        if (!currentPassword) {

          return res.status(400).json({
            message:
              "Enter your current password to change your email"
          });

        }


        const passwordCorrect =
          await bcrypt.compare(
            currentPassword,
            user.password
          );

        if (!passwordCorrect) {

          return res.status(401).json({
            message:
              "Current password is incorrect"
          });

        }


        user.email =
          newEmail;

      }


      // --------------------------------------
      // PASSWORD
      // --------------------------------------

      if (
        newPassword !== undefined &&
        newPassword !== ""
      ) {

        if (!currentPassword) {

          return res.status(400).json({
            message:
              "Enter your current password to change your password"
          });

        }


        if (
          newPassword.length < 6
        ) {

          return res.status(400).json({
            message:
              "New password must be at least 6 characters"
          });

        }


        const passwordCorrect =
          await bcrypt.compare(
            currentPassword,
            user.password
          );

        if (!passwordCorrect) {

          return res.status(401).json({
            message:
              "Current password is incorrect"
          });

        }


        const hashedPassword =
          await bcrypt.hash(
            newPassword,
            10
          );

        user.password =
          hashedPassword;

      }


      // --------------------------------------
      // SAVE
      // --------------------------------------

      await user.save();


      // --------------------------------------
      // RESPONSE
      // --------------------------------------

      res.json({

        message:
          "Profile updated successfully",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage:
            user.profileImage || ""
        }

      });

    } catch (error) {

      console.error(
        "Update profile error:",
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
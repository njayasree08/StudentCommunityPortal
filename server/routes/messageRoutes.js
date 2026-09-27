const express = require("express");

const Message = require("../models/Message");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   SEND PRIVATE MESSAGE
   ========================================================= */

router.post(
  "/send",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        receiverId,
        message
      } = req.body;

      if (
        !receiverId ||
        !message?.trim()
      ) {
        return res.status(400).json({
          message:
            "Receiver and message are required"
        });
      }

      const receiver =
        await User.findById(
          receiverId
        );

      if (!receiver) {
        return res.status(404).json({
          message:
            "Receiver not found"
        });
      }

      const newMessage =
        await Message.create({
          sender:
            req.user.userId,
          receiver:
            receiverId,
          message:
            message.trim()
        });

      const populatedMessage =
        await Message.findById(
          newMessage._id
        )
          .populate(
            "sender",
            "name email role"
          )
          .populate(
            "receiver",
            "name email role"
          );

      const io =
        req.app.get("io");

      /*
        For normal private chat:
        send real-time event to receiver.

        For self-message:
        don't emit here because the
        sender will use the HTTP response.
      */

      if (
        receiverId.toString() !==
        req.user.userId.toString()
      ) {
        io.emit(
          "new-message",
          populatedMessage
        );
      }

      return res.status(201).json({
        message:
          "Message sent successfully",
        data:
          populatedMessage
      });
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error"
      });
    }
  }
);

/* =========================================================
   ADMIN BROADCAST
   ========================================================= */

router.post(
  "/broadcast",
  authMiddleware,
  async (req, res) => {
    try {
      if (
        req.user.role !==
        "admin"
      ) {
        return res.status(403).json({
          message:
            "Only administrators can send community-wide messages"
        });
      }

      const { message } =
        req.body;

      if (!message?.trim()) {
        return res.status(400).json({
          message:
            "Message cannot be empty"
        });
      }

      const users =
        await User.find({
          _id: {
            $ne:
              req.user.userId
          }
        }).select("_id");

      if (users.length === 0) {
        return res.status(400).json({
          message:
            "No other community members found"
        });
      }

      const messages =
        users.map((user) => ({
          sender:
            req.user.userId,
          receiver:
            user._id,
          message:
            message.trim()
        }));

      await Message.insertMany(
        messages
      );

      const io =
        req.app.get("io");

      /*
        Notify every connected client.
      */

      io.emit(
        "community-message",
        {
          senderId:
            req.user.userId,
          message:
            message.trim()
        }
      );

      return res.status(201).json({
        message:
          `Message sent to ${users.length} community members`
      });
    } catch (error) {
      console.error(
        "Broadcast message error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error"
      });
    }
  }
);

/* =========================================================
   GET CONVERSATION
   ========================================================= */

router.get(
  "/:userId",
  authMiddleware,
  async (req, res) => {
    try {
      const currentUserId =
        req.user.userId;

      const otherUserId =
        req.params.userId;

      const messages =
        await Message.find({
          $or: [
            {
              sender:
                currentUserId,
              receiver:
                otherUserId
            },
            {
              sender:
                otherUserId,
              receiver:
                currentUserId
            }
          ]
        })
          .populate(
            "sender",
            "name email role"
          )
          .populate(
            "receiver",
            "name email role"
          )
          .sort({
            createdAt: 1
          });

      return res.json({
        messages
      });
    } catch (error) {
      console.error(
        "Get conversation error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error"
      });
    }
  }
);

/* =========================================================
   EDIT MESSAGE
   ========================================================= */

router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { message } =
        req.body;

      if (!message?.trim()) {
        return res.status(400).json({
          message:
            "Message cannot be empty"
        });
      }

      const existingMessage =
        await Message.findById(
          req.params.id
        );

      if (!existingMessage) {
        return res.status(404).json({
          message:
            "Message not found"
        });
      }

      if (
        existingMessage.sender.toString() !==
        req.user.userId.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only edit your own messages"
        });
      }

      existingMessage.message =
        message.trim();

      await existingMessage.save();

      const updatedMessage =
        await Message.findById(
          existingMessage._id
        )
          .populate(
            "sender",
            "name email role"
          )
          .populate(
            "receiver",
            "name email role"
          );

      const io =
        req.app.get("io");

      io.emit(
        "message-updated",
        updatedMessage
      );

      return res.json({
        message:
          "Message updated successfully",
        data:
          updatedMessage
      });
    } catch (error) {
      console.error(
        "Edit message error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error"
      });
    }
  }
);

/* =========================================================
   DELETE MESSAGE
   ========================================================= */

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const existingMessage =
        await Message.findById(
          req.params.id
        );

      if (!existingMessage) {
        return res.status(404).json({
          message:
            "Message not found"
        });
      }

      const isSender =
        existingMessage.sender.toString() ===
        req.user.userId.toString();

      const isAdmin =
        req.user.role ===
        "admin";

      if (
        !isSender &&
        !isAdmin
      ) {
        return res.status(403).json({
          message:
            "You cannot delete this message"
        });
      }

      const deletedId =
        existingMessage._id.toString();

      await Message.findByIdAndDelete(
        req.params.id
      );

      const io =
        req.app.get("io");

      io.emit(
        "message-deleted",
        deletedId
      );

      return res.json({
        message:
          "Message deleted successfully"
      });
    } catch (error) {
      console.error(
        "Delete message error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error"
      });
    }
  }
);

module.exports = router;
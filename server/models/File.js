const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true
    },

    filename: {
      type: String,
      required: true
    },

    path: {
      type: String,
      required: true
    },

    mimeType: {
      type: String,
      required: true
    },

    size: {
      type: Number,
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    visibility: {
      type: String,
      enum: [
        "private",
        "community"
      ],
      default: "private"
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model("File", fileSchema);
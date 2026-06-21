import mongoose, { Schema } from "mongoose";
const emailSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    recipientEmail: {
      type: String,
      required: [true, "Recipient email is required"],
      trim: true,
      lowercase: true
    },
    recipientName: {
      type: String,
      trim: true
    },
    companyName: {
      type: String,
      trim: true
    },
    jobPosition: {
      type: String,
      trim: true
    },
    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      trim: true
    },
    userBackground: {
      type: String,
      trim: true
    },
    additionalNotes: {
      type: String,
      trim: true
    },
    tone: {
      type: String,
      enum: ["professional", "friendly", "startup", "formal"],
      default: "professional"
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true
    },
    content: {
      type: String,
      required: [true, "Content is required"]
    },
    htmlContent: {
      type: String
    },
    status: {
      type: String,
      enum: ["draft", "sent", "failed"],
      default: "draft",
      index: true
    },
    qualityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    suggestions: [String],
    sentAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);
emailSchema.index({ userId: 1, createdAt: -1 });
emailSchema.index({ userId: 1, status: 1 });
export const Email = mongoose.model("Email", emailSchema);

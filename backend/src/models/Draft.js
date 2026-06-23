import mongoose, { Schema } from "mongoose";

const chatMessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const draftSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    htmlContent: {
      type: String,
      default: "",
    },
    tone: {
      type: String,
      enum: [
        "professional",
        "friendly",
        "formal",
        "confident",
        "enthusiastic",
        "corporate",
        "startup",
        "minimal",
        "recruiter-friendly",
      ],
      default: "professional",
    },
    chatHistory: [chatMessageSchema],
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    qualityScores: {
      professionalismScore: { type: Number, default: 0 },
      personalizationScore: { type: Number, default: 0 },
      grammarScore: { type: Number, default: 0 },
      readabilityScore: { type: Number, default: 0 },
      recruiterAppealScore: { type: Number, default: 0 },
      ctaScore: { type: Number, default: 0 },
      overallScore: { type: Number, default: 0 },
    },
    lastEditedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

draftSchema.index({ userId: 1, createdAt: -1 });
draftSchema.index({ userId: 1, lastEditedAt: -1 });

export const Draft = mongoose.model("Draft", draftSchema);

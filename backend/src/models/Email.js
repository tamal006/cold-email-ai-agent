import mongoose, { Schema } from "mongoose";

const emailVersionSchema = new Schema(
  {
    subject: { type: String },
    content: { type: String },
    tone: { type: String },
    editedAt: { type: Date, default: Date.now },
    editInstruction: { type: String },
  },
  { _id: false }
);

const emailSchema = new Schema(
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
      index: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
    },
    // Job context snapshot
    jobTitle: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    jobUrl: {
      type: String,
      trim: true,
    },
    // Resume snapshot
    resumeProfileSnapshot: {
      type: Schema.Types.Mixed,
      default: {},
    },
    // Match analysis snapshot
    matchAnalysis: {
      matchScore: { type: Number, default: 0 },
      matchingSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
    },
    // User inputs
    userSummary: {
      type: String,
      trim: true,
    },
    userInstructions: {
      type: String,
      trim: true,
    },
    // Email content
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
    // Subject alternatives
    subjectOptions: [{ type: String }],
    // Quality scores
    qualityScores: {
      professionalismScore: { type: Number, default: 0 },
      personalizationScore: { type: Number, default: 0 },
      grammarScore: { type: Number, default: 0 },
      readabilityScore: { type: Number, default: 0 },
      recruiterAppealScore: { type: Number, default: 0 },
      ctaScore: { type: Number, default: 0 },
      overallScore: { type: Number, default: 0 },
      suggestions: [{ type: String }],
    },
    // Version history
    versions: [emailVersionSchema],
    // Status
    status: {
      type: String,
      enum: ["draft", "final", "sent", "failed"],
      default: "draft",
      index: true,
    },
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

emailSchema.index({ userId: 1, createdAt: -1 });
emailSchema.index({ userId: 1, status: 1 });
emailSchema.index({ userId: 1, jobId: 1 });

export const Email = mongoose.model("Email", emailSchema);

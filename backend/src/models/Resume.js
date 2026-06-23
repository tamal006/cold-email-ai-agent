import mongoose, { Schema } from "mongoose";

const parsedProfileSchema = new Schema(
  {
    name: { type: String, default: "Unknown" },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        year: { type: String },
        gpa: { type: String, default: null },
      },
    ],
    skills: [{ type: String, trim: true }],
    projects: [
      {
        name: { type: String },
        description: { type: String },
        techStack: [{ type: String }],
        url: { type: String, default: null },
      },
    ],
    experience: [
      {
        role: { type: String },
        company: { type: String },
        duration: { type: String },
        description: { type: String },
      },
    ],
    certifications: [{ type: String }],
    achievements: [{ type: String }],
    hackathons: [{ type: String }],
    github: { type: String, default: null },
    linkedin: { type: String, default: null },
    portfolio: { type: String, default: null },
    summary: { type: String, default: "" },
  },
  { _id: false }
);

const resumeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    fileType: {
      type: String,
      enum: ["pdf", "docx", "txt"],
      required: [true, "File type is required"],
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    rawText: {
      type: String,
      required: true,
    },
    parsedProfile: {
      type: parsedProfileSchema,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ userId: 1, isDefault: 1 });

export const Resume = mongoose.model("Resume", resumeSchema);

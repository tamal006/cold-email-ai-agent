import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sourceUrl: {
      type: String,
      required: [true, "Source URL is required"],
      trim: true,
    },
    platform: {
      type: String,
      enum: ["linkedin", "naukri", "internshala", "careers", "other"],
      default: "other",
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      default: "Not specified",
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["remote", "hybrid", "onsite", "unknown"],
      default: "unknown",
    },
    skills: [{ type: String, trim: true }],
    responsibilities: [{ type: String, trim: true }],
    experienceRequired: {
      type: String,
      default: "Not specified",
      trim: true,
    },
    keywords: [{ type: String, trim: true }],
    description: {
      type: String,
      default: "",
    },
    qualifications: [{ type: String, trim: true }],
    preferredQualifications: [{ type: String, trim: true }],
    benefits: [{ type: String, trim: true }],
    applicationDeadline: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["analyzed", "email_generated", "archived"],
      default: "analyzed",
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ userId: 1, createdAt: -1 });
jobSchema.index({ userId: 1, company: 1 });
jobSchema.index({ userId: 1, status: 1 });

export const Job = mongoose.model("Job", jobSchema);

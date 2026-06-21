import mongoose, { Schema } from "mongoose";
const contactSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company"
    },
    fullName: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true
    },
    role: {
      type: String,
      required: [true, "Contact role is required"],
      trim: true
    },
    department: {
      type: String,
      trim: true
    },
    profileUrl: {
      type: String,
      trim: true
    },
    sourceUrl: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    emailStatus: {
      type: String,
      enum: ["available", "not_publicly_available"],
      default: "not_publicly_available"
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    relevanceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    isSuggested: {
      type: Boolean,
      default: false
    },
    saved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);
contactSchema.index({ userId: 1, jobId: 1 });
contactSchema.index({ userId: 1, saved: 1 });
export const Contact = mongoose.model("Contact", contactSchema);

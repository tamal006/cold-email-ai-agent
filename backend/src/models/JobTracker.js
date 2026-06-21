import mongoose, { Schema } from "mongoose";
const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["saved", "outreach_sent", "applied", "interview_scheduled", "rejected", "offer_received"],
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);
const jobTrackerSchema = new Schema(
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
      required: true
    },
    contactId: {
      type: Schema.Types.ObjectId,
      ref: "Contact"
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    sourceUrl: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["saved", "outreach_sent", "applied", "interview_scheduled", "rejected", "offer_received"],
      default: "saved",
      index: true
    },
    appliedDate: {
      type: Date
    },
    notes: {
      type: String,
      default: "",
      trim: true
    },
    outreachEmailIds: [{
      type: Schema.Types.ObjectId,
      ref: "Email"
    }],
    statusHistory: [statusHistorySchema]
  },
  {
    timestamps: true
  }
);
jobTrackerSchema.index({ userId: 1, status: 1 });
jobTrackerSchema.index({ userId: 1, createdAt: -1 });
export const JobTracker = mongoose.model("JobTracker", jobTrackerSchema);

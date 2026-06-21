import mongoose, { Schema } from "mongoose";
const companySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    industry: {
      type: String,
      trim: true
    },
    products: [{ type: String, trim: true }],
    services: [{ type: String, trim: true }],
    companySize: {
      type: String,
      trim: true
    },
    recentNews: [{ type: String, trim: true }],
    techStack: [{ type: String, trim: true }],
    hiringActivity: {
      type: String,
      trim: true
    },
    culture: {
      type: String,
      trim: true
    },
    mission: {
      type: String,
      trim: true
    },
    insightSummary: {
      type: String,
      default: ""
    },
    researchedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);
companySchema.index({ userId: 1, name: 1 });
export const Company = mongoose.model("Company", companySchema);

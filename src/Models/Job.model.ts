import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    code: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    customer: { type: String, required: true, trim: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    status: { type: String, default: "Draft", trim: true },
    scheduled_date: { type: String, default: null },
    notes: { type: String, default: null },
    total: { type: Number, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Job = mongoose.model("Job", JobSchema);

import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    code: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    tags: { type: [String], default: [] },
    labour: { type: String },
    utility: { type: String },
    total_cost: { type: Number },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
export const Service = mongoose.model("Service", ServiceSchema);

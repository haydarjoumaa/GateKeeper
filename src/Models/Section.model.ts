import mongoose from "mongoose";
const SectionSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
export const Section = mongoose.model("Section", SectionSchema);

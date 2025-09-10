import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema(
  {
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
export const Category = mongoose.model("Category", CategorySchema);

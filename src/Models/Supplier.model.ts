import mongoose from "mongoose";
const SupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    description: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
export const Supplier = mongoose.model("Supplier", SupplierSchema);

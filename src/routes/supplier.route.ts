import { Router } from "express";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../Controllers/supplier.controller";

const supplierRouter = Router();

supplierRouter.get("/", getSuppliers);
supplierRouter.get("/:id", getSupplierById);
supplierRouter.post("/", createSupplier);
supplierRouter.put("/:id", updateSupplier);
supplierRouter.delete("/:id", deleteSupplier);

export default supplierRouter;


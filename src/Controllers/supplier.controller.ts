import { Request, Response, NextFunction } from "express";
import { Supplier } from "../Models/Supplier.model";

export const getSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const docs = await Supplier.find({}).sort({ _id: -1 });
    return res.json(
      docs.map((d: any) => ({
        id: d._id.toString(),
        name: d.name,
        email: d.email || null,
        phone: d.phone || null,
        description: d.description || null,
        created_at: d.created_at,
        updated_at: d.updated_at || null,
      }))
    );
  } catch (e) {
    next(e);
  }
};

export const getSupplierById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const d: any = await Supplier.findById(req.params.id);
    if (!d) return res.status(404).json({ message: "Supplier not found" });
    return res.json({
      id: d._id.toString(),
      name: d.name,
      email: d.email || null,
      phone: d.phone || null,
      description: d.description || null,
      created_at: d.created_at,
      updated_at: d.updated_at || null,
    });
  } catch (e) {
    next(e);
  }
};

export const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone, description } = req.body || {};
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }
    const d: any = await Supplier.create({ name, email, phone, description });
    return res.status(201).json({
      id: d._id.toString(),
      name: d.name,
      email: d.email || null,
      phone: d.phone || null,
      description: d.description || null,
      created_at: d.created_at,
    });
  } catch (e) {
    next(e);
  }
};

export const updateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone, description } = req.body || {};
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }
    const d: any = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, description },
      { new: true }
    );
    if (!d) return res.status(404).json({ message: "Supplier not found" });
    return res.json({
      id: d._id.toString(),
      name: d.name,
      email: d.email || null,
      phone: d.phone || null,
      description: d.description || null,
      created_at: d.created_at,
      updated_at: d.updated_at || null,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = await Supplier.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ message: "Supplier not found" });
    return res.status(204).send();
  } catch (e) {
    next(e);
  }
};


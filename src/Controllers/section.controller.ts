import { Request, Response, NextFunction } from "express";
import { Section } from "../Models/Section.model";
import { Supplier } from "../Models/Supplier.model";

export const getSections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const docs = await Section.find({})
      .populate("supplier", "name")
      .sort({ _id: -1 });

    return res.json(
      docs.map((d: any) => ({
        id: d._id.toString(),
        name: d.name,
        description: d.description || null,
        created_at: d.created_at,
        updated_at: d.updated_at || null,
        supplier_id: d.supplier?._id?.toString() || null,
        supplier_name: d.supplier?.name || null,
      }))
    );
  } catch (e) {
    next(e);
  }
};

export const getSectionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const d: any = await Section.findById(req.params.id).populate(
      "supplier",
      "name"
    );
    if (!d) return res.status(404).json({ message: "Section not found" });
    return res.json({
      id: d._id.toString(),
      name: d.name,
      description: d.description || null,
      supplier_id: d.supplier?._id?.toString() || null,
      created_at: d.created_at,
      updated_at: d.updated_at || null,
    });
  } catch (e) {
    next(e);
  }
};

export const createSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, supplierId } = req.body || {};

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }
    if (!supplierId || typeof supplierId !== "string") {
      return res.status(400).json({ message: "supplierId is required" });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(400).json({ message: "Invalid supplierId" });

    const d: any = await Section.create({
      name,
      description,
      supplier: supplier._id,
    });

    return res.status(201).json({
      id: d._id.toString(),
      name: d.name,
      description: d.description || null,
      supplier_id: d.supplier.toString(),
      created_at: d.created_at,
    });
  } catch (e) {
    next(e);
  }
};

export const updateSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, supplierId } = req.body || {};

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }
    if (!supplierId || typeof supplierId !== "string") {
      return res.status(400).json({ message: "supplierId is required" });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(400).json({ message: "Invalid supplierId" });

    const d: any = await Section.findByIdAndUpdate(
      req.params.id,
      { name, description, supplier: supplier._id },
      { new: true }
    );
    if (!d) return res.status(404).json({ message: "Section not found" });

    return res.json({
      id: d._id.toString(),
      name: d.name,
      description: d.description || null,
      supplier_id: d.supplier.toString(),
      created_at: d.created_at,
      updated_at: d.updated_at || null,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = await Section.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ message: "Section not found" });
    return res.status(204).send();
  } catch (e) {
    next(e);
  }
};


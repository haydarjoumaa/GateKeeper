import { Request, Response, NextFunction } from "express";
import { Category } from "../Models/Category.model";
import { Section } from "../Models/Section.model";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const docs = await Category.find({})
      .populate({
        path: "section",
        select: "name supplier",
        populate: { path: "supplier", select: "_id" },
      })
      .sort({ _id: -1 });

    return res.json(
      docs.map((d) => ({
        id: d._id.toString(),
        name: d.name,
        description: (d as any).description || null,
        section_id: (d as any).section?._id?.toString() || null,
        section_name: (d as any).section?.name || null,
        supplier_id: (d as any).section?.supplier?._id?.toString() || null,
        created_at: (d as any).created_at,
        updated_at: (d as any).updated_at || null,
      }))
    );
  } catch (e) {
    next(e);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const d = await Category.findById(req.params.id).populate({
      path: "section",
      select: "name supplier",
      populate: { path: "supplier", select: "_id" },
    });
    if (!d) return res.status(404).json({ message: "Category not found" });
    return res.json({
      id: d._id.toString(),
      name: d.name,
      description: (d as any).description || null,
      section_id: (d as any).section?._id?.toString() || null,
      created_at: (d as any).created_at,
      updated_at: (d as any).updated_at || null,
    });
  } catch (e) {
    next(e);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, sectionId } = req.body || {};

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }
    if (sectionId && typeof sectionId !== "string") {
      return res.status(400).json({ message: "sectionId must be a string" });
    }

    if (!sectionId) {
      return res.status(400).json({ message: "sectionId is required" });
    }

    const section = await Section.findById(sectionId);
    if (!section) return res.status(400).json({ message: "Invalid sectionId" });

    const d = await Category.create({
      name,
      description,
      section: section._id,
    });
    return res.status(201).json({
      id: d._id.toString(),
      name: d.name,
      description: (d as any).description || null,
      section_id: (d as any).section.toString(),
      created_at: (d as any).created_at,
    });
  } catch (e) {
    next(e);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, sectionId } = req.body || {};

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }
    if (!sectionId || typeof sectionId !== "string") {
      return res.status(400).json({ message: "sectionId is required" });
    }

    const section = await Section.findById(sectionId);
    if (!section) return res.status(400).json({ message: "Invalid sectionId" });

    const d = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, section: section._id },
      { new: true }
    );

    if (!d) return res.status(404).json({ message: "Category not found" });

    return res.json({
      id: d._id.toString(),
      name: d.name,
      description: (d as any).description || null,
      section_id: (d as any).section.toString(),
      created_at: (d as any).created_at,
      updated_at: (d as any).updated_at || null,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = await Category.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ message: "Category not found" });
    return res.status(204).send();
  } catch (e) {
    next(e);
  }
};


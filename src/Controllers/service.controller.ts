import { Request, Response, NextFunction } from "express";
import { Service } from "../Models/Service.model";
import { Category } from "../Models/Category.model";

export const getServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const docs = await Service.find({})
      .populate({ path: "category", select: "name" })
      .sort({ _id: -1 });

    return res.json(
      docs.map((d: any) => ({
        id: d._id.toString(),
        code: d.code,
        title: d.title,
        description: d.description || null,
        tags: d.tags || [],
        labour: d.labour || null,
        utility: d.utility || null,
        total_cost: d.total_cost ?? null,
        category_id: d.category?._id?.toString() || null,
        category_name: d.category?.name || null,
        created_at: d.created_at,
        updated_at: d.updated_at || null,
      }))
    );
  } catch (e) {
    next(e);
  }
};

export const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const d: any = await Service.findById(req.params.id).populate({
      path: "category",
      select: "name",
    });
    if (!d) return res.status(404).json({ message: "Service not found" });
    return res.json({
      id: d._id.toString(),
      code: d.code,
      title: d.title,
      description: d.description || null,
      tags: d.tags || [],
      labour: d.labour || null,
      utility: d.utility || null,
      total_cost: d.total_cost ?? null,
      category_id: d.category?._id?.toString() || null,
      created_at: d.created_at,
      updated_at: d.updated_at || null,
    });
  } catch (e) {
    next(e);
  }
};

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      categoryId,
      code,
      title,
      description,
      tags,
      labour,
      utility,
      totalCost,
    } = req.body || {};

    if (!categoryId || typeof categoryId !== "string")
      return res.status(400).json({ message: "categoryId is required" });
    if (!code || typeof code !== "string")
      return res.status(400).json({ message: "code is required" });
    if (!title || typeof title !== "string")
      return res.status(400).json({ message: "title is required" });

    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(400).json({ message: "Invalid categoryId" });

    const d: any = await Service.create({
      category: category._id,
      code,
      title,
      description,
      tags: Array.isArray(tags) ? tags : [],
      labour,
      utility,
      total_cost: typeof totalCost === "number" ? totalCost : undefined,
    });

    return res.status(201).json({
      id: d._id.toString(),
      code: d.code,
      title: d.title,
      description: d.description || null,
      tags: d.tags || [],
      labour: d.labour || null,
      utility: d.utility || null,
      total_cost: d.total_cost ?? null,
      category_id: d.category.toString(),
      created_at: d.created_at,
    });
  } catch (e) {
    next(e);
  }
};

export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      categoryId,
      code,
      title,
      description,
      tags,
      labour,
      utility,
      totalCost,
    } = req.body || {};

    if (!categoryId || typeof categoryId !== "string")
      return res.status(400).json({ message: "categoryId is required" });
    if (!code || typeof code !== "string")
      return res.status(400).json({ message: "code is required" });
    if (!title || typeof title !== "string")
      return res.status(400).json({ message: "title is required" });

    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(400).json({ message: "Invalid categoryId" });

    const d: any = await Service.findByIdAndUpdate(
      req.params.id,
      {
        category: category._id,
        code,
        title,
        description,
        tags: Array.isArray(tags) ? tags : [],
        labour,
        utility,
        total_cost: typeof totalCost === "number" ? totalCost : undefined,
      },
      { new: true }
    );
    if (!d) return res.status(404).json({ message: "Service not found" });

    return res.json({
      id: d._id.toString(),
      code: d.code,
      title: d.title,
      description: d.description || null,
      tags: d.tags || [],
      labour: d.labour || null,
      utility: d.utility || null,
      total_cost: d.total_cost ?? null,
      category_id: d.category.toString(),
      created_at: d.created_at,
      updated_at: d.updated_at || null,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const r = await Service.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ message: "Service not found" });
    return res.status(204).send();
  } catch (e) {
    next(e);
  }
};


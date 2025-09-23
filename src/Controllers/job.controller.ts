import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { Job } from "../Models/Job.model";
import { Service } from "../Models/Service.model";

const mapJob = (doc: any) => {
  const service = doc.service;
  let serviceId: string | null = null;
  let serviceName: string | null = null;

  if (service) {
    if (typeof service === "object" && service !== null) {
      if (service._id) serviceId = service._id.toString();
      else if (typeof service.toString === "function") serviceId = service.toString();
      serviceName = service.title ?? service.name ?? null;
    } else if (typeof service === "string") {
      serviceId = service;
    }
  }

  return {
    id: doc._id.toString(),
    code: doc.code || null,
    title: doc.title,
    customer: doc.customer,
    serviceId,
    service: serviceName,
    status: doc.status || "Draft",
    scheduledDate: doc.scheduled_date || null,
    notes: doc.notes || null,
    total: typeof doc.total === "number" ? doc.total : null,
    created_at: doc.created_at || null,
    updated_at: doc.updated_at || null,
  };
};

export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const docs = await Job.find({})
      .populate({ path: "service", select: "title code" })
      .sort({ _id: -1 });

    return res.json(docs.map(mapJob));
  } catch (e) {
    next(e);
  }
};

export const getJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doc: any = await Job.findById(req.params.id).populate({
      path: "service",
      select: "title code",
    });
    if (!doc) return res.status(404).json({ message: "Job not found" });
    return res.json(mapJob(doc));
  } catch (e) {
    next(e);
  }
};

export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      code,
      title,
      customer,
      serviceId,
      status,
      scheduledDate,
      notes,
      total,
    } = req.body || {};

    if (!title || typeof title !== "string")
      return res.status(400).json({ message: "title is required" });
    if (!customer || typeof customer !== "string")
      return res.status(400).json({ message: "customer is required" });
    if (code != null && typeof code !== "string")
      return res.status(400).json({ message: "code must be a string" });
    if (status != null && typeof status !== "string")
      return res.status(400).json({ message: "status must be a string" });
    if (scheduledDate != null && typeof scheduledDate !== "string")
      return res.status(400).json({ message: "scheduledDate must be a string" });
    if (notes != null && typeof notes !== "string")
      return res.status(400).json({ message: "notes must be a string" });
    if (total != null && typeof total !== "number")
      return res.status(400).json({ message: "total must be a number" });

    let serviceRef: any = undefined;
    if (serviceId != null && serviceId !== "") {
      if (typeof serviceId !== "string")
        return res.status(400).json({ message: "serviceId must be a string" });
      if (!isValidObjectId(serviceId))
        return res.status(400).json({ message: "Invalid serviceId" });
      const service = await Service.findById(serviceId);
      if (!service)
        return res.status(400).json({ message: "Invalid serviceId" });
      serviceRef = service._id;
    }

    const created = await Job.create({
      code: code ?? undefined,
      title,
      customer,
      service: serviceRef ?? null,
      status: status || "Draft",
      scheduled_date: scheduledDate ?? null,
      notes: notes ?? null,
      total: typeof total === "number" ? total : null,
    });

    const populated = await created.populate({
      path: "service",
      select: "title code",
    });

    return res.status(201).json(mapJob(populated));
  } catch (e) {
    next(e);
  }
};

export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      code,
      title,
      customer,
      serviceId,
      status,
      scheduledDate,
      notes,
      total,
    } = req.body || {};

    const updateDoc: any = {};

    if (code !== undefined) {
      if (code != null && typeof code !== "string")
        return res.status(400).json({ message: "code must be a string" });
      updateDoc.code = code ?? null;
    }

    if (title !== undefined) {
      if (!title || typeof title !== "string")
        return res.status(400).json({ message: "title must be a non-empty string" });
      updateDoc.title = title;
    }

    if (customer !== undefined) {
      if (!customer || typeof customer !== "string")
        return res
          .status(400)
          .json({ message: "customer must be a non-empty string" });
      updateDoc.customer = customer;
    }

    if (status !== undefined) {
      if (status != null && typeof status !== "string")
        return res.status(400).json({ message: "status must be a string" });
      updateDoc.status = status ?? "Draft";
    }

    if (scheduledDate !== undefined) {
      if (scheduledDate != null && typeof scheduledDate !== "string")
        return res
          .status(400)
          .json({ message: "scheduledDate must be a string" });
      updateDoc.scheduled_date = scheduledDate ?? null;
    }

    if (notes !== undefined) {
      if (notes != null && typeof notes !== "string")
        return res.status(400).json({ message: "notes must be a string" });
      updateDoc.notes = notes ?? null;
    }

    if (total !== undefined) {
      if (total != null && typeof total !== "number")
        return res.status(400).json({ message: "total must be a number" });
      updateDoc.total = total ?? null;
    }

    if (serviceId !== undefined) {
      if (serviceId === null || serviceId === "") {
        updateDoc.service = null;
      } else {
        if (typeof serviceId !== "string")
          return res.status(400).json({ message: "serviceId must be a string" });
        if (!isValidObjectId(serviceId))
          return res.status(400).json({ message: "Invalid serviceId" });
        const service = await Service.findById(serviceId);
        if (!service)
          return res.status(400).json({ message: "Invalid serviceId" });
        updateDoc.service = service._id;
      }
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, updateDoc, {
      new: true,
      runValidators: true,
    }).populate({ path: "service", select: "title code" });

    if (!updated) return res.status(404).json({ message: "Job not found" });

    return res.json(mapJob(updated));
  } catch (e) {
    next(e);
  }
};

export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const removed = await Job.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Job not found" });
    return res.status(204).send();
  } catch (e) {
    next(e);
  }
};


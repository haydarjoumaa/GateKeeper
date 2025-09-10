import { Router } from "express";
import {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
} from "../Controllers/section.controller";

const sectionRouter = Router();

sectionRouter.get("/", getSections);
sectionRouter.get("/:id", getSectionById);
sectionRouter.post("/", createSection);
sectionRouter.put("/:id", updateSection);
sectionRouter.delete("/:id", deleteSection);

export default sectionRouter;


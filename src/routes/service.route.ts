import { Router } from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../Controllers/service.controller";

const serviceRouter = Router();

serviceRouter.get("/", getServices);
serviceRouter.get("/:id", getServiceById);
serviceRouter.post("/", createService);
serviceRouter.put("/:id", updateService);
serviceRouter.delete("/:id", deleteService);

export default serviceRouter;


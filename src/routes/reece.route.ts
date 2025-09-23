import { Router } from "express";
import { getReeceBranches, searchReeceProducts } from "../Controllers/reece.controller";

const router = Router();

router.get("/products/search", searchReeceProducts);
router.get("/branches", getReeceBranches);

export default router;

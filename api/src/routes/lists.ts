import { Router } from "express";
import * as listsController from "../controllers/lists.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", listsController.createList);
router.get("/", listsController.getLists);
router.get("/:id", listsController.getList);
router.delete("/:id", listsController.deleteList);
router.patch("/:id", listsController.renameList);

export default router;

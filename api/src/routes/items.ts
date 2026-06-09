import { Router } from "express";
import * as itemsController from "../controllers/items.controller";
import { authenticate } from "../middleware/auth";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", itemsController.getItems);
router.post("/", itemsController.createItem);
router.delete("/:id", itemsController.deleteItem);
router.patch("/:id", itemsController.updateItem);

export default router;

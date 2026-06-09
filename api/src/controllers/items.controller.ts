import { Request, Response } from "express";
import * as itemsService from "../services/items.service";

export const createItem = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    const { name, url, quantity = 1 } = req.body;
    if (!name) throw new Error("Name is required");
    const userId = req.userId as string;
    const item = await itemsService.createItem(
      listId as string,
      userId,
      name,
      url,
      quantity,
    );
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    const userId = req.userId as string;
    const items = await itemsService.getItems(listId as string, userId);
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { listId, itemId } = req.params;
    const { name, url, quantity, checked } = req.body;
    if (!name && !url && !quantity && checked === undefined)
      throw new Error("Nothing to update");
    const userId = req.userId as string;
    const item = await itemsService.updateItem(
      listId as string,
      itemId as string,
      userId,
      name,
      url,
      quantity,
      checked,
    );
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { listId, itemId } = req.params;
    const userId = req.userId as string;
    await itemsService.deleteItem(listId as string, itemId as string, userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

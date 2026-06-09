import { Request, Response } from "express";
import * as listsService from "../services/lists.service";

const handleError = (error: unknown, res: Response) => {
  if (error instanceof Error && error.message === "Forbidden") {
    return res.status(403).json({ error: "Forbidden" });
  }
  return res.status(500).json({ error: "Internal server error" });
};

export const createList = async (req: Request, res: Response) => {
  try {
    const { name, visibility = "PRIVATE" } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (visibility !== "PUBLIC" && visibility !== "PRIVATE") {
      return res.status(400).json({ error: "Visibility must be PUBLIC or PRIVATE" });
    }
    const newList = await listsService.createList(req.userId!, name, visibility);
    res.status(201).json(newList);
  } catch (error) {
    handleError(error, res);
  }
};

export const getLists = async (req: Request, res: Response) => {
  try {
    const lists = await listsService.getLists(req.userId!);
    res.json(lists);
  } catch (error) {
    handleError(error, res);
  }
};

export const getList = async (req: Request, res: Response) => {
  try {
    const list = await listsService.getList(req.params.id, req.userId!);
    if (!list) return res.status(403).json({ error: "Forbidden" });
    res.json(list);
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteList = async (req: Request, res: Response) => {
  try {
    await listsService.deleteList(req.params.id, req.userId!);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};

export const renameList = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const updatedList = await listsService.renameList(req.params.id, name, req.userId!);
    res.json(updatedList);
  } catch (error) {
    handleError(error, res);
  }
};

import { Request, Response } from "express";
import * as listsService from "../services/lists.service";

export const createList = async (req: Request, res: Response) => {
  try {
    const { name, visibility = "PRIVATE" } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const newList = await listsService.createList(
      req.userId!,
      name,
      visibility,
    );
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLists = async (req: Request, res: Response) => {
  try {
    const lists = await listsService.getLists(req.userId!);
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getList = async (req: Request, res: Response) => {
  try {
    const list = await listsService.getList(
      req.params.id as string,
      req.userId!,
    );
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteList = async (req: Request, res: Response) => {
  try {
    await listsService.deleteList(req.params.id as string, req.userId!);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const renameList = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const updatedList = await listsService.renameList(
      req.params.id as string,
      name,
      req.userId!,
    );
    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

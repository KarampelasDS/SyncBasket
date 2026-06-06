import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body?.name || !body?.email || !body?.password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);
    res.status(201).json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body?.email || !body?.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const { email, password } = body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
};

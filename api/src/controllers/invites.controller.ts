import { Request, Response } from "express";
import * as invitesService from "../services/invites.service";

export const sendInvite = async (req: Request, res: Response) => {
  try {
    const { listId, inviteeEmail, role = "VIEWER" } = req.body;
    if (!listId || !inviteeEmail) {
      return res.status(400).json({
        error: "List ID and invitee email are required",
      });
    }
    const inviterId = req.userId as string;
    const alreadyMember = await prisma.listMember.findUnique({
      where: { userId_listId: { userId: invitee.id, listId } },
    });
    if (alreadyMember) throw new Error("User is already a member of this list");
    const result = await invitesService.sendInvite(
      listId,
      inviterId,
      inviteeEmail,
      role,
    );
    res.status(201).json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
};

export const respondToInvite = async (req: Request, res: Response) => {
  try {
    const { response } = req.body;
    const inviteId = req.params.id as string;
    if (!inviteId || !response) {
      return res.status(400).json({
        error: "Invite ID and response are required",
      });
    }
    const userId = req.userId as string;
    const result = await invitesService.respondToInvite(
      inviteId,
      userId,
      response,
    );
    res.status(200).json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
};

export const getInvites = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const result = await invitesService.getInvites(userId);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
};

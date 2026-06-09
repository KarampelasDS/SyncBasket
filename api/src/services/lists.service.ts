import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Create New List
export const createList = async (
  userId: string,
  name: string,
  visibility: "PUBLIC" | "PRIVATE" = "PRIVATE",
) => {
  const result = await prisma.$transaction(async (tx) => {
    const txList = await tx.list.create({
      data: {
        name,
        visibility,
      },
    });
    await tx.listMember.create({
      data: {
        userId,
        listId: txList.id,
        role: "OWNER",
      },
    });
    return txList;
  });
  return result;
};

//Get User Lists
export const getLists = async (userId: string) => {
  const lists = await prisma.listMember.findMany({
    where: { userId },
    include: { list: true },
  });
  return lists.map((lm) => lm.list);
};

//Get List Details
export const getList = async (id: string, userId: string) => {
  const isPublic = await prisma.list.findUnique({
    where: { id },
    select: { visibility: true },
  });
  const member = await prisma.listMember.findUnique({
    where: { userId_listId: { userId, listId: id } },
  });
  if (!member && isPublic?.visibility !== "PUBLIC")
    throw new Error("Authorization Error");
  const list = await prisma.list.findUnique({
    where: { id },
    include: { items: true },
  });
  return list;
};

//Delete List
export const deleteList = async (id: string, userId: string) => {
  const member = await prisma.listMember.findUnique({
    where: { userId_listId: { userId, listId: id } },
  });
  if (!member || member.role !== "OWNER")
    throw new Error("Authorization Error");
  await prisma.list.delete({ where: { id } });
  return { success: true };
};

//Rename List
export const renameList = async (id: string, name: string, userId: string) => {
  const member = await prisma.listMember.findUnique({
    where: { userId_listId: { userId, listId: id } },
  });
  if (!member || member.role !== "OWNER")
    throw new Error("Authorization Error");
  const list = await prisma.list.update({
    where: { id },
    data: { name },
  });
  return list;
};

import prisma from "../utils/prisma";


export const createItem = async (
  listId: string,
  userId: string,
  name: string,
  url?: string,
  quantity?: number,
) => {
  const member = await prisma.listMember.findUnique({
    where: { userId_listId: { userId, listId } },
  });
  if (!member || member.role === "VIEWER")
    throw new Error("Forbidden");
  const item = await prisma.item.create({
    data: {
      listId,
      name,
      url,
      quantity,
    },
  });
  return item;
};

export const getItems = async (listId: string, userId: string) => {
  const list = await prisma.list.findUnique({
    where: { id: listId },
    select: { visibility: true },
  });
  const member = await prisma.listMember.findUnique({
    where: { userId_listId: { userId, listId } },
  });
  if (!member && list?.visibility !== "PUBLIC")
    throw new Error("Forbidden");
  const items = await prisma.item.findMany({
    where: { listId },
  });
  return items;
};

export const updateItem = async (
  listId: string,
  itemId: string,
  userId: string,
  name?: string,
  url?: string,
  quantity?: number,
  checked?: boolean,
) => {
  const member = await prisma.listMember.findUnique({
    where: { userId_listId: { userId, listId } },
  });
  if (!member || member.role === "VIEWER")
    throw new Error("Forbidden");
  const item = await prisma.item.findUnique({
    where: { id: itemId, listId },
  });
  if (!item) throw new Error("Forbidden");
  const updatedItem = await prisma.item.update({
    where: { id: itemId },
    data: { name, url, quantity, checked },
  });
  return updatedItem;
};

export const deleteItem = async (
  listId: string,
  itemId: string,
  userId: string,
) => {
  const member = await prisma.listMember.findUnique({
    where: { userId_listId: { userId, listId } },
  });
  if (!member || member.role === "VIEWER")
    throw new Error("Forbidden");
  const item = await prisma.item.findUnique({
    where: { id: itemId, listId },
  });
  if (!item) throw new Error("Forbidden");
  const deletedItem = await prisma.item.delete({
    where: { id: itemId },
  });
  return deletedItem;
};

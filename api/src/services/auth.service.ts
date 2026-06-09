import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Invalid Credentials");
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid Credentials");
  const matches = await bcrypt.compare(password, user.password);
  if (!matches) throw new Error("Invalid Credentials");
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

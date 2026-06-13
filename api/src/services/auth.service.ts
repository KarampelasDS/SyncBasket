import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
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
  const rawRefreshToken = crypto.randomBytes(32).toString("hex");
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(rawRefreshToken)
    .digest("hex");
  await prisma.refreshToken.create({
    data: {
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "15m" });
  return {
    rawRefreshToken,
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid Credentials");
  const matches = await bcrypt.compare(password, user.password);
  if (!matches) throw new Error("Invalid Credentials");
  const rawRefreshToken = crypto.randomBytes(32).toString("hex");
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(rawRefreshToken)
    .digest("hex");
  await prisma.refreshToken.create({
    data: {
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "15m" });
  return {
    token,
    rawRefreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const refreshToken = async (token: string) => {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const match = await prisma.refreshToken.findUnique({
    where: { token: hashed },
  });
  if (!match) throw new Error("Authorization Error");
  if (match.revoked) throw new Error("Authorization Error");
  if (match.expiresAt < new Date()) throw new Error("Authorization Error");
  await prisma.refreshToken.update({
    where: {
      id: match.id,
    },
    data: {
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  const newToken = jwt.sign({ userId: match.userId }, JWT_SECRET, {
    expiresIn: "15m",
  });
  return { token: newToken };
};

export const logout = async (token: string) => {
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const match = await prisma.refreshToken.findUnique({
    where: { token: hashed },
  });
  if (!match) throw new Error("Authorization Error");
  await prisma.refreshToken.update({
    where: {
      id: match.id,
    },
    data: {
      revoked: true,
    },
  });
  return { message: "Logged out successfully" };
};

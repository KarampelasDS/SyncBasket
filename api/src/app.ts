import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import listsRoutes from "./routes/lists";
import itemsRoutes from "./routes/items";
import invitesRoutes from "./routes/invites";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/lists", listsRoutes);
app.use("/lists/:listId/items", itemsRoutes);
app.use("/invites", invitesRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;

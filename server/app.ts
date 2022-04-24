import express from "express";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import sembakoRoutes from "./routes/sembako";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/sembako", sembakoRoutes);

module.exports = app;

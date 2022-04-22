import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);

module.exports = app;

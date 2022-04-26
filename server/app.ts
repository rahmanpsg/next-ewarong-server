import express from "express";
import fileUpload from "express-fileupload";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import sembakoRoutes from "./routes/sembako";

const app = express();

app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/sembako", sembakoRoutes);

module.exports = app;

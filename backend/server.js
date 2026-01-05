import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import adminRoutes from "./routes/admin.routes.js";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/files", fileRoutes);
app.use("/admin", adminRoutes);

app.get("/", (_, res) => {
  res.json({ message: "Secure File Backend Running 🚀" });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

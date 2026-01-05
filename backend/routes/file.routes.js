import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { uploadFile, listFiles,downloadFile } from "../controllers/file.controller.js";

const router = express.Router();
const upload = multer();

router.get("/", authenticate, listFiles);
router.post(
  "/upload",
  authenticate,
  authorize("admin", "editor"),
  upload.single("file"),
  uploadFile
);
router.get(
  "/:id/download",
  authenticate,
  downloadFile
);

export default router;

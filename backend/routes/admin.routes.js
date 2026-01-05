import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { getUsers, updateRole } from "../controllers/admin.controller.js";

import { getAuditLogs } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", authenticate, authorize("admin"), getUsers);
router.post("/role", authenticate, authorize("admin"), updateRole);
router.get(
  "/audit-logs",
  authenticate,
  authorize("admin"),
  getAuditLogs
);

export default router;





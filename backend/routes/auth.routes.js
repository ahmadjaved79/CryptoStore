import express from "express";
import { login, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);   // first admin
router.post("/login", login);

export default router;

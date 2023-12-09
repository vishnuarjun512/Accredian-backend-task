import express from "express";
import {
  registerUser,
  loginUser,
  signout,
  profile,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/signout", signout);
router.get("/profile", profile);

export default router;

import express from "express";
import {
  login,
  signup,
  google,
  logout,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/google", google);
authRouter.get("/logout", logout);

export default authRouter;

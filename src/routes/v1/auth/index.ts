import express, { Router } from "express";
import {
  confirm,
  login,
  logout,
  signup,
  token,
  updateProfile,
} from "./controller";

const auth: Router = express.Router();

auth.post("/signup", signup);
auth.post("/confirm", confirm);
auth.post("/login", login);
auth.patch("/profile", updateProfile);
auth.post("/logout", logout);
auth.post("/token", token);

export default auth;

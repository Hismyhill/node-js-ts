import express, { Router } from "express";
import authenticateUser from "../../../middleware/authenticate-user";
import { confirm, login, logout, signup, token } from "./controller";

const auth: Router = express.Router();

auth.post("/signup", signup);
auth.post("/confirm", confirm);
auth.post("/login", login);
auth.post("/logout", logout);
auth.post("/token", token);

export default auth;

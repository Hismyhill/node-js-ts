import jwt from "jsonwebtoken";
import config from "./config";

const payload = {
  sub: "21d6f8e2-3c4a-4b5a-9f1e-2d3c4b5a6f7g",
};

const token = jwt.sign(payload, config.appSecret, {
  expiresIn: "1h",
  issuer: "task-manager-app",
});

console.log(token);

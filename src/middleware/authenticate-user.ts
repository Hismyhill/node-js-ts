import { auth } from "express-oauth2-jwt-bearer";
import config from "../config";

const authenticateUser = auth({
  issuerBaseURL: config.issuerBaseUrl,
  audience: config.audience,
});

export default authenticateUser;

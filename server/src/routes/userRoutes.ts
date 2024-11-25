import * as express from "express";
import { signUp, login, getUserHandler } from "../controllers/authController";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/getUser/:id").post(getUserHandler);

export default router;

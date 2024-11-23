import * as express from "express";
import { signUp, login,getUserInfo } from "../controllers/authController";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/getInfo/:id").post(getUserInfo);

export default router;

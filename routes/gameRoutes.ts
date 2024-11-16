import * as express from "express";
import { createGame } from "../controllers/gameController";

const router = express.Router();

router.route("/create-game").post(createGame);

export default router;

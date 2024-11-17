import * as express from "express";
import {
  createGame,
  joinGame,
  exitGame,
  getGameInfo,
  getAllGames,
  addSentenceToSong,
} from "../controllers/gameController";

const router = express.Router();

router.route("/").post(createGame).get(getAllGames);
router.route("/:gameId").get(getGameInfo);
router.route("/:gameCode/:playerId").patch(joinGame).delete(exitGame);
router.route("/:gameCode/:playerId/sentence").post(addSentenceToSong);

export default router;

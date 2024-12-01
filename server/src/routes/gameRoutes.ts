import * as express from "express";
import {
  createGame,
  joinGame,
  leaveGame,
  getAllGames,
  getGameInfo,
  addSentenceHandler,
  startGame,
  deleteGame,
} from "../controllers/gameController";

const router = express.Router();

router.route("/").post(createGame).get(getAllGames);
router.route("/:gameCode").get(getGameInfo).delete(deleteGame);
router.route("/:gameCode/start").patch(startGame);
router.route("/:gameCode/:playerId").patch(joinGame).delete(leaveGame);
router.route("/:gameCode/:playerId/sentence").post(addSentenceHandler); //checkGameStarted,

export default router;

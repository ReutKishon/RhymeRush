import * as express from "express";
import {
  createGame,
  joinGame,
  leaveGameHandler,
  getAllGames,
  getGameInfo,
  addSentenceHandler,
  startGame,
  checkGameStarted,
  deleteGame,
} from "../controllers/gameController";

const router = express.Router();

router.route("/").post(createGame).get(getAllGames);
router.route("/:gameCode").get(getGameInfo).delete(deleteGame);
router.route("/:gameCode/start").patch(startGame);
router.route("/:gameCode/:playerId").patch(joinGame).delete(leaveGameHandler);
router.route("/:gameCode/:playerId/sentence").post(addSentenceHandler); //checkGameStarted,

export default router;

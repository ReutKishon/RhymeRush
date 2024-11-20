import * as express from "express";
import {
  createGame,
  joinGame,
  exitGame,
  getGameInfo,
  getAllGames,
  addSentenceToSong,
  startNewTurn,
  startGame,
  checkGameStarted,
  deleteGame
} from "../controllers/gameController";

const router = express.Router();

router.route("/").post(createGame).get(getAllGames);
router.route("/:gameCode").get(getGameInfo).delete(deleteGame);
router.route("/:gameCode/start").patch(startGame);
router.route("/:gameCode/new-turn").patch(startNewTurn);
router.route("/:gameCode/:playerId").patch(joinGame).delete(exitGame);
router
  .route("/:gameCode/:playerId/sentence")
  .post(checkGameStarted, addSentenceToSong);

export default router;

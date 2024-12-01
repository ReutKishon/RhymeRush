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
  userTurnExpired
} from "../controllers/gameController";

const router = express.Router();

router.route("/").post(createGame).get(getAllGames);
router.route("/:gameCode").get(getGameInfo).delete(deleteGame);
router.route("/:gameCode/start").patch(startGame);
router.route("/:gameCode/:playerId").patch(joinGame).delete(leaveGame);
router.route("/:gameCode/:playerId/sentence").post(addSentenceHandler); 
router.route("/:gameCode/:playerId/turnExpired").post(userTurnExpired); //checkGameStarted,


export default router;

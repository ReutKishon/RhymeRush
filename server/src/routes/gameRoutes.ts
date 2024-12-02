import * as express from "express";
import {
  createGame,
  joinGame,
  getAllGames,
  getGameInfo,
  addSentenceHandler,
  startGame,
  deleteGame,
  handlePlayerLoss,
} from "../controllers/gameController";

const router = express.Router();

router.route("/").post(createGame).get(getAllGames);
router.route("/:gameCode").get(getGameInfo).delete(deleteGame);
router.route("/:gameCode/start").patch(startGame);
router.route("/:gameCode/:playerId").patch(joinGame).delete(handlePlayerLoss);
router.route("/:gameCode/:playerId/sentence").patch(addSentenceHandler);

export default router;

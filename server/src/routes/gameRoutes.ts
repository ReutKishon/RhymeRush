import * as express from "express";
import {
  createGame,
  joinGame,
  getAllGames,
  getGameInfo,
  addSentenceHandler,
  startGame,
  deleteGame,
} from "../controllers/gameController";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel";
import { CustomRequest } from "types/appTypes";

const router = express.Router();



const protect = asyncHandler(async (req: CustomRequest, res, next) => {
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const id = (decoded as JwtPayload).id;
      // get user from the token
      req.user = await UserModel.findById(id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not Authorized");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

router.use(protect);
router.route("/").post(createGame).get(getAllGames);
router.route("/:gameCode").get(getGameInfo).delete(deleteGame);
router.route("/:gameCode/start").patch(startGame);
router.route("/:gameCode/:playerId").patch(joinGame);
router.route("/:gameCode/:playerId/sentence").patch(addSentenceHandler);

export default router;

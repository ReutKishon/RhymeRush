import { Router } from "express";
const express = require("express");
const authController = require("../controllers/authController");
import { createGame } from "../controllers/gameController";

const router: Router = express.Router();

router.route("/create-game").post(createGame);

export default router;

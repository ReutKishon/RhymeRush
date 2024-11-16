// @ts-ignore
const express = require("express");
import { signUp, login } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
// router.get("/logout", authController.logout);

// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);

// router.use(authController.protect);

// router.patch("/updateMyPassword", authController.updatePassword);
// router.get("/me", userController.getMe, userController.getUser);
// router.patch(
//   "/updateMe",
//   userController.uploadUserPhoto,
//   userController.resizeUserPhoto,
//   userController.updateMe
// );
// router.delete("/deleteMe", userController.deleteMe);

// router.use(authController.restrictTo("admin"));
// router.route("/").get(authController.protect, userController.getAllUsers);
// router.route("/:id").patch(userController.updateUser);

export default router;

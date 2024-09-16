const express = require("express");
const userRouter = express.Router();

const {signup, signin, forgotPassword, resetPassword, profile, logout} = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.get('/profile', authMiddleware, profile);
userRouter.post("/logout", authMiddleware, logout);

module.exports = userRouter;

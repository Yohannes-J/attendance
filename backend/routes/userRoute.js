import express from "express";
import {
  createUser,
  getUsers,
  loginUser,
  getActiveUsersStats,
  getProfile,
  logout,
  updateProfile,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";

import { checkAuth } from "../middlewares/checkAuth.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/get-users", authUser, getUsers);
userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logout);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.get("/active-users", getActiveUsersStats);
userRouter.put(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.put("/update-user/:id", authUser, updateUser);
userRouter.put("/update-password/:id", authUser, updateUserPassword);

userRouter.get("/checkauth", checkAuth);

export default userRouter;

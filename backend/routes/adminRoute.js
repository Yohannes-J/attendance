import express from "express";
import { loginAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();

// Route to login user
adminRouter.post("/login", loginAdmin);

export default adminRouter;

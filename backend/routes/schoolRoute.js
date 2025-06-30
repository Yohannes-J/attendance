import express from "express";
import { addSchool, getAllSchools } from "../controllers/schoolController.js";

const schoolRouter = express.Router();

// Route to add sector
schoolRouter.post("/add-school", addSchool);
schoolRouter.get("/get-school", getAllSchools);

export default schoolRouter;

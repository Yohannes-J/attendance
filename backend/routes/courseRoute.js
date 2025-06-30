import express from "express";
import { addCourse, getAllCourses } from "../controllers/courseController.js";

const courseRouter = express.Router();

// Route to add sector
courseRouter.post("/add-course", addCourse);
courseRouter.get("/get-course", getAllCourses);

export default courseRouter;

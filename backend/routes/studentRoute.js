import express from "express";
const studentRouter = express.Router();
import {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
} from "../controllers/studentController.js";
studentRouter.get("/get-student", getStudents);
studentRouter.post("/add-student", addStudent);
studentRouter.delete("/delete-record/:id", deleteStudent);
studentRouter.put("/update-student/:id", updateStudent);

export default studentRouter;

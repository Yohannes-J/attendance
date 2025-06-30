import express from "express";
import { addDepartment, getAllDepartments } from "../controllers/deptController.js";


const deptRouter = express.Router();

// Route to add sector
deptRouter.post("/add-department", addDepartment);
deptRouter.get("/get-department", getAllDepartments);

export default deptRouter;

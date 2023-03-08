import express from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  patchDepartment,
} from "../service/department-service.js";
import { createCourse, deleteCourse, getCourse, getCourses, patchCourse } from "../service/course-service.js";

export const departmentRouter = express.Router();

// -------------------- Endpoints ------------------------

// Departments
departmentRouter.get("/", getDepartments);
departmentRouter.get("/:slug", getDepartment);
departmentRouter.patch("/:slug", patchDepartment);
departmentRouter.post("/", createDepartment);
departmentRouter.delete("/:slug", deleteDepartment);

// Courses
departmentRouter.get("/:slug/courses", getCourses);
departmentRouter.post("/:slug/courses", createCourse);
departmentRouter.get("/:slug/courses/:courseId", getCourse);
departmentRouter.patch("/:slug/courses/:courseId", patchCourse);
departmentRouter.delete("/:slug/courses/:courseId", deleteCourse);

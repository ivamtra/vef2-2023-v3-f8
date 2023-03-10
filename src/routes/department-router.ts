import express from "express";
import {
  getDepartmentService,
  deleteDepartment,
  getDepartmentsService,
  patchDepartment,
  postDepartmentService,
} from "../service/department-service.js";
import { createCourse, deleteCourse, getCourse, getCourses, patchCourse } from "../service/course-service.js";

export const departmentRouter = express.Router();

// -------------------- Endpoints ------------------------

// Departments
departmentRouter.get("/", getDepartmentsService);
departmentRouter.get("/:slug", getDepartmentService);
departmentRouter.patch("/:slug", patchDepartment);
departmentRouter.post("/", postDepartmentService);
departmentRouter.delete("/:slug", deleteDepartment);

// Courses
departmentRouter.get("/:slug/courses", getCourses);
departmentRouter.post("/:slug/courses", createCourse);
departmentRouter.get("/:slug/courses/:courseId", getCourse);
departmentRouter.patch("/:slug/courses/:courseId", patchCourse);
departmentRouter.delete("/:slug/courses/:courseId", deleteCourse);

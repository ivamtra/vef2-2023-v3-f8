import express from "express";
import {
  getDepartmentService,
  getDepartmentsService,
  patchDepartment,
  postDepartmentService,
  deleteDepartmentService,
} from "../service/department-service.js";
import {  createCourseService, deleteCourseService, getCourseService, getCoursesService, patchCourseService } from "../service/course-service.js";

export const departmentRouter = express.Router();

// -------------------- Endpoints ------------------------

// Departments
departmentRouter.get("/", getDepartmentsService);
departmentRouter.get("/:slug", getDepartmentService);
departmentRouter.patch("/:slug", patchDepartment);
departmentRouter.post("/", postDepartmentService);
departmentRouter.delete("/:slug", deleteDepartmentService);

// Courses
departmentRouter.get("/:slug/courses", getCoursesService);
departmentRouter.post("/:slug/courses", createCourseService);
departmentRouter.get("/:slug/courses/:courseId", getCourseService);
departmentRouter.patch("/:slug/courses/:courseId", patchCourseService);
departmentRouter.delete("/:slug/courses/:courseId", deleteCourseService);

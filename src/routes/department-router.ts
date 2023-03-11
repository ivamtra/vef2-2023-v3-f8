import express from "express";
import {
  getDepartmentService,
  getDepartmentsService,
  patchDepartment,
  postDepartmentService,
  deleteDepartmentService,
} from "../service/department-service.js";
import {  createCourseService, deleteCourseService, getCourseService, getCoursesService, patchCourseService } from "../service/course-service.js";
import { catchErrors } from "../lib/catch-errors.js";

export const departmentRouter = express.Router();

// -------------------- Endpoints ------------------------

// Departments
departmentRouter.get("/", catchErrors(getDepartmentsService));
departmentRouter.get("/:slug", catchErrors(getDepartmentService));
departmentRouter.patch("/:slug", catchErrors(patchDepartment));
departmentRouter.post("/", catchErrors(postDepartmentService));
departmentRouter.delete("/:slug", catchErrors(deleteDepartmentService));

// Courses
departmentRouter.get("/:slug/courses", catchErrors(getCoursesService));
departmentRouter.post("/:slug/courses", catchErrors(createCourseService));
departmentRouter.get("/:slug/courses/:courseId", catchErrors(getCourseService));
departmentRouter.patch("/:slug/courses/:courseId", catchErrors(patchCourseService));
departmentRouter.delete("/:slug/courses/:courseId", catchErrors(deleteCourseService));

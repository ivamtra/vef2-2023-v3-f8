import express, { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import { catchErrors } from "../lib/catch-errors.js";
import {
  mapDbDepartmentToDepartment,
  mapDbDepartmentsToDepartments,
} from "../model/departments.js";
import { query } from "../lib/db.js";
import {
  mapDbCourseToCourse,
  mapDbCoursesToCourses,
} from "../model/courses.js";
import { slugify } from "../lib/slugify.js";

export const departmentRouter = express.Router();

// -------------------------------- READ --------------------------------------

export async function index(req: Request, res: Response, next: NextFunction) {
  const departmentsResult = await query("SELECT * FROM department;");

  const events = mapDbDepartmentsToDepartments(departmentsResult);

  res.json(events);
}

export async function event(req: Request, res: Response, next: NextFunction) {
  const { slug } = req.params;
  const departmentResult = await query(
    "SELECT * FROM department WHERE slug = $1;",
    [slug]
  );
  const department = mapDbDepartmentToDepartment(departmentResult);

  console.log(department);
  if (!department) {
    return next();
  }
  res.json(department);
}

// -------------------------------- UPDATE --------------------------------------

async function patchEvent(req: Request, res: Response, next: NextFunction) {}

// -------------------------------- CREATE --------------------------------------

async function createDepartment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("CREATE DEPARTMENT");
  console.log(req.body)
  const { titill, lysing } = req.body;


  const slug = slugify(titill, "-");

  const q = `INSERT INTO department (titill, slug, lysing) VALUES ($1, $2, $3)
             RETURNING id, titill, slug, lysing, created, updated `;

  const result = await query(q, [titill, slug, lysing]);

  console.log(result);

  const department = mapDbDepartmentToDepartment(result);
  if (!department) {
    return next();
  }
  res.json(department);
}

// -------------------------------- DELETE --------------------------------------

async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  const { slug } = req.params;
  const q = `DELETE FROM department where slug = $1
             RETURNING id, titill, slug, lysing, created, updated `;
  const result = await query(q, [slug]);

  const department = mapDbDepartmentToDepartment(result);

  if (!department) {
    return next();
  }
  res.json(department);
}

// -------------------- Endpoints ------------------------

departmentRouter.get("/", index);
departmentRouter.get("/:slug", event);
departmentRouter.patch("/:slug", patchEvent);
departmentRouter.post("/", createDepartment);
departmentRouter.delete("/:slug", deleteEvent);

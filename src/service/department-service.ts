import { NextFunction, Request, Response } from "express";
import {
  mapDbDepartmentToDepartment,
  mapDbDepartmentsToDepartments,
} from "../mappings/departments.js";
import { slugify } from "../lib/slugify.js";
import { conditionalUpdate, getDepartmentBySlug, query } from "../lib/db.js";

// -------------------------------- READ --------------------------------------

export async function getDepartments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const departmentsResult = await query("SELECT * FROM department;");

  const events = mapDbDepartmentsToDepartments(departmentsResult);

  res.json(events);
}

export async function getDepartment(
  req: Request,
  res: Response,
  next: NextFunction
) {
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


// todo
export async function patchDepartment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;

  const fields = Object.keys(req.body)
  const values : Array<string | number | null> = Object.values(req.body)

  const department = await getDepartmentBySlug(slug)

  if (!department || !department.id)
    return next()

  const result  = await conditionalUpdate('department', department?.id, fields, values)
  if (!result) {
    return next()
  }
  console.log(result)
  const updatedDepartment = mapDbDepartmentToDepartment(result)

  res.json(updatedDepartment)
}

// -------------------------------- CREATE --------------------------------------

export async function createDepartment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("CREATE DEPARTMENT");
  console.log(req.body);
  const { titill, lysing } = req.body;

  const slug = slugify(titill, "-");

  const q = `INSERT INTO department (titill, slug, lysing) VALUES ($1, $2, $3)
               RETURNING id, titill, slug, lysing, created, updated `;

  const result = await query(q, [titill, slug, lysing]);


  const department = mapDbDepartmentToDepartment(result);
  if (!department) {
    return next();
  }
  res.json(department);
}

// -------------------------------- DELETE --------------------------------------

export async function deleteDepartment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;
  const q = `DELETE FROM department where slug = $1
               RETURNING *`;
  const result = await query(q, [slug]);

  const department = mapDbDepartmentToDepartment(result);

  if (!department) {
      return next();
  }
  res.json(department);
}

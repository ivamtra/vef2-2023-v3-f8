import { NextFunction, Request, Response } from "express";
import {
  mapDbDepartmentToDepartment,
  mapDbDepartmentsToDepartments,
} from "../mappings/departments.js";
import { conditionalUpdate, createDepartment, getDepartmentBySlug, query } from "../lib/db.js";
import { slugify } from "../lib/slugify.js";

// -------------------------------- READ --------------------------------------

export async function getDepartmentsService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const departmentsResult = await query("SELECT * FROM department;");

  if (departmentsResult === null) {
    next()
  }
  const events = mapDbDepartmentsToDepartments(departmentsResult);
  res.json(events);
}

export async function getDepartmentService(
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

  // Ef breyta á titli deildar
  if (req.body.title) {
    req.body.slug = slugify(req.body.title, '-')
  }

  const fields = Object.keys(req.body)
  const values : Array<string | number | null> = Object.values(req.body)

  const department = await getDepartmentBySlug(slug)

  if (!department || !department.id) {
    res.status(404)
    return next()
  }

  const result  = await conditionalUpdate('department', department?.id, fields, values)
  if (!result) {
    res.status(400)
    return res.json({"message": 'Bad request'})
  }
  const updatedDepartment = mapDbDepartmentToDepartment(result)

  res.json(updatedDepartment)
}

// -------------------------------- CREATE --------------------------------------

export async function postDepartmentService(
  req: Request,
  res: Response,
) {
  const { title, description } = req.body;

  const department = await createDepartment({title, description})
  if (!department) {
    res.status(400)
    return res.json({message: 'Bad request'})
  }
  res.status(201)
  return res.json(department);
}

// -------------------------------- DELETE --------------------------------------

export async function deleteDepartmentService(
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
  res.status(204)
  res.json(department);
}

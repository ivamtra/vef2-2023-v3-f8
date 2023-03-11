import { NextFunction, Request, Response } from "express";
import {
  conditionalUpdate,
  createCourse,
  getCourseById,
  getCourseBySlug,
  getDepartmentBySlug,
  query,
} from "../lib/db.js";
import {
  mapDbCourseToCourse,
  mapDbCoursesToCourses,
} from "../mappings/courses.js";
import { slugify } from "../lib/slugify.js";

export async function getCoursesService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;
  const q1 = `SELECT *
                FROM course
                WHERE departmentId IN
                (
                    SELECT id
                    FROM department
                    WHERE slug = $1
                )`;

  const result = await query(q1, [slug]);

  const courses = mapDbCoursesToCourses(result);
  if (!courses) {
    return next();
  }
  res.json(courses);
}
export async function getCourseService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { courseId } = req.params;


  const course = await getCourseBySlug(courseId);

  if (!course) {
    return next()
  }

  res.json(course);
}

export async function createCourseService(
  req: Request,
  res: Response,
) {
  const { number, title, credits, semester, level, url } = req.body;
  const { slug } = req.params;

  const department = await getDepartmentBySlug(slug);
  if (department === null) {
    res.status(400);
    return res.json({ message: "Bad request" });
  }

  const course = await createCourse(
    { number, title, credits, semester, level, url },
    department.id
  );

  res.status(201);
  res.json(course);
}

export async function patchCourseService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.params);
  const courseId = req.params.courseId;


  // Ef breyta á númeri áfanga
  if (req.body.number) {
    req.body.slug = slugify(req.body.number, '-')
  }

  const fields = Object.keys(req.body);
  const values: Array<string | number | null> = Object.values(req.body);

  const course = await getCourseBySlug(courseId);

  // 404
  if (!course || !course.id) return next();

  const result = await conditionalUpdate("course", course.id, fields, values);
  if (!result) {
    res.status(400);
    return res.json({ message: "bad request" });
  }
  const updatedCourse = mapDbCourseToCourse(result);

  res.json(updatedCourse);
}


export async function deleteCourseService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { courseId } = req.params;

  const q = `DELETE FROM course WHERE id = $1 RETURNING *`;

  const result = await query(q, [courseId]);
  if (!result) {
    next();
  }
  const course = mapDbCourseToCourse(result);

  res.status(204);
  res.json(course);
}

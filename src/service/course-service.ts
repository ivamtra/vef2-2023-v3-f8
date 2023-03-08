import { NextFunction, Request, Response } from "express";
import { conditionalUpdate, getCourseById, query } from "../lib/db.js";
import { mapDbCourseToCourse, mapDbCoursesToCourses } from "../mappings/courses.js";
import { slugify } from "../lib/slugify.js";
import { mapDbDepartmentToDepartment } from "../mappings/departments.js";

export async function getCourses(
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
export async function getCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const {courseId} = req.params
  const q = `SELECT *
             FROM course
             WHERE id = $1`;
  const result = await query(q, [courseId])

  const course = mapDbCourseToCourse(result)
  console.log(course)
  res.json(course);
}

export async function createCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {


  // {
  //   "id": 3,
  //   "created": "2023-03-08T16:16:06.605Z",
  //   "updated": "2023-03-08T16:16:06.605Z",
  //   "numer": "HAG104M",
  //   "slugnumer": "hag104m",
  //   "einingar": "6",
  //   "kennslumisseri": "Haust",
  //   "namstig": "Grunnnám / Framhaldsnám",
  //   "hlekkur": "https://ugla.hi.is/kennsluskra/?tab=nam&chapter=namskeid&id=70754420226&kennsluar=2022",
  //   "departmentid": 1
  // }
  const {numer, einingar, kennslumisseri, namstig, hlekkur, heiti} = req.body
  const {slug} = req.params

  const slugnumer = slugify(numer, '-')
  
  const departmentQ = `select * from department where slug = $1`
  const departmentResult = await query(departmentQ, [slug])

  const department = mapDbDepartmentToDepartment(departmentResult)



  if (!department?.id && !department) {
    return
  }

  const insertQ = `INSERT INTO course
                   (numer, slugnumer, heiti, einingar, kennslumisseri, namstig, hlekkur, departmentId)
                   VALUES
                   ($1, $2, $3, $4, $5, $6, $7, $8)
                   RETURNING *`
  
  const values = [numer, slugify(numer, '-'), heiti, einingar, kennslumisseri, namstig, hlekkur, department.id]


  const courseResult = await query(insertQ, values)

  const course = mapDbCourseToCourse(courseResult)

  console.log(courseResult)

  console.log("Hello createCourse");
  res.json({ message: "createCourse" });
}

export async function patchCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.params)
  const courseId = Number(req.params.courseId)

  const fields = Object.keys(req.body)
  const values : Array<string | number | null> = Object.values(req.body)

  const course = await getCourseById(courseId)

  if (!course || !course.id)
    return next()

  const result  = await conditionalUpdate('course', course?.id, fields, values)
  if (!result) {
    return next()
  }
  const updatedCourse = mapDbCourseToCourse(result)

  res.json(updatedCourse)

}
export async function deleteCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const {courseId} = req.params

  const q = `DELETE FROM course WHERE id = $1 RETURNING *`

  const result = await query(q, [courseId])
  const course = mapDbCourseToCourse(result)

  res.json(course);
}

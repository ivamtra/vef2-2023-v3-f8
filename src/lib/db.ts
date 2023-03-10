import { readFile } from "fs/promises";
import pg from "pg";
import { mapDbDepartmentToDepartment } from "../mappings/departments.js";
import { mapDbCourseToCourse } from "../mappings/courses.js";
import { Course, Department } from "../types/types.js";
import { slugify } from "./slugify.js";

const SCHEMA_FILE = "./sql/schema.sql";
const DROP_SCHEMA_FILE = "./sql/drop.sql";

const { DATABASE_URL: connectionString } = process.env;

console.log(process.env.DATABASE_URL);

console.log("Hello");
console.log(connectionString);

const pool = new pg.Pool({ connectionString });

pool.on("error", (err: Error) => {
  console.error("Villa í tengingu við gagnagrunn, forrit hættir", err);
  process.exit(-1);
});

type QueryInput = string | number | null;

export async function query(q: string, values: Array<QueryInput> = []) {
  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error("unable to get client from pool", e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    console.error("unable to query", e);
    console.info(q, values);
    return null;
  } finally {
    client.release();
  }
}

export async function end() {
  await pool.end();
}

export async function createSchema(schemaFile = SCHEMA_FILE) {
  const data = await readFile(schemaFile);

  return query(data.toString("utf-8"));
}

export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
  const data = await readFile(dropFile);

  return query(data.toString("utf-8"));
}

export async function conditionalUpdate(
  table: "department" | "course",
  id: number,
  fields: Array<string | null>,
  values: Array<string | number | null>
) {
  const filteredFields = fields.filter((i) => typeof i === "string");
  const filteredValues = values.filter(
    (i) => typeof i === "string" || typeof i === "number" 
  );
  

  if (filteredFields.length === 0) {
    return false;
  }

  if (filteredFields.length !== filteredValues.length) {
    throw new Error("fields and values must be of equal length");
  }

  // id is field = 1
  const updates = filteredFields.map((field, i) => `${field} = $${i + 2}`);

  const q = `
    UPDATE ${table}
      SET ${updates.join(", ")}
    WHERE
      id = $1
    RETURNING *
    `;
  
  
  
  const queryValues : Array<string | number | null> = ([id] as Array<string | number | null>).concat(filteredValues);
  const result = await query(q, queryValues)
  // Update time
  const timeQuery = `update ${table} set updated = $1 where id = $2 returning *`
  const timeResult = await query(timeQuery, [new Date().toISOString(), result?.rows[0].id])

  return timeResult;
}


export async function getDepartmentBySlug(slug: string) {
  const q = `SELECT * FROM department WHERE slug = $1`
  const result = await query(q, [slug])
  const department = mapDbDepartmentToDepartment(result)

  return department

}

export async function getCourseById(id: number) {
  const q = 'SELECT * FROM course where id = $1'
  const result = await query(q, [id])
  const course = mapDbCourseToCourse(result)

  return course
}

export async function createCourse(course: Partial<Course>, departmentId: number) {
  const insertQ = `INSERT INTO course
                   (number, title, slug, semester, credits, level, url, departmentId)
                   VALUES
                   ($1, $2, $3, $4, $5, $6, $7, $8)
                   RETURNING *`

  // Check if course is sufficient
  if (!course.number || !course.title || !course.semester || course.credits === undefined) {
    return null
  }
  const input = {
    number: course.number,
    title: course.title,
    slug: slugify(course.title, '-'),
    semester: course.semester,
    credits: course.credits,
    level: course.level ? course.level : null,
    url: course.url ? course.url : null,
    departmentId
  }
  const values = [input.number, input.title, input.slug, input.semester, input.credits, input.level, input.url, departmentId]

  const result = await query(insertQ, values)

  const courseResult = mapDbCourseToCourse(result)

  return courseResult


}

export async function createDepartment(department:  Partial<Department>) : Promise<Department | null> {
  const q = `INSERT INTO department (title, slug, description) VALUES ($1, $2, $3)
  RETURNING *`;
  if (!department.title) {
    return null
  }
  const description = department.description ? department.description : null
  const values = [department.title, slugify(department.title, '-'), description]

  const result = await query(q, values)
  const departmentResult = mapDbDepartmentToDepartment(result)
  return departmentResult
  
}
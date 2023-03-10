import { readFile } from "fs/promises";
import pg from "pg";
import { mapDbDepartmentToDepartment } from "../mappings/departments.js";
import { mapDbCourseToCourse } from "../mappings/courses.js";

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
  await query(q, queryValues)
  // Update time
  const timeQuery = `update ${table} set updated = $1 returning *`
  const timeResult = await query(timeQuery, [new Date().toISOString()])

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
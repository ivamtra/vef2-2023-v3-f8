import { QueryResult } from "pg";
import { Department } from "../types/types";



export function departmentMapper(input: unknown): Department | null {
  const potentialDepartment = input as Partial<Department> | null;

  if (
    !potentialDepartment ||
    !potentialDepartment.id ||
    !potentialDepartment.title ||
    !potentialDepartment.slug ||
    !potentialDepartment.description ||
    !potentialDepartment.created ||
    !potentialDepartment.updated
  ) {
    console.log('WTF')
    return null;
  }

  const department: Department = {
    id: potentialDepartment.id,
    title: potentialDepartment.title,
    slug: potentialDepartment.slug,
    description: potentialDepartment.description,
    created: new Date(potentialDepartment.created),
    updated: new Date(potentialDepartment.updated),
  };

  return department;
}

export function mapDbDepartmentToDepartment(
  input: QueryResult<Department> | null
): Department | null {
  if (!input) {
    return null;
  }

  return departmentMapper(input.rows[0]);
}

export function mapDbDepartmentsToDepartments(
  input: QueryResult<Department> | null
): Array<Department> {

  if (!input) {
    return [];
  }

  const mappedIndices = input?.rows.map(departmentMapper);

  console.log(mappedIndices)

  return mappedIndices.filter((i): i is Department => Boolean(i));
}

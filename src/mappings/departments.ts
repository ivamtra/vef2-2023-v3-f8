import { QueryResult } from "pg";

export type Department = {
  id: number;
  titill: string;
  slug: string;
  lysing: string;
  created: Date;
  updated: Date;
};

export function departmentMapper(input: unknown): Department | null {
  const potentialDepartment = input as Partial<Department> | null;

  if (
    !potentialDepartment ||
    !potentialDepartment.id ||
    !potentialDepartment.titill ||
    !potentialDepartment.slug ||
    !potentialDepartment.lysing ||
    !potentialDepartment.created ||
    !potentialDepartment.updated
  ) {
    console.log('WTF')
    return null;
  }

  const department: Department = {
    id: potentialDepartment.id,
    titill: potentialDepartment.titill,
    slug: potentialDepartment.slug,
    lysing: potentialDepartment.lysing,
    created: new Date(potentialDepartment.created),
    updated: new Date(potentialDepartment.updated),
  };

  return department;
}

export function mapDbDepartmentToDepartment(
  input: QueryResult<any> | null
): Department | null {
  if (!input) {
    return null;
  }

  return departmentMapper(input.rows[0]);
}

export function mapDbDepartmentsToDepartments(
  input: QueryResult<any> | null
): Array<Department> {

  if (!input) {
    return [];
  }

  const mappedIndices = input?.rows.map(departmentMapper);

  console.log(mappedIndices)

  return mappedIndices.filter((i): i is Department => Boolean(i));
}

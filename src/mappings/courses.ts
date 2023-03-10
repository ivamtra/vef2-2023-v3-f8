import { QueryResult } from "pg";
import { Course } from "../types/types";



export function courseMapper(input: unknown): Course | null {
  const potentialCourse = input as Partial<Course> | null;

  if (
    !potentialCourse ||
    !potentialCourse.id ||
    !potentialCourse.title ||
    !potentialCourse.slug ||
    !potentialCourse.number ||
    !potentialCourse.semester ||
    !potentialCourse.credits ||
    !potentialCourse.level ||
    !potentialCourse.url ||
    !potentialCourse.departmentid ||
    !potentialCourse.created ||
    !potentialCourse.updated
  ) {
    return null;
  }

  const course: Course = {
    id: potentialCourse.id,
    title: potentialCourse.title,
    slug: potentialCourse.slug,
    number: potentialCourse.number,
    semester: potentialCourse.semester,
    credits: potentialCourse.credits,
    level: potentialCourse.level,
    url: potentialCourse.url,
    departmentid: potentialCourse.departmentid,
    created: new Date(potentialCourse.created),
    updated: new Date(potentialCourse.updated),
  };

  return course;
}

export function mapDbCourseToCourse(
  input: QueryResult<Course> | null
): Course | null {
  if (!input) {
    return null;
  }

  return courseMapper(input.rows[0]);
}

export function mapDbCoursesToCourses(
  input: QueryResult<Course> | null
): Array<Course> {
  if (!input) {
    return [];
  }

  const mappedIndices = input?.rows.map(courseMapper);

  return mappedIndices.filter((i): i is Course => Boolean(i));
}

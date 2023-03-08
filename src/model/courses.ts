import { QueryResult } from "pg";

export type Course = {
    id: number,
    numer: string,
    slugnumer: string,
    einingar: string,
    kennslumisseri: string,
    namstig: string,
    hlekkur: string,
    deildid: number,
    created: Date,
    updated: Date
}


export function courseMapper(input: unknown): Course | null {
    const potentialCourse = input as Partial<Course> | null;
  
    if (
      !potentialCourse ||
      !potentialCourse.id ||
      !potentialCourse.numer ||
      !potentialCourse.slugnumer ||
      !potentialCourse.einingar ||
      !potentialCourse.kennslumisseri ||
      !potentialCourse.namstig ||
      !potentialCourse.hlekkur ||
      !potentialCourse.deildid ||
      !potentialCourse.created ||
      !potentialCourse.updated
    ) {
      return null;
    }
  
    const course: Course = {
        id: potentialCourse.id,
        created: new Date(potentialCourse.created),
        updated: new Date(potentialCourse.updated),
        numer: potentialCourse.numer,
        slugnumer: potentialCourse.slugnumer,
        einingar: potentialCourse.einingar,
        kennslumisseri: potentialCourse.kennslumisseri,
        namstig: potentialCourse.namstig,
        hlekkur: potentialCourse.hlekkur,
        deildid: potentialCourse.deildid
    };
  
    return course;
  }
  
  export function mapDbCourseToCourse(
    input: QueryResult<any> | null
  ): Course | null {
    if (!input) {
      return null;
    }
  
    return courseMapper(input.rows[0]);
  }
  
  export function mapDbCoursesToCourses(
    input: QueryResult<any> | null
  ): Array<Course> {
  
    if (!input) {
      return [];
    }
  
    const mappedIndices = input?.rows.map(courseMapper);
  
  
    return mappedIndices.filter((i): i is Course => Boolean(i));
  }
  
import * as fs from "fs";
import { arrayToCourse, csvToArray } from "./csvParser.js";
import { slugify } from "../lib/slugify.js";
import { Course, Department } from "../types/types.js";
type CSVDeild = {
  title: string;
  description: string;
  csv: string;
};

// type CSVAfangi = {
//   numer: string;
//   heiti: string;
//   einingar: number;
//   kennslumiseri: string;
//   namstig: string;
//   hlekkur: string;
// };


export function createDepartmentsFromJson() : Department[] {
  const index: CSVDeild[] = JSON.parse(
    fs.readFileSync("./data/index.json", "utf-8")
  );

  const departments : Department[] = index.map((csvDeild, index) => {
    return {
      id: index,
      title: csvDeild.title,
      slug: slugify(csvDeild.title, '-'),
      description: csvDeild.description,
      created: new Date(),
      updated: new Date()
    }
  })

  return departments
}



export function createCoursesFromCSV(pathFromRoot : string, departmentId : number) : Course[] {
  const courseArray : string[][] = csvToArray( fs.readFileSync(pathFromRoot, 'latin1'))

  const courses : Course[] = arrayToCourse(courseArray, departmentId)
  return courses

}


// export function createSQLFile() {
//   // Create index
//   const index = createIndexSQLFromFile()


//   // Hagfræðideild
//   const hagfraedi = createCourseSQLFromCsv('./data/hagfraedi.csv', 1)


//   // IVT
//   const ivt = createCourseSQLFromCsv('./data/ivt.csv', 2)

//   // Islenska
//   const islenska = createCourseSQLFromCsv('./data/islenska.csv', 3)
//   fs.writeFileSync('./sql/insert.sql', index + hagfraedi + ivt + islenska)
// }

// createSQLFile();

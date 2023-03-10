import * as fs from "fs";
import { csvToArray } from "./csvParser.js";
import { slugify } from "../lib/slugify.js";
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


export function createIndexSQLFromFile() : string {
  const index: CSVDeild[] = JSON.parse(
    fs.readFileSync("./data/index.json", "utf-8")
  );
  // Bua til sql skipanir
  const indexSql = index.map((section) => {
    const slug = slugify(section.title, '-')
    return `INSERT INTO department (titill, slug, lysing) VALUES ('${section.title}', '${slug}', '${section.description}')`;
  });

  // fs.writeFileSync('./sql/insert.sql', indexSql.join(';\n') + ';\n')
  return indexSql.join(';\n') + ';\n'
}



export function createCourseSQLFromCsv(pathFromRoot : string, departmentId : number) : string {
  const courseArray : string[][] = csvToArray( fs.readFileSync(pathFromRoot, 'latin1'))

  // numer: row[0],
  // heiti: row[1],
  // einingar: row[2],
  // kennslumiseri: row[3],
  // namstig: row[4],
  // hlekkur: row[5],
  const courseSqlCommands : string[]  = courseArray.map((row) => {
    const slug = slugify(row[0], '-')
    return `INSERT INTO course (numer, slugNumer, heiti, einingar, kennslumisseri, namstig, hlekkur, departmentId) VALUES ('${row[0]}', '${slug}', '${row[1]}', '${row[2]}', '${row[3]}', '${row[4]}', '${row[5]}', ${departmentId})`
  })
  return courseSqlCommands.join(';\n') + ';\n'


}


export function createSQLFile() {
  // Create index
  const index = createIndexSQLFromFile()


  // Hagfræðideild
  const hagfraedi = createCourseSQLFromCsv('./data/hagfraedi.csv', 1)


  // IVT
  const ivt = createCourseSQLFromCsv('./data/ivt.csv', 2)

  // Islenska
  const islenska = createCourseSQLFromCsv('./data/islenska.csv', 3)
  fs.writeFileSync('./sql/insert.sql', index + hagfraedi + ivt + islenska)
}

createSQLFile();

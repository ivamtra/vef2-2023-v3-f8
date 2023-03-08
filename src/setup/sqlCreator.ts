import * as fs from "fs";
import { csvToArray } from "./csvParser.js";
import { slugify } from "../lib/slugify.js";
type Deild = {
  title: string;
  description: string;
  csv: string;
};

type Afangi = {
  numer: string;
  heiti: string;
  einingar: number;
  kennslumiseri: string;
  namstig: string;
  hlekkur: string;
};




export function createIndexSQLFromFile() : string {
  const index: Deild[] = JSON.parse(
    fs.readFileSync("./data/index.json", "utf-8")
  );
  // Bua til sql skipanir
  const indexSql = index.map((section) => {
    const slug = slugify(section.title, '-')
    return `INSERT INTO deild (titill, slug, lysing) VALUES ('${section.title}', '${slug}', '${section.description}')`;
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
  const courseSqlCommands : string[]  = courseArray.map((row, index) => {
    const slug = slugify(row[0], '-')
    return `INSERT INTO afangi (numer, slugNumer, heiti, einingar, kennslumisseri, namstig, hlekkur, deildId) VALUES ('${row[0]}', '${slug}', '${row[1]}', '${row[2]}', '${row[3]}', '${row[4]}', '${row[5]}', '${departmentId}')`
  })
  return courseSqlCommands.join(';\n') + ';\n'


}


// export function createInsertSQLFile() {
// 	const index = dataParse()
// 	console.log(index)
// 	const indexSql = index?.map(section => {
// 		return `INSERT INTO deild (titill, lysing) VALUES ('${section.title}', '${section.description}')`
// 	})
// 	const csv = csvParse()
// 	let ivt
// 	if (csv) {
// 		ivt =  csvArrayToObject(csvToArray(csv))
// 		const deildSQL  = ivt.map(course => {
// 			return `INSERT INTO afangi (numer, heiti, einingar, kennslumisseri, namstig, hlekkur) VALUES (${course.numer}, ${course.heiti}, ${course.einingar}, ${course.kennslumiseri}, ${course.namstig}, ${course.hlekkur})`
// 		})

// 		if (indexSql)
// 			fs.writeFileSync('./sql/insert.sql', `${indexSql?.join(';\n')};`)
// 	}

// }

export function createSQLFile() {
  // Create index
  const index = createIndexSQLFromFile()

  // Hagfræðideild
  const hagfraedi = createCourseSQLFromCsv('./data/hagfraedi.csv', 1)


  // IVT
  const ivt = createCourseSQLFromCsv('./data/ivt.csv', 2)
  fs.writeFileSync('./sql/insert.sql', index + hagfraedi + ivt)
}

createSQLFile();

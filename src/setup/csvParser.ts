import { slugify } from "../lib/slugify.js";
import { Course } from "../types/types.js";

export function deleteRow(arr: string[][], row: number): string[][] {
  const copy = [...arr]; // make copy
  copy.splice(row, 1);
  return copy;
}

export function csvToArray(csv: string) {
  const rows = csv.split("\n");
  let arr = rows.map((row) => row.split(";"));
  console.log()

  // Athuga ef raðir eru löglegar
  // Þ.e. hafa 6 dálka
  const rowsToDelete: Array<number> = [];
  arr.forEach((row, index) => {
    if (row.length !== 6) {
      rowsToDelete.push(index);
    }
  });
 

  // Eyða þeim ef þær passa ekki
  while (rowsToDelete.length > 0) {
    const num = rowsToDelete.pop()
    if (num !== undefined)
      arr = deleteRow(arr, num);
  }

  return arr;
}

// // TODO Unit test
export function arrayToCourse(csvArray: string[][], departmentid: number): Course[] {
  return csvArray.map((row, index) => {
    return {
      id: index,
      number: row[0],
      title: row[1],
      slug: slugify(row[1], '-'),
      semester: 'Vor',
      credits: Number(row[2]),
      level: row[4],
      url: row[5],
      departmentid,
      created: new Date(),
      updated: new Date()
    };
  });
}



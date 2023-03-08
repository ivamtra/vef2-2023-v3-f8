export function deleteRow(arr: string[][], row: number): string[][] {
  const copy = [...arr]; // make copy
  copy.splice(row, 1);
  return copy;
}

export function csvToArray(csv: string) {
  const rows = csv.split("\n");
  let arr = rows.map((row) => row.split(";"));

  // Athuga ef raðir eru löglegar
  // Þ.e. hafa 6 dálka
  const rowsToDelete: number[] | any[] = [];
  arr.forEach((row, index) => {
    if (row.length !== 6) {
      rowsToDelete.push(index);
    }
  });

  // Eyða þeim ef þær passa ekki
  while (rowsToDelete.length > 0) {
    arr = deleteRow(arr, rowsToDelete.pop());
  }

  return arr;
}

// // TODO Unit test
// export function csvArrayToObject(csvArray: string[][]): Afangi[] {
//   return csvArray.map((row) => {
//     return {
//       numer: row[0],
//       heiti: row[1],
//       einingar: row[2],
//       kennslumiseri: row[3],
//       namstig: row[4],
//       hlekkur: row[5],
//     };
//   });
// }

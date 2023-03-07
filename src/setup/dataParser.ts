import * as fs from 'fs'


export type Index  = {
	title: string,
	description: string,
	csv: string
}

export type Afangi = {
	numer: string,
	heiti: string,
	einingar: string,
	kennslumiseri: string,
	namstig: string,
	hlekkur: string

}

export function dataParse(): Array<Index> | null  {
    try {
		const readData = fs.readFileSync('./data/index.json', 'utf8');
		if (readData) {
			const json = JSON.parse(readData)
			console.log(json)
			return json
		}
	} catch (error) {
		console.error(error)
		return null
	}
	return null
}

export function csvParse() {
	const dir = './data'

	const readData = fs.readFileSync('./data/ivt.csv', 'latin1')

	if (readData) {
		return readData
		
	}

	
}

export function deleteRow(arr: string[][], row: number) : string[][] {
    const copy = [...arr]; // make copy
    copy.splice(row, 1);
    return copy;
 }



export function csvToArray(csv : string) {
    const rows = csv.split('\n')
    let arr = rows.map((row) => row.split(';'))
  
    // Athuga ef raðir eru löglegar
    // Þ.e. hafa 6 dálka
    const rowsToDelete : number[] | any[] = [] 
    arr.forEach((row,index) => {
      if (row.length !== 6) {
        rowsToDelete.push(index)
      }
    })
    
    // Eyða þeim ef þær passa ekki
    while (rowsToDelete.length > 0) {
		arr = deleteRow(arr, rowsToDelete.pop())
    }
  
    return arr
  }


// TODO Unit test
export function csvArrayToObject(csvArray: string[][]) : Afangi[] {
	return csvArray.map(row => {
		return {
			numer: row[0],
			heiti: row[1],
			einingar: row[2],
			kennslumiseri: row[3],
			namstig: row[4],
			hlekkur: row[5]
		}
	})


}

export function createInsertSQLFile() {
	const index = dataParse()
	console.log(index)
	const indexSql = index?.map(section => {
		return `INSERT INTO deild (titill, lysing) VALUES ('${section.title}', '${section.description}')`
	})
	// console.log(indexSql)
	const csv = csvParse()
	let ivt
	if (csv) {
		ivt =  csvArrayToObject(csvToArray(csv))
		const deildSQL  = ivt.map(course => {
			
			return `INSERT INTO afangi (numer, heiti, einingar, kennslumisseri, namstig, hlekkur) VALUES (${course.numer}, ${course.heiti}, ${course.einingar}, ${course.kennslumiseri}, ${course.namstig}, ${course.hlekkur})`
		})

		if (indexSql)
			fs.writeFileSync('./sql/insert.sql', `${indexSql?.join(';\n')};`)
		
		

	}
	
}

createInsertSQLFile()
import { readFile } from 'fs/promises';
import { createCourse, createDepartment, createSchema, dropSchema, end, query } from './lib/db.js';
import { createCoursesFromCSV, createDepartmentsFromJson } from './setup/sqlCreator.js';

console.log('hello setup')
async function create() {
  const drop = await dropSchema();

  if (drop) {
    console.info('schema dropped');
  } else {
    console.info('schema not dropped, exiting');
    process.exit(-1);
  }

  const result = await createSchema();

  if (result) {
    console.info('schema created');
  } else {
    console.info('schema not created');
  }
  // createSQLFile()

  const data = await readFile('./sql/insert.sql');
  // const insert = await query(data.toString('utf-8'));
  const departments = createDepartmentsFromJson()
  const hagfraedi = createCoursesFromCSV('./data/hagfraedi.csv', 1)
  const ivt = createCoursesFromCSV('./data/ivt.csv', 2)
  const islenska = createCoursesFromCSV('./data/islenska.csv', 3)

  for (const department of departments) {
    try {
      await createDepartment(department)
      console.info('Department created')
    }
    catch(err) {
      console.info('Department not created')
    } 
  }
  
  for (const course of hagfraedi) {
    try {
      await createCourse(course, 1)
      console.info('course created')
    }
    catch(err) {
      console.info('Course not created')

    }
  }
  for (const course of ivt) {
    try {
      await createCourse(course, 2)
      console.info('course created')
    }
    catch(err) {
      console.info('Course not created')

    }
  }
  for (const course of islenska) {
    try {
      await createCourse(course, 3)
      console.info('course created')
    }
    catch(err) {
      console.info('Course not created')

    }
  }

  // if (insert) {
  //   console.info('data inserted');
  // } else {
  //   console.info('data not inserted');
  // }

  await end();
}

create().catch((err) => {
  console.error('Error creating running setup', err);
});
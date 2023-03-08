import express, { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';
import { catchErrors } from '../lib/catch-errors.js';
import { mapDbDepartmentsToDepartments } from '../model/departments.js';
import { query } from '../lib/db.js';
import { mapDbCoursesToCourses } from '../model/courses.js';



export const departmentRouter = express.Router()


export async function index(req: Request, res: Response, next: NextFunction) {
    const departmentsResult = await query('SELECT * FROM deild;');
  
    const events = mapDbDepartmentsToDepartments(departmentsResult);
  
  
    res.json(events);
  }
  
  export async function event(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params;
    const eventsResult = await query('SELECT * FROM afangi WHERE deildId = $1;', [
      slug,
    ]);
  
    const courses = mapDbCoursesToCourses(eventsResult);
  
    if (!courses) {
      return next();
    }
  
    res.json(courses);
  }
  
  async function patchEvent() {}
  
  async function createEvent(req: Request, res: Response, next: NextFunction) {
    const { title, slug, description } = req.body;
  
    res.json({ title, slug, description });
  }
  
  async function deleteEvent() {}
  
  departmentRouter.get('/', index);
  departmentRouter.get('/:slug', event);
  departmentRouter.patch('/:slug', patchEvent);
  departmentRouter.post('/', createEvent);
  departmentRouter.delete('/:slug', deleteEvent);
  
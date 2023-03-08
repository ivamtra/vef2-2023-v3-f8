import express, { Request, Response} from 'express';
import { departmentRouter } from './department-router.js';
import { courseRouter } from './course-router.js';

export const router = express.Router();


router.use('/department', departmentRouter)
router.use('/course', courseRouter)


router.get('/', (req : Request, res : Response) => {
  return res.json({message: 'Hello'})
});

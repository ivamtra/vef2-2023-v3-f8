import express, { Request, Response } from "express";
import { departmentRouter } from "./department-router.js";

export const router = express.Router();

router.use("/departments", departmentRouter);

router.get("/", (req: Request, res: Response) => {
  return res.json({
    departments: {
      departments: {
        href: "/departments",
        methods: ["GET", "POST"],
      },
      department: {
        href: "/departments/:slug",
        methods: ["GET", "PATCH", "DELETE"],
      },
      courses: {
        href: "/departments/:slug/courses",
        methods: ["GET", "POST"],
      },
      course: {
        href: "/departments/:slug/courses/:courseId",
        methods: ["GET", "PATCH", "DELETE"],
      },
    },
  });
});

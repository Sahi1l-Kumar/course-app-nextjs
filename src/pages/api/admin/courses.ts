import { authenticateAdminMiddleware } from "@/lib/auth";
import { Course } from "@/lib/db";
import connectToDB from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

connectToDB();

const courseInputProps = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(2000),
  price: z.number().nonnegative().finite(),
  imageLink: z.string().min(1),
  published: z.boolean(),
});

export default authenticateAdminMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const courses = await Course.find({});
    res.json({ courses: courses });
  } else {
    const parsedInput = courseInputProps.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(411).json({ error: parsedInput.error });
    }
    const course = parsedInput.data;
    const newCourse = new Course(course);
    await newCourse.save();
    res.status(201).json({ message: "Course created successfully" });
  }
});

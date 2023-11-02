import { authenticateAdminMiddleware } from "@/lib/auth";
import { Course } from "@/lib/db";
import connectToDB from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

connectToDB();

export default authenticateAdminMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { courseId } = req.query;

  if (req.method === "GET") {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ course });
  } else if (req.method === "PUT") {
    const course = await Course.findByIdAndUpdate(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course updated successfully" });
  } else {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  }
});

import { authenticateUserMiddleware } from "@/lib/auth";
import { Course, User } from "@/lib/db";
import connectToDB from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

connectToDB();

export default authenticateUserMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { courseId } = req.query;
  const course = await Course.findById(courseId);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

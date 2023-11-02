import { authenticateUserMiddleware } from "@/lib/auth";
import { Course, User } from "@/lib/db";
import connectToDB from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

connectToDB();

export default authenticateUserMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

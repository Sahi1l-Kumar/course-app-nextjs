import { authenticateUserMiddleware } from "@/lib/auth";
import { Course } from "@/lib/db";
import connectToDB from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

connectToDB();

export default authenticateUserMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

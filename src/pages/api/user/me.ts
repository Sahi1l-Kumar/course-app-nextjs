import { authenticateUserMiddleware } from "@/lib/auth";
import { User } from "@/lib/db";
import connectToDB from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

connectToDB();

export default authenticateUserMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    return res.json({ username: user.username });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

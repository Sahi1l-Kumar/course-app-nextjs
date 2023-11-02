import { authenticateAdminMiddleware } from "@/lib/auth";
import { Admin } from "@/lib/db";
import connectToDB from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

connectToDB();

export default authenticateAdminMiddleware(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const admin = await Admin.findOne({ username: req.user.username });

    if (!admin) {
      return res.status(404).json({ message: "Admin does not exist" });
    }

    return res.json({ username: admin.username });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

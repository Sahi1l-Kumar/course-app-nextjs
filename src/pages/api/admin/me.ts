import { Admin } from "@/lib/db";
import connectToDB from "@/lib/dbConnect";
import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

connectToDB();

const adminSecret = process.env.ADMIN_SECRET || "";

interface jwtPayload {
  username?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = req.cookies;
  const token = cookies.authCookie;

  if (!token) {
    return res.status(403).json({ message: "authCookie not found" });
  }

  try {
    const user = verify(token, adminSecret) as jwtPayload;

    const admin = await Admin.findOne({ username: user.username });

    if (!admin) {
      return res.status(404).json({ message: "Admin does not exist" });
    }

    return res.json({ username: admin.username });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = req.cookies;

  const token = cookies.userAuthCookie;

  if (!token) {
    return res.status(403).json({ message: "Already Logged out" });
  } else {
    const cookie = serialize("userAuthCookie", "", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: -1,
      path: "/",
    });
    res.setHeader("Set-Cookie", cookie);
    res.json({ message: "Successfully logged out" });
  }
}

import { User } from "@/lib/db";
import connectToDB from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

connectToDB();

const userSecret = process.env.USER_SECRET || "";

const signinInputProps = z.object({
  username: z.string().email().min(1).max(50),
  password: z.string().min(1).max(20),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsedInput = signinInputProps.safeParse(req.body);

  if (!parsedInput.success) {
    res.status(411).json({ error: parsedInput.error });
    return;
  }

  const { username, password } = parsedInput.data;
  const user = await User.findOne({ username, password });

  if (!user) {
    res
      .status(404)
      .json({ message: "User not found or invalid username or password" });
  } else {
    const token = sign({ username, role: "user" }, userSecret, {
      expiresIn: "1d",
    });

    const cookie = serialize("userAuthCookie", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60,
      sameSite: "strict",
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);
    res.json({ message: "Signed in successfully" });
  }
}

import { User } from "@/lib/db";
import connectToDB from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

connectToDB();

const userSecret = process.env.USER_SECRET || "";

const signupInputProps = z.object({
  username: z.string().email().min(1).max(50),
  password: z.string().min(1).max(20),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsedInput = signupInputProps.safeParse(req.body);

  if (!parsedInput.success) {
    return res.status(411).json({ error: parsedInput.error });
  }

  const { username, password } = parsedInput.data;
  const user = await User.findOne({ username });

  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
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
    res.status(201).json({ message: "User created successfully" });
  }
}

import { Admin } from "@/lib/db";
import connectToDB from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

connectToDB();

const adminSecret = process.env.ADMIN_SECRET || "";

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
  const admin = await Admin.findOne({ username });

  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = sign({ username, role: "admin" }, adminSecret, {
      expiresIn: "1d",
    });

    const cookie = serialize("authCookie", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60,
      sameSite: "strict",
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);
    res.json({ message: "Admin created successfully" });
  }
}

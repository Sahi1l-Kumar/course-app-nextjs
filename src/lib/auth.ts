import { verify, Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

type UserData = {
  username: string;
};

declare module "http" {
  interface IncomingMessage {
    user: UserData;
  }
}

export function authenticateAdminMiddleware(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.authCookie as string;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = verify(
        token,
        process.env.ADMIN_SECRET as Secret
      ) as unknown as UserData;

      if (user) {
        req.user = user as UserData;
        return handler(req, res);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}

export function authenticateUserMiddleware(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.authCookie as string;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = verify(
        token,
        process.env.USER_SECRET as Secret
      ) as unknown as UserData;

      if (user) {
        req.user = user as UserData;
        return handler(req, res);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}

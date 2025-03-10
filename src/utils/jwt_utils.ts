import jwt from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";

import { CONFIG } from "../config";
import { IJwtUserObj } from "../models/types/users";
import { prisma } from "../db/prisma";

export const getJwtToken = async (
  data: any,
  expiresIn: any = CONFIG.JWT_DEFAULT_EXPIRY_TIME,
  isRefreshToken: boolean = false
) => {
  console.log(CONFIG.JWT_ACCESS_TOKEN_SECRET);
  const token = jwt.sign(
    data,
    !isRefreshToken
      ? CONFIG.JWT_ACCESS_TOKEN_SECRET
      : (CONFIG.JWT_REFRESH_TOKEN_SECRET as string),
    { expiresIn: expiresIn }
  );

  return token;
};

// Middleware for Express
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["auth-token"];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  console.log("a", (req as any).user);

  if (!(req as any).user) {
    res.sendStatus(403);
    return;
  }

  next();
};

// Middleware for Express
export const getUserByToken = async (
  token: string
): Promise<jwt.VerifyErrors | any> => {
  return new Promise(function (resolve, reject) {
    jwt.verify(
      token,
      CONFIG.JWT_ACCESS_TOKEN_SECRET as string,
      function (err, decode: any) {
        if (err) {
          reject(err);
          return;
        }

        resolve(decode);
      }
    );
  });
};

// Middleware for Express
export const injectUserByToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers["auth-token"] as string;

  if (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        CONFIG.JWT_ACCESS_TOKEN_SECRET,
        async (err: any, user: any) => {
          // if (err) {
          //   return res.status(403).json({ staus: "error", errors: err.message });
          // }

          if (!err) {
            const userObj = await prisma.user.findUnique({
              where: { id: user.userId },
            });

            if (userObj) {
              req.user = userObj;
            }
          }
          resolve(next());
        }
      );
    });
  }

  next();
};

export const decodeJwtToken = async (
  token: string,
  secretKey = CONFIG.JWT_ACCESS_TOKEN_SECRET
): Promise<jwt.VerifyErrors | any> => {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, secretKey, function (err, decode: any) {
      if (err) {
        reject(err);
        return;
      }

      resolve(decode);
    });
  });
};

export const validateRefreshToken = async (
  token: string
): Promise<{ error?: boolean; message?: string; user?: IJwtUserObj }> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      CONFIG.JWT_REFRESH_TOKEN_SECRET as string,
      (err, tokenDetails) => {
        if (err)
          return reject({ error: true, message: "Invalid refresh token" });

        const data = tokenDetails as IJwtUserObj;

        resolve({ user: data });
      }
    );
  });
};

// Middleware for Express
export function permit(...permittedRoles: Array<string>) {
  // return a middleware
  return (request: Request, response: Response, next: NextFunction) => {
    const { user } = request as any;

    if (user && permittedRoles.includes(user.role)) {
      next(); // role is allowed, so continue on the next middleware
    } else {
      response.status(403).json({ errors: "Invalid access" });
    }
  };
}

const verifyToken = async (token: string, key: string) => {
  if (!token) return {};

  return new Promise((resolve, reject) =>
    jwt.verify(token, key, (err, decoded) =>
      err ? reject("Invalid token") : resolve(decoded)
    )
  );
};

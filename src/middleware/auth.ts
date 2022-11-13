import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET as string;
const refreshSecret = process.env.REFRESH_JWT_SECRET as string;
import { UserInstance } from "../model/user";

export async function auth(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    const auth =
      // req.headers["authorization"] || req.headers["Authorization"];
      req.cookies.authorization;
    if (!auth) {
      res.status(401).json({
        Error: "Kindly login from the login page",
      });
    }
    // const token = authorization?.slice(7, authorization.length) as string;
    const token = auth;
    let verified = jwt.verify(token, secret);

    if (!verified) {
      return res.status(401).json({
        Error: "Verification failed, access denied",
      });
    }
    const { id } = verified as { [key: string]: string };

    const user = await UserInstance.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({
        Error: "User verification failed",
      });
    }

    req.user = verified;
    next();
  } catch (error) {
    console.log(error);

    res.status(403).json({
      error,
      Error: "You are not logged in",
    });
  }
}

import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  registerSchema,
  options,
  loginSchema,
  generateToken,
} from "../utils/utils";
import { UserInstance } from "../model/user";
import bcrypt from "bcryptjs";
import { bookInstance } from "../model/book";

export async function RegisterUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = uuidv4();
  try {
    const validationResult = registerSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const duplicatEmail = await UserInstance.findOne({
      where: { email: req.body.email },
    });
    if (duplicatEmail) {
      return res.status(409).json({
        msg: "Email is used, please enter another email",
      });
    }

    const duplicatePhone = await UserInstance.findOne({
      where: { phonenumber: req.body.phonenumber },
    });

    if (duplicatePhone) {
      return res.status(409).json({
        msg: "Phone number is used",
      });
    }
    const passwordHash = await bcrypt.hash(req.body.password, 8);
    const record = await UserInstance.create({
      id: id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      address: req.body.address,
      password: passwordHash,
    });
    res.render("signuprefresh");
  } catch (err) {
    res.status(500).json({
      msg: "failed to register",
      route: "/register",
    });
  }
}

export async function LoginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = uuidv4();
  try {
    const validationResult = loginSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const record = (await UserInstance.findOne({
      where: { email: req.body.email },
      include: [{ model: bookInstance, as: "book" }],
    })) as unknown as { [key: string]: string };

    const { id } = record;
    const token = generateToken({ id });
    const validUser = await bcrypt.compare(req.body.password, record.password);

    if (!validUser) {
      return res.status(401).json({
        message: "Password do not match",
      });
    }

    if (validUser) {
      res.cookie("authorization", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      res.cookie("id", id, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      res.render("dashboard", { record });
    }
  } catch (err) {
    res.status(500).json({
      msg: "failed to login",
      route: "/login",
    });
  }
}

export async function LogoutUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.clearCookie("authorization");
    res.clearCookie("id");
    res.render("logoutrefresh");
  } catch (err) {
    res.status(500).json({
      msg: "failed to logout",
      route: "/logout",
    });
  }
}

export async function defaultView(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.cookies.id;
    const record = (await UserInstance.findOne({
      where: { id: userId },
      include: [{ model: bookInstance, as: "book" }],
    })) as unknown as { [key: string]: string };

    res.render("dashboard", { record });
  } catch (err) {
    res.status(500).json({
      msg: "failed to login",
      route: "/login",
    });
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    const record = await UserInstance.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: bookInstance,
          as: "book",
        },
      ],
    });
    res.status(200).json({
      msg: "You have successfully fetch all books",
      count: record.count,
      record: record.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: "failed to read",
      route: "/read",
    });
  }
}

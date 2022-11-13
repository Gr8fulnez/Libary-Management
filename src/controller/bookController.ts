import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { bookInstance } from "../model/book";
import { UserInstance } from "../model/user";
import {
  createbookSchema,
  options,
  updatebookSchema,
} from "../utils/utils";

export async function createbook(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  const id = uuidv4();
  try {
    const verified = req.user;
    const validationResult = createbookSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const record = await bookInstance.create({
      id,
      ...req.body,
      userId: verified.id,
    });

    res.render("createrefresh");
  } catch (err) {
    res.status(500).json({
      msg: "failed to create",
      route: "/create",
    });
  }
}

export async function getbook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    const record = await bookInstance.findAll({
      limit,
      offset,
      include: [
        {
          model: UserInstance,
          attributes: [
            "id",
            "firstname",
            "lastname",
            "email",
            "phonenumber",
            "address",
          ],
          as: "user",
        },
      ],
    });
    res.render("index", { record });
  } catch (error) {
    res.status(500).json({
      msg: "failed to read",
      route: "/read",
    });
  }
}

export async function getSinglebook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const record = await bookInstance.findOne({ where: { id } });

    res.render("updatebook", { record });
  } catch (error) {
    res.status(500).json({
      msg: "failed to read single book",
      route: "/read/:id",
    });
  }
}

export async function getDeleteSinglebook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const record = await bookInstance.findOne({ where: { id } });
    res.render("deletebook", { record });
  } catch (error) {
    res.status(500).json({
      msg: "failed to read single book",
      route: "/read/:id",
    });
  }
}

export async function updatebook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { title, description, image, price } = req.body;
    const validationResult = updatebookSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    const record = await bookInstance.findOne({ where: { id } });
    if (!record) {
      return res.status(404).json({
        Error: "Cannot find existing book",
      });
    }
    const updatedrecord = await record.update({
      title: title,
      description: description,
      image: image,
      price: price,
    });

    res.render("updaterefresh");
  } catch (error) {
    res.status(500).json({
      msg: "failed to update",
      route: "/update/:id",
    });
  }
}

export async function deletebook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const record = await bookInstance.findOne({ where: { id } });
    if (!record) {
      return res.status(404).json({
        msg: "Cannot find book",
      });
    }
    const deletedRecord = await record.destroy();
    res.render("deleterefresh");
  } catch (error) {
    res.status(500).json({
      msg: "failed to delete",
      route: "/delete/:id",
    });
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletebook = exports.updatebook = exports.getDeleteSinglebook = exports.getSinglebook = exports.getbook = exports.createbook = void 0;
const uuid_1 = require("uuid");
const book_1 = require("../model/book");
const user_1 = require("../model/user");
const utils_1 = require("../utils/utils");
async function createbook(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const verified = req.user;
        const validationResult = utils_1.createbookSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await book_1.bookInstance.create({
            id,
            ...req.body,
            userId: verified.id,
        });
        res.render("createrefresh");
    }
    catch (err) {
        res.status(500).json({
            msg: "failed to create",
            route: "/create",
        });
    }
}
exports.createbook = createbook;
async function getbook(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const record = await book_1.bookInstance.findAll({
            limit,
            offset,
            include: [
                {
                    model: user_1.UserInstance,
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
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.getbook = getbook;
async function getSinglebook(req, res, next) {
    try {
        const { id } = req.params;
        const record = await book_1.bookInstance.findOne({ where: { id } });
        res.render("updatebook", { record });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read single book",
            route: "/read/:id",
        });
    }
}
exports.getSinglebook = getSinglebook;
async function getDeleteSinglebook(req, res, next) {
    try {
        const { id } = req.params;
        const record = await book_1.bookInstance.findOne({ where: { id } });
        res.render("deletebook", { record });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read single book",
            route: "/read/:id",
        });
    }
}
exports.getDeleteSinglebook = getDeleteSinglebook;
async function updatebook(req, res, next) {
    try {
        const { id } = req.params;
        const { title, description, image, price } = req.body;
        const validationResult = utils_1.updatebookSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await book_1.bookInstance.findOne({ where: { id } });
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
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to update",
            route: "/update/:id",
        });
    }
}
exports.updatebook = updatebook;
async function deletebook(req, res, next) {
    try {
        const { id } = req.params;
        const record = await book_1.bookInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                msg: "Cannot find book",
            });
        }
        const deletedRecord = await record.destroy();
        res.render("deleterefresh");
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to delete",
            route: "/delete/:id",
        });
    }
}
exports.deletebook = deletebook;

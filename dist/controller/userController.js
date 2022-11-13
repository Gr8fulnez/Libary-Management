"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.defaultView = exports.LogoutUser = exports.LoginUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const user_1 = require("../model/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const book_1 = require("../model/book");
async function RegisterUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const duplicatEmail = await user_1.UserInstance.findOne({
            where: { email: req.body.email },
        });
        if (duplicatEmail) {
            return res.status(409).json({
                msg: "Email is used, please enter another email",
            });
        }
        const duplicatePhone = await user_1.UserInstance.findOne({
            where: { phonenumber: req.body.phonenumber },
        });
        if (duplicatePhone) {
            return res.status(409).json({
                msg: "Phone number is used",
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await user_1.UserInstance.create({
            id: id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            address: req.body.address,
            password: passwordHash,
        });
        res.render("signuprefresh");
    }
    catch (err) {
        res.status(500).json({
            msg: "failed to register",
            route: "/register",
        });
    }
}
exports.RegisterUser = RegisterUser;
async function LoginUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.loginSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = (await user_1.UserInstance.findOne({
            where: { email: req.body.email },
            include: [{ model: book_1.bookInstance, as: "book" }],
        }));
        const { id } = record;
        const token = (0, utils_1.generateToken)({ id });
        const validUser = await bcryptjs_1.default.compare(req.body.password, record.password);
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
    }
    catch (err) {
        res.status(500).json({
            msg: "failed to login",
            route: "/login",
        });
    }
}
exports.LoginUser = LoginUser;
async function LogoutUser(req, res, next) {
    try {
        res.clearCookie("authorization");
        res.clearCookie("id");
        res.render("logoutrefresh");
    }
    catch (err) {
        res.status(500).json({
            msg: "failed to logout",
            route: "/logout",
        });
    }
}
exports.LogoutUser = LogoutUser;
async function defaultView(req, res, next) {
    try {
        const userId = req.cookies.id;
        const record = (await user_1.UserInstance.findOne({
            where: { id: userId },
            include: [{ model: book_1.bookInstance, as: "book" }],
        }));
        res.render("dashboard", { record });
    }
    catch (err) {
        res.status(500).json({
            msg: "failed to login",
            route: "/login",
        });
    }
}
exports.defaultView = defaultView;
async function getUsers(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const record = await user_1.UserInstance.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: book_1.bookInstance,
                    as: "book",
                },
            ],
        });
        res.status(200).json({
            msg: "You have successfully fetch all books",
            count: record.count,
            record: record.rows,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.getUsers = getUsers;

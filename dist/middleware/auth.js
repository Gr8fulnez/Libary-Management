"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.REFRESH_JWT_SECRET;
const user_1 = require("../model/user");
async function auth(req, res, next) {
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
        let verified = jsonwebtoken_1.default.verify(token, secret);
        if (!verified) {
            return res.status(401).json({
                Error: "Verification failed, access denied",
            });
        }
        const { id } = verified;
        const user = await user_1.UserInstance.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({
                Error: "User verification failed",
            });
        }
        req.user = verified;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(403).json({
            error,
            Error: "You are not logged in",
        });
    }
}
exports.auth = auth;

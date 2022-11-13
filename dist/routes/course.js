"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const bookController_1 = require("../controller/bookController");
router.post("/create", auth_1.auth, bookController_1.createbook);
router.get("/read", bookController_1.getbook);
router.get("/read/:id", bookController_1.getSinglebook);
router.post("/update/:id", auth_1.auth, bookController_1.updatebook);
router.get("/readdelete/:id", auth_1.auth, bookController_1.getDeleteSinglebook);
router.post("/delete/:id", auth_1.auth, bookController_1.deletebook);
exports.default = router;

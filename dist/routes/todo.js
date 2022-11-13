"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const todoController_1 = require("../controller/todoController");
router.post('/create', auth_1.auth, todoController_1.Todos);
router.get('/read', todoController_1.getTodos);
router.get('/read/:id', todoController_1.getSingleTodo);
router.patch('/update/:id', auth_1.auth, todoController_1.updateTodos);
router.delete('/delete/:id', auth_1.auth, todoController_1.deleteTodos);
exports.default = router;

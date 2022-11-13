"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodos = exports.updateTodos = exports.getSingleTodo = exports.getTodos = exports.Todos = void 0;
const uuid_1 = require("uuid");
const todo_1 = require("../model/todo");
const user_1 = require("../model/user");
const utils_1 = require("../utils/utils");
async function Todos(req, res, next) {
    const id = (0, uuid_1.v4)();
    // let todo = {...req.body, id}
    try {
        const verified = req.user;
        const validationResult = utils_1.createTodoSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await todo_1.TodoInstance.create({
            id,
            ...req.body,
            userId: verified.id,
        });
        res.status(201).json({
            msg: "You have successfully created a todo",
            record,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: "failed to create",
            route: "/create",
        });
    }
}
exports.Todos = Todos;
async function getTodos(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await TodoInstance.findAll({where: {},limit, offset})
        const record = await todo_1.TodoInstance.findAndCountAll({ limit, offset,
            include: [{
                    model: user_1.UserInstance,
                    attributes: ['id', 'firstname', 'lastname', 'email', 'phonenumber'],
                    as: 'user'
                }
            ]
        });
        res.status(200).json({
            msg: "You have successfully fetch all todos",
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
exports.getTodos = getTodos;
async function getSingleTodo(req, res, next) {
    try {
        const { id } = req.params;
        const record = await todo_1.TodoInstance.findOne({ where: { id } });
        return res.status(200).json({
            msg: "Successfully gotten user information",
            record,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read single todo",
            route: "/read/:id",
        });
    }
}
exports.getSingleTodo = getSingleTodo;
async function updateTodos(req, res, next) {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const validationResult = utils_1.updateTodoSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await todo_1.TodoInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                Error: "Cannot find existing todo",
            });
        }
        const updatedrecord = await record.update({
            title: title,
            completed: completed,
        });
        res.status(200).json({
            msg: "You have successfully updated your todo",
            updatedrecord,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to update",
            route: "/update/:id",
        });
    }
}
exports.updateTodos = updateTodos;
async function deleteTodos(req, res, next) {
    try {
        const { id } = req.params;
        const record = await todo_1.TodoInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                msg: "Cannot find todo",
            });
        }
        const deletedRecord = await record.destroy();
        return res.status(200).json({
            msg: "Todo deleted successfully",
            deletedRecord,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to delete",
            route: "/delete/:id",
        });
    }
}
exports.deleteTodos = deleteTodos;

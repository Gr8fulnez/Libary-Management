"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const book_1 = require("./book");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "first name is required",
            },
            notEmpty: {
                msg: "Please provide a first name",
            },
        },
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "last name is required",
            },
            notEmpty: {
                msg: "Please provide a last name",
            },
        },
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "email is required",
            },
            isEmail: {
                msg: "Please provide a a valid Email",
            },
        },
    },
    phonenumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "phone number is required",
            },
            notEmpty: {
                msg: "Please provide a valid phone number",
            },
        },
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            notNull: {
                msg: "Your address is required",
            },
            notEmpty: {
                msg: "PLease provide a valid address",
            },
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "password is required",
            },
            notEmpty: {
                msg: "Please provide a password",
            },
        },
    },
}, {
    sequelize: database_config_1.default,
    tableName: "user",
});
UserInstance.hasMany(book_1.bookInstance, { foreignKey: "userId", as: "book" });
book_1.bookInstance.belongsTo(UserInstance, { foreignKey: "userId", as: "user" });

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.contentModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
mongoose_1.default.connect('mongodb+srv://sukeerthi9969:sukeerthi9969@brain.75tc8.mongodb.net/');
const userSchema = new mongoose_2.Schema({
    username: { type: String, unique: true },
    password: String
});
exports.userModel = (0, mongoose_2.model)("User", userSchema);
const contentSchema = new mongoose_2.Schema({
    title: String,
    link: String,
    // tags : [{type:mongoose.Types.ObjectId , ref:'Tag'}],
    type: String,
    userid: { type: mongoose_1.default.Types.ObjectId, ref: 'User', require: true }
});
exports.contentModel = (0, mongoose_2.model)('Content', contentSchema);
// Mongoose is a library that provides a schema-based solution for modeling application data
const LinkSchema = new mongoose_2.Schema({
    // 'hash' is a string that represents the shortened or hashed version of a link
    hash: String,
    // 'userId' is a reference to the 'User' collection in the database.
    // It uses Mongoose's ObjectId type for relational data.
    // The 'ref' property specifies the referenced collection name ('User').
    // The 'required' property ensures this field must be provided when creating a document.
    // The 'unique' property enforces that each 'userId' in this collection is unique.
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true, unique: true },
});
// Exporting the LinkModel based on the LinkSchema
// The model represents the 'Links' collection in the database
exports.LinkModel = (0, mongoose_2.model)("Links", LinkSchema);

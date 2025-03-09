import mongoose from "mongoose";

import { model,Schema } from "mongoose";

mongoose.connect('mongodb+srv://sukeerthi9969:sukeerthi9969@brain.75tc8.mongodb.net/')

const userSchema =  new Schema({
    username : {type: String , unique: true},
    password : String
})

export const userModel = model("User", userSchema)

const contentSchema = new Schema({
    title: String,
    link : String,
    // tags : [{type:mongoose.Types.ObjectId , ref:'Tag'}],
    type:String,
    userid : {type:mongoose.Types.ObjectId , ref:'User' , require :true}
})

export const contentModel = model('Content' , contentSchema)

// Mongoose is a library that provides a schema-based solution for modeling application data
const LinkSchema = new Schema({
    // 'hash' is a string that represents the shortened or hashed version of a link
    hash: String,

    // 'userId' is a reference to the 'User' collection in the database.
    // It uses Mongoose's ObjectId type for relational data.
    // The 'ref' property specifies the referenced collection name ('User').
    // The 'required' property ensures this field must be provided when creating a document.
    // The 'unique' property enforces that each 'userId' in this collection is unique.
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
});

// Exporting the LinkModel based on the LinkSchema
// The model represents the 'Links' collection in the database
export const LinkModel = model("Links", LinkSchema);
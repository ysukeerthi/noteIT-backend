"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*", // Allows all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));
const signupSchema = zod_1.default.object({
    username: zod_1.default.string().min(3),
    password: zod_1.default.string().min(6)
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = signupSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Incorrect inputs" });
        }
        const { username, password } = parsed.data;
        const existingUser = yield db_1.userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                message: "Email/username already taken"
            });
        }
        // Create the user in DB
        const newUser = yield db_1.userModel.create({ username, password });
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, config_1.JWT_SECRET, { expiresIn: "1h" });
        // Send response with token
        res.status(200).json({
            message: "User signed up successfully",
            token // ✅ Return token to frontend
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}));
const signinBody = zod_1.default.object({
    username: zod_1.default.string().min(3),
    password: zod_1.default.string().min(6)
});
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const username = req.body.username;
    // const password = req.body.password
    const { success, data } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / invalid inputs"
        });
    }
    const existingUser = yield db_1.userModel.findOne({
        username: req.body.username,
        password: req.body.password
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, config_1.JWT_SECRET);
        res.json({
            token
        });
    }
    else {
        res.status(411).json({
            message: "incorrect credentials"
        });
    }
}));
// const contentBody = zod.object({
//     title:zod.string().min(3),
//     link:zod.string()
// })
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    yield db_1.contentModel.create({
        title,
        link,
        type,
        userid: req.userId,
        // tags:[]
    });
    res.json({
        message: "content added"
    });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield db_1.contentModel.find({
        userid: userId,
    }).populate("userid", "username");
    res.json({
        content
    });
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield db_1.contentModel.deleteOne({
        userid: req.userId,
        contentId
    });
    res.json({
        message: "content deleted"
    });
}));
// Route 6: Share Content Link
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    if (share) {
        // Check if a link already exists for the user.
        const existingLink = yield db_1.LinkModel.findOne({ userId: req.userId });
        if (existingLink) {
            res.json({ hash: existingLink.hash }); // Send existing hash if found.
            return;
        }
        // Generate a new hash for the shareable link.
        const hash = (0, utils_1.random)(10);
        yield db_1.LinkModel.create({ userId: req.userId, hash });
        res.json({ hash }); // Send new hash in the response.
    }
    else {
        // Remove the shareable link if share is false.
        yield db_1.LinkModel.deleteOne({ userId: req.userId });
        res.json({ message: "Removed link" }); // Send success response.
    }
}));
// Route 7: Get Shared Content
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    // Find the link using the provided hash.
    const link = yield db_1.LinkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" }); // Send error if not found.
        return;
    }
    // Fetch content and user details for the shareable link.
    const content = yield db_1.contentModel.find({ userId: link.userId });
    const user = yield db_1.userModel.findOne({ _id: link.userId });
    if (!user) {
        res.status(404).json({ message: "User not found" }); // Handle missing user case.
        return;
    }
    res.json({
        username: user.username,
        content
    }); // Send user and content details in response.
}));
// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

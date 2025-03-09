import express from "express"
import { Response,Request } from "express";
import zod from "zod"
import jwt, { TokenExpiredError } from "jsonwebtoken"
import { contentModel, LinkModel, userModel } from "./db";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors"





const app = express();


app.use(express.json());
app.use(cors({
    origin: "*", // Allows all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));

const signupSchema = zod.object({
    username : zod.string().min(3),
    password : zod.string().min(6)
})

app.post("/api/v1/signup", async (req: any, res: any) => {
    try {
        const parsed = signupSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Incorrect inputs" });
        }

        const { username, password } = parsed.data;
        const existingUser = await userModel.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "Email/username already taken"
            });
        }

        // Create the user in DB
        const newUser = await userModel.create({ username, password });

        // Generate a JWT token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

        // Send response with token
        res.status(200).json({
            message: "User signed up successfully",
            token  // ✅ Return token to frontend
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

const signinBody = zod.object({
    username:zod.string().min(3),
    password:zod.string().min(6)

})

app.post("/api/v1/signin", async(req :any , res:any) => {

// const username = req.body.username;
// const password = req.body.password

const {success , data} = signinBody.safeParse(req.body)

if(!success){
    return res.status(411).json({
        message:"Email already taken / invalid inputs"
    })
}

const existingUser =await userModel.findOne({
    username:req.body.username,
    password:req.body.password
})

if(existingUser){
    const token = jwt.sign({
        id: existingUser._id
    },JWT_SECRET)

    res.json({
        token
    })

} else{
    res.status(411).json({
        message: "incorrect credentials"
    })
}   
    
    
})

// const contentBody = zod.object({
//     title:zod.string().min(3),
//     link:zod.string()

// })

app.post("/api/v1/content",userMiddleware , async (req:any, res:any) => {
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;

    await contentModel.create({
        title,
        link,
        type,
        userid:req.userId,
        // tags:[]
    })

    res.json({
        message : "content added"
    })




})

app.get("/api/v1/content",userMiddleware ,async (req:any , res:any) => {

    const userId = req.userId;

    const content = await contentModel.find({
        userid:userId,

    }).populate("userid" , "username")

    res.json({
        content
    })
})


app.delete("/api/v1/content",userMiddleware,async(req:any , res:any) => {

    const contentId = req.body.contentId;

    await contentModel.deleteOne({
        userid:req.userId,
        contentId
    })
    res.json({
        message : "content deleted"
    })

    
})

// Route 6: Share Content Link
app.post("/api/v1/brain/share", userMiddleware, async (req:any, res:any) => {
    const { share } = req.body;
    if (share) {
        // Check if a link already exists for the user.
        const existingLink = await LinkModel.findOne({ userId: req.userId });
        if (existingLink) {
            res.json({ hash: existingLink.hash }); // Send existing hash if found.
            return;
        }

        // Generate a new hash for the shareable link.
        const hash = random(10);
        await LinkModel.create({ userId: req.userId, hash });
        res.json({ hash }); // Send new hash in the response.
    } else {
        // Remove the shareable link if share is false.
        await LinkModel.deleteOne({ userId: req.userId });
        res.json({ message: "Removed link" }); // Send success response.
    }
});

// Route 7: Get Shared Content
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    // Find the link using the provided hash.
    const link = await LinkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" }); // Send error if not found.
        return;
    }

    // Fetch content and user details for the shareable link.
    const content = await contentModel.find({ userId: link.userId });
    const user = await userModel.findOne({ _id: link.userId });

    if (!user) {
        res.status(404).json({ message: "User not found" }); // Handle missing user case.
        return;
    }

    res.json({
        username: user.username,
        content
    }); // Send user and content details in response.
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
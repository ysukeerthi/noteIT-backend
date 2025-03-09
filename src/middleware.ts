import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export const userMiddleware = (req: any, res: any, next: NextFunction) => {
    const header = req.headers.authorization;
    
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(403).json({ message: "You are not logged in" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

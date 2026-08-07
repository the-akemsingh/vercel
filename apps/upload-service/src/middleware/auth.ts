import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from 'jsonwebtoken'

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const jwtToken = req.headers.authorization?.split(" ")[1]
        if (!jwtToken) {
            res.status(401).send({
                message: "Unauthorized"
            });
            return;
        }
        const parsedToken = jwt.verify(jwtToken, process.env.JWT_SECRET as string) as JwtPayload;
        const { userId, email } = parsedToken;
        req.userId = userId
        req.email = email
        next();
    } catch (e) {
        console.log("Error in user authentication middlware")
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        return
    }
}
export default authMiddleware
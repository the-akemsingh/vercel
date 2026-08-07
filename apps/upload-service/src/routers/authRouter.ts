import { Router } from "express";
const authRouter = Router();
import jwt from 'jsonwebtoken'
import { OAuth2Client } from "google-auth-library";
import { prisma } from "db/client"
import dotenv from "dotenv";
dotenv.config();

authRouter.post("/", async (req, res) => {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const { token } = req.body;
        if (!token) {
            res.status(400).json({
                message: "Google token is required",
            });
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            res.status(400).json({
                message: "Invalid Google token",
            });
            return;
        }

        const email = payload.email;
        const name = payload.name as string;
        const googleId = payload.sub;

        let user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    googleId,
                },
            });
        }

        const appToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d",
            },
        );
        res.json({
            message: "Login successful",
            token: appToken,
            user: {
                email: user.email,
                id: user.id,
                name: user.name,
                image: payload.picture,
            },
        });
        return;
    } catch (e) {
        console.log("error loggin in user:", e)
        res.sendStatus(500);
        return
    }
})


export default authRouter;

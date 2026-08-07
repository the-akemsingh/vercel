import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GetFileFromS3 } from "./utils/GetProjectFromS3";
dotenv.config();
import { pipeline } from "node:stream/promises";
import mime from "mime-types";

const app = express();
app.use(cors());

app.get("/{*splat}", async (req, res) => {
    try {
        const host = req.hostname;
        const filePath = req.path === "/" ? "index.html" : req.path.slice(1);
        console.log("file name - ", filePath);

        const projectDeploymentId = host.split(".")[0];

        if (!projectDeploymentId) {
            res.status(400).json({
                message: "Missing required argument",
            });
            return;
        }

        const file = await GetFileFromS3(projectDeploymentId, filePath);

        if (!file?.Body) {
            res.sendStatus(404);
            return;
        }

        const type = mime.lookup(filePath) || "application/octet-stream";

        res.setHeader("Content-Type", type);

        await pipeline(file.Body as NodeJS.ReadableStream, res);
    } catch (e) {
        console.log("Error getting the resources", e);
        res.sendStatus(404);
        return;
    }
});

app.listen(process.env.REQUEST_HANDLER_PORT || 3005, () => {
    console.log(`uploader server listening on port ${process.env.PORT || 3005}`);
});

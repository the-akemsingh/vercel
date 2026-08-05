import { Router } from "express";
import simpleGit from 'simple-git'
import path from 'path';
import UploadToS3 from "../utils/UploadToS3";
import { rmSync, statSync, readdirSync } from "node:fs";
import pushToQueue from "../utils/redis";


const uploadeRouter = Router();

uploadeRouter.post("/upload", async (req, res) => {
    try {
        const { projectUrl } = req.body;
        if (!projectUrl) {
            res.status(400).json({
                message: "Missing required argument: projectUrl"
            })
            return;
        }

        //TODO: make it only consists of alphabets
        const projectId = Math.floor(10000 + Math.random() * 90000)
        const basePath = path.join(__dirname, "..", "..", "/projects")
        const projectDir = path.join(basePath, `/${projectId}`)
        const gitClient = simpleGit()

        await gitClient.clone(projectUrl, projectDir);

        const allItems = readdirSync(projectDir, { recursive: true });

        const allFiles = allItems.filter((item) => {
            if ((item as string).startsWith(".git")) return false;
            const absolutePath = path.join(projectDir, item as string)
            return statSync(absolutePath).isFile();
        })

        await Promise.all(
            allFiles.map(async (file) => {
                const filePath = path.join(projectDir, file as string);
                const fileKey = path
                    .relative(basePath, filePath)
                    .replace(/\\/g, "/");

                await UploadToS3(filePath, `input/${fileKey}`);
            })
        );

        rmSync(projectDir, { recursive: true, force: true });

        await pushToQueue("PROJECT_IDS", projectId.toString());
        res.status(200).json({
            projectId
        })
        return;
    } catch (e) {
        console.log("Error occured in upload api route:", e);
    }
})


export default uploadeRouter;
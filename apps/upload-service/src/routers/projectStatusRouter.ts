import { Router } from "express";
const projectRouter = Router()
import simpleGit from 'simple-git'
import path from 'path';
import UploadToS3 from "../utils/UploadToS3";
import { rmSync, statSync, readdirSync } from "node:fs";
import pushToQueue from "../utils/redis";
import { prisma, ProjectStatus } from "db/client";


function generateAlphaId(length = 8) {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
}

projectRouter.post("/upload", async (req, res) => {
    try {
        const { projectUrl } = req.body;
        if (!projectUrl) {
            res.status(400).json({
                message: "Missing required argument: projectUrl"
            })
            return;
        }

        const projectDeploymentId = generateAlphaId(5);

        const newProject = await prisma.project.create({
            data: {
                githubUrl: projectUrl,
                projectDeploymentId: projectDeploymentId,
                userId: req.userId as string
            }
        })
        const basePath = path.join(__dirname, "..", "..", "/projects")
        const projectDir = path.join(basePath, `/${projectDeploymentId}`)
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

        await prisma.project.update({
            where: {
                id: newProject.id,
            },
            data: {
                status: ProjectStatus.SAVED_TO_S3,
            },
        });

        rmSync(projectDir, { recursive: true, force: true });

        await pushToQueue("PROJECT_IDS", projectDeploymentId);
        res.status(200).json({
            projectDeploymentId
        })
        return;
    } catch (e) {
        console.log("Error occured in upload api route:", e);
        res.sendStatus(500);
        return
    }
})

projectRouter.get("/status/:projectDeploymentId", async (req, res) => {
    try {
        const { projectDeploymentId } = req.params
        if (!projectDeploymentId) {
            res.status(400).json({
                message: "Missing required argument: projectDeploymentId"
            })
            return;
        }
        const userProjects = await prisma.user.findUnique({
            where: {
                id: req.userId
            },
            include: { projects: true }
        })
        const isThisUserOwner = userProjects?.projects.some((project) => project.projectDeploymentId === projectDeploymentId) ?? false;
        if (!isThisUserOwner) {
            res.sendStatus(403);
            return;
        }
        const projectStatus = await prisma.project.findUnique({
            where: {
                projectDeploymentId
            }
        })
        res.status(200).send({ status: projectStatus?.status })
    } catch (e) {
        console.log("Error fetching the status of project", e)
        res.sendStatus(500);
        return;
    }
})

projectRouter.get("/all", async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: req.userId
            }
        })
        res.status(200).send({ projects })
    } catch (e) {
        console.log("Error fetching user projects", e)
        res.sendStatus(500);
        return;
    }
})


export default projectRouter;
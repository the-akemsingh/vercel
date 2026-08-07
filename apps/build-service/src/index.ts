import { createClient, type RedisClientType } from "redis"
import dotenv from "dotenv"
import BuildProject from "./utils/BuildProject";
import path from 'path';
import { rmSync } from 'node:fs';
import { DownloadProject } from "./utils/DownloadProject";
import UploadProjectBuildToS3 from "./utils/UploadProjectBuildToS3";
dotenv.config();
import { prisma, ProjectStatus } from 'db/client'

const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
})

await redisClient.connect();

console.log("builder engine is running")

while (1) {
    try{

    const payload: { key: string, element: string } | null = await redisClient.brPop("PROJECT_IDS", 0)

    if (!payload) continue;

    const projectDeploymentId = payload.element
    const basePathForDownloads = path.join(__dirname, "..", "/projects")

    const project = await prisma.project.findUnique({
        where: {
            projectDeploymentId
        }
    })
    if(!project){
        console.log("No project found of id",projectDeploymentId)
        continue;
    }
    console.log("Downloading project")
    await DownloadProject(projectDeploymentId, basePathForDownloads)
    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            status: ProjectStatus.BUILDING,
        },
    });
    console.log("Building project")
    await BuildProject(projectDeploymentId, basePathForDownloads);
    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            status: ProjectStatus.BUILD_COMPLETE,
        },
    });
    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            status: ProjectStatus.DEPLOYING_BUILD,
        },
    });

    console.log("Uploading project")
    await UploadProjectBuildToS3(projectDeploymentId, basePathForDownloads);
    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            status: ProjectStatus.DEPLOYED,
        },
    });

    console.log("Deleting project")
    rmSync(path.join(basePathForDownloads, projectDeploymentId), { recursive: true, force: true });
    }
    catch(e){
        console.log("Error occured in build service",e);
    }
}
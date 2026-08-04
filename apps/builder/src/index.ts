import { createClient, type RedisClientType } from "redis"
import dotenv from "dotenv"
import BuildProject from "./utils/BuildProject";
import path from 'path';
import { rmSync } from 'node:fs';
import { DownloadProject } from "./utils/DownloadProject";
import UploadProjectBuildToS3 from "./utils/UploadProjectBuildToS3";
dotenv.config();

const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
})

await redisClient.connect();

console.log("builder engine is running")

while (1) {
    const payload: { key: string, element: string } | null = await redisClient.brPop("PROJECT_IDS", 0)

    if (!payload) continue;

    const projectId = payload.element
    const basePathForDownloads = path.join(__dirname, "..", "/projects")
    console.log("Downloading project")
    await DownloadProject(projectId, basePathForDownloads)
    console.log("Building project")
    await BuildProject(projectId, basePathForDownloads);
    console.log("Uploading project")
    await UploadProjectBuildToS3(projectId, basePathForDownloads);
    console.log("Deleting project")
    rmSync(path.join(basePathForDownloads, projectId), { recursive: true, force: true });

}
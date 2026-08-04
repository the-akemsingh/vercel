import {
    ListObjectsV2Command,
    GetObjectCommand
} from "@aws-sdk/client-s3";
import path from 'path'
import fs from 'fs'
import { pipeline } from "node:stream/promises";
import { s3Client } from "./S3";


export async function DownloadProject(projectId: string, basePath: string) {
    try {
        const getItemsCommand = new ListObjectsV2Command({
            Bucket: "vercel",
            Prefix: `input/${projectId}`
        })
        const projectItems = await s3Client.send(getItemsCommand)

        const promises = projectItems.Contents?.map(async ({ Key }) => {
            if (!Key) {
                return;
            }
            const finalOutputPath = path.join(basePath, Key.slice(6))

            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true });
            }

            const filetargetLocation = fs.createWriteStream(finalOutputPath);

            const getFileCommand = new GetObjectCommand({
                Bucket: "vercel",
                Key: Key
            })

            const response = await s3Client.send(getFileCommand)
            await pipeline(
                response.Body as NodeJS.ReadableStream,
                filetargetLocation
            )
        }) || []
        await Promise.all(promises)
    } catch (e) {
        console.log("error getting files from s3", e)
    }
}

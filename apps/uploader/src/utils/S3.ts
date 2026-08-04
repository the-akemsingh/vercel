import {
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { readFile } from "node:fs/promises";

const s3Client = new S3Client({
    region:"auto",
    endpoint: process.env.CLOUDFLARE_ENDPOINT as string,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY as string,
    }
});

async function uploadToS3(filePath: string, key: string) {
    try {
        const command = new PutObjectCommand({  
            Bucket: "vercel",
            Key: key,
            Body: await readFile(filePath),
        });
        await s3Client.send(command)
    }
    catch (e) {
        console.log("error uploading to s3", e)
    }
}
export default uploadToS3;
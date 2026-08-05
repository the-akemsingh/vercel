import {
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import { readFile } from "node:fs/promises";
import { s3Client } from "./S3";

async function UploadToS3(filePath: string, key: string) {
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
export default UploadToS3;
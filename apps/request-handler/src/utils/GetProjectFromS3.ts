import {
    GetObjectCommand
} from "@aws-sdk/client-s3";
import { s3Client } from "./S3";

export async function GetFileFromS3(projectId: string, fileName: string) {
    try {
        const key = `output/${projectId}/dist/${fileName}`
        console.log("file key - ", key)
        const getFileCommand = new GetObjectCommand({
            Bucket: "vercel",
            Key: key
        })

        return await s3Client.send(getFileCommand)
    }
    catch (e) {
        console.log("error getting files from s3", e)
    }
}

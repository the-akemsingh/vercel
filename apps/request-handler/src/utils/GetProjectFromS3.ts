import {
    GetObjectCommand
} from "@aws-sdk/client-s3";
import { s3Client } from "./S3";

export async function GetFileFromS3(projectDeploymentId: string, fileName: string) {
    try {
        const key = `output/${projectDeploymentId}/dist/${fileName}`
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

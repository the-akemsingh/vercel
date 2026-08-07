import path from "path";
import { statSync, readdirSync } from "node:fs";
import { UploadToS3 } from "./UploadToS3";

async function UploadProjectBuildToS3(projectDeploymentId: string, basePathForDownloads: string) {
    try {

        const projectBuildPath = path.join(basePathForDownloads, projectDeploymentId, "/dist")
        const allItems = readdirSync(projectBuildPath, { recursive: true })

        const allFiles = allItems.filter((item) => {
            const absolutePath = path.join(projectBuildPath, item as string);
            return statSync(absolutePath).isFile();

        })

        await Promise.all(allFiles.map(async (file) => {
            const filePath = path.join(projectBuildPath, file as string)
            const fileKey = path.relative(basePathForDownloads, filePath).replace(/\\/g, "/");
            await UploadToS3(filePath, `output/${fileKey}`)
        }))

    } catch (e) {
        console.log("error uploading file to s3", e)
    }
}
export default UploadProjectBuildToS3;


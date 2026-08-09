import { exec } from "child_process";
import path from 'path'

async function BuildProject(projectDeploymentId: string, basePathForDownloads: string) {
    return new Promise((resolve) => {
        // const childProcess = exec(`cd ${path.join(basePathForDownloads, projectDeploymentId)} && npm install && npm run build `)
        const childProcess = exec(` docker run --rm -v ${path.join(basePathForDownloads, projectDeploymentId)}:/workspace -w /workspace node:22 sh -c "npm install && npm run build" `)

        childProcess.stdout?.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        childProcess.stderr?.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        childProcess.on("close", () => {
            resolve("")
        })
    })
}
export default BuildProject;
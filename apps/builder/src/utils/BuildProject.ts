import { exec } from "child_process";
import path from 'path'

async function BuildProject(projectId: string, basePathForDownloads: string) {
    return new Promise((resolve) => {
        const childProcess = exec(`cd ${path.join(basePathForDownloads, projectId)} && npm install && npm run build `)

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
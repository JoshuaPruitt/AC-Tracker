import fs from 'fs';
import path from 'path';

export default function loopThroughFiles(directoryPath: string) {
    try {
        const files = fs.readdirSync(directoryPath)

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                console.log("File:", file);
            } else if (stats.isDirectory()) {
                console.log("Directory:", file);
                loopThroughFiles(filePath); // Recursive call for subdirectories
            }
        }

    } catch (err){
        return console.error("Error grabbing files! ", err)
    }
}
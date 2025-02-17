import { useEffect } from "react";
import loopThroughFiles from "./grabData";

let data = 10

export default function DisplayIcons() {
    const directoryPath = '../'

    const grabData = () => {
        const filePaths = loopThroughFiles()
    }

    useEffect(() => {
        grabData()
    }, [])

    return (
        <div>

        </div>
    )
}
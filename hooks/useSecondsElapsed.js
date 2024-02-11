import { useState, useEffect } from "react"

export const useSecondsElapsed = (since) => {
    const [secondsElapsed, setSecondsElapsed] = useState("loading");

    useEffect(() => {
        const referenceDate = new Date(since);
        const referenceTime = referenceDate.getTime();
        const referenceTimeISTOffset = referenceTime + (5.5 * 60 * 60 * 1000);

        const intervalId = setInterval(() => {
            const now = new Date();
            const nowTime = now.getTime();
            const nowTimeISTOffset = nowTime + (5.5 * 60 * 60 * 1000);
            const differenceMilliseconds = nowTimeISTOffset - referenceTimeISTOffset;
            const differenceSeconds = Math.round(differenceMilliseconds / 1000);
            setSecondsElapsed(differenceSeconds);
        }, 1000);

        return () => clearInterval(intervalId)
    }, [])

    return secondsElapsed;
}
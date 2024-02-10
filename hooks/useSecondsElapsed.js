import { useState, useEffect } from "react"

export const useSecondsElapsed = (since) => {
    const [secondsElapsed, setSecondsElapsed] = useState("loading");

    useEffect(() => {
        const referenceDate = new Date(since);
        const intervalId = setInterval(() => {
            const now = new Date();
            const differenceMilliseconds = now.getTime() - referenceDate.getTime();
            const differenceSeconds = Math.round(differenceMilliseconds / 1000);
            setSecondsElapsed(differenceSeconds);
        }, 1000);

        return () => clearInterval(intervalId)
    }, [])

    return secondsElapsed;
}
"use client";
import { useEffect, useState } from "react";

export default function Custom404 () {

  const [_404Display, set404Display] = useState<string>("");
  const [inputDisplay, setInputDisplay] = useState<string>("");
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [hasTyped, setHasTyped] = useState<boolean>(false);

  useEffect(() => {
    const textToStream = "404 This page does not exist...";
    (async () => {
      await new Promise(r => setTimeout(r, 500));
      for (const letter of textToStream) {
        await new Promise(r => setTimeout(r, 30));
        set404Display(prev => prev + letter);
      }
    })();
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => clearInterval(intervalId);
  }, [])

  useEffect(() => {
    const handleKeyDown = () => setHasTyped(true);

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [])

  useEffect(() => {
    if (hasTyped) {
      const textToStream = "Stop typing...";
      (async () => {
        await new Promise(r => setTimeout(r, 1000));
        for (const letter of textToStream) {
          await new Promise(r => setTimeout(r, 30));
          setInputDisplay(prev => prev + letter);
        }
      })();
    }
  }, [hasTyped])

  return (
    <div className={`h-screen w-screen font-terminal bg-life-black text-life-white text-xl flex flex-col justify-center items-center`}>
      {(hasTyped) ? (
        <div>
          <p>{_404Display}</p>
          <p>{inputDisplay}{(showCursor && inputDisplay.length > 0) && "|"}</p>
        </div>
      ) : (
        <div>
          <p>{_404Display}{showCursor && "|"}</p>
        </div>
      )}
    </div>
  )
}
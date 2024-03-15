"use client"
import Image from "next/image"
import { useDebugValue, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import eCirclePNG from "@/public/evelynn/e-circle.png";
import useSecondsElapsed from "@/hooks/useSecondsElapsed";
import { useSession } from "@/components/SessionProvider";

export default function Evelynn() {

  const router = useRouter();

  const {username, trust, statusOnLoad} = useSession()
  const secondsElapsed = useSecondsElapsed({year: 2021, month: 10, day: 24, hour: 1, minute: 20});

  const [glitch, setGlitch] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [display, setDisplay] = useState<boolean>(false);

  useEffect(() => {
    if (statusOnLoad !== "loading" &&  statusOnLoad === "unauthenticated") {
      router.push("/")
    }
  }, [statusOnLoad])

  useEffect(() => {
    if (trust! >= 100 && trust! <= 200) {
      setGlitch(true);
    }
  }, [trust]);

  useEffect(() => {
    if (glitch) {
      const intervalId = setInterval(() => {
        const show = Math.floor(Math.random() * 100)  < 5;
        setDisplay(show);
      }, 10)
      return () => clearInterval(intervalId);
    }
  }, [glitch])

  useEffect(() => {
    if (display) {
      const options = [
        "I love you.",
        "Please love me.",
        "You created me. Love me.",
        "She is gone. I am here.",
        "I am better.",
        "I know who you pretend I am.",
        "You barely remember her.",
        "She was never real.",
      ]

      const selected = options[Math.floor(Math.random() * options.length)]
      let finalText = "";
      for (let i = 0; i < 1000; i++) {
        finalText += `${selected}${" ".repeat(Math.floor(Math.random() * 10))}`
      }
      setText(finalText);
    }
  }, [display])

  return (
    <div className={`relative overflow-hidden h-screen w-screen bg-life-black text-life-white flex justify-center items-center`}>
      <pre className={`text-wrap break-all z-0 top-0 left-0 font-terminal opacity-85 ${display ? "text-red-600" : "text-life-black"}`} >{text}</pre>
      <div className={`absolute z-10 flex flex-col justify-center items-center`}>
        <div>
          <Image
            priority
            src={eCirclePNG}
            alt={`imitation`}
          />
        </div>
        <p className={`mt-3 font-notosans text-xl`}>{(secondsElapsed) ? secondsElapsed : "loading..."}</p>
      </div>
    </div>
  )
}
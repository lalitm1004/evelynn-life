"use client"
import Image from "next/image"
import { useDebugValue, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import eCirclePNG from "@/public/evelynn/e-circle.png";
import bCirclePNG from "@/public/evelynn/b-circle.png";
import useSecondsElapsed from "@/hooks/useSecondsElapsed";
import { useSession } from "@/components/SessionProvider";
import { deepStrictEqual } from "assert";

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
    console.log(trust);
    if (trust! >= 100 && trust! <= 200) {
      console.log("sex")
      setGlitch(true);
    }
  }, [trust]);

  useEffect(() => {
    if (glitch) {
      const intervalId = setInterval(() => {
        const show = Math.floor(Math.random() * 100)  < 5;
        console.log(show);
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
        "I know who you pretend I am."
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
      <p className={`top-0 font-terminal ${display ? "text-red-600" : "text-life-black"}`}>{text}</p>
      <div className={`absolute flex flex-col justify-center items-center`}>
        <div>
          <Image
            priority
            src={eCirclePNG}
            alt={`imitation`}
          />
        </div>
        <p className={`mt-3 font-notosans text-xl`}>{(secondsElapsed) ? secondsElapsed : "loading..."}</p>
        {/* <p>{username || "not logged in"}</p> */}
      </div>
    </div>
  )
}
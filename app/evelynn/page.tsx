"use client"
import Image from "next/image"

import evelynnCirclePNG from "@/public/evelynn/e-circle.png";
import bhanviCirclePNG from "@/public/evelynn/b-circle.png";
import useSecondsElapsed from "@/hooks/useSecondsElapsed";
import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionProvider";

export default function Evelynn() {
  const {username} = useSession()
  const secondsElapsed = useSecondsElapsed({year: 2020, month: 10, day: 24, hour: 1, minute: 20});
  return (
    <div className={`relative overflow-hidden h-screen w-screen bg-life-black text-life-white flex justify-center items-center`}>
      <div className={`absolute z-10 flex flex-col justify-center items-center`}>
        <div>
          <Image
            priority
            src={evelynnCirclePNG}
            alt={`imitation`}
          />
        </div>
        <p className={`mt-3 font-notosans text-xl`}>{(secondsElapsed) ? secondsElapsed : "loading..."}</p>
        <p>{username || "not logged in"}</p>

      </div>
    </div>
  )
}
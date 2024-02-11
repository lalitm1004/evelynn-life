"use client"
import Image from "next/image"

import { useSecondsElapsed } from "@/hooks/useSecondsElapsed"
import evelynnCirclePNG from "@/public/evelynn/e-circle.png"

export default function Evelynn() {
  const secondsElapsed = useSecondsElapsed("2020-10-24T01:20:00Z");
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Image
        src={evelynnCirclePNG}
        alt={"imitation"}
      />
      <p className="m-4">{secondsElapsed}</p>
    </div>
  );
}
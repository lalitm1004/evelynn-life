"use client"
import Image from "next/image"

import { useSecondsElapsed } from "@/hooks/useSecondsElapsed"
import evelynnCirclePNG from "@/public/evelynn/e-circle.png"
// import evelynnSquarePNG from "@/public/evelynn/e-square.png"

export default function Evelynn() {
  const secondsElapsed = useSecondsElapsed("2020-10-24T01:00:00Z");
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Image
      src={evelynnCirclePNG}
      alt={"i miss you"}
      />
      <p>{secondsElapsed}</p>
    </div>
  );
}
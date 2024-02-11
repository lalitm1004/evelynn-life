"use client"
import { useEffect } from "react";

import { Terminal } from "@/providers/fonts";

export default function Custom404() {

  useEffect(() => {

    const handleClick = () => {
      window.close();
    }

    const button = document.getElementById("closepage");
    button.addEventListener("click", handleClick);
    return () => button.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className={`${Terminal.className} h-screen flex justify-center items-center`}>
      <button id="closepage">404 This page does not exist...</button>
    </div>
  )
}
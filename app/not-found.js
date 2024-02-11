import { Terminal } from "@/providers/fonts";

export default function Custom404() {
  return (
    <div className={`${Terminal.className} h-screen flex justify-center items-center`}>
      <a href="/" target="_self">404 This page does not exist...</a>
    </div>
  )
}
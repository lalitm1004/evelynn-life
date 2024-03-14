import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { SessionProvider } from "@/components/SessionProvider";

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const notoSansFont = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-notosans"
})

const terminalFont = localFont({
  src: "../public/fonts/Terminal.ttf",
  variable: "--font-terminal"
})

export const metadata: Metadata = {
  title: "life",
  description: "Dedicated to ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interFont.variable} ${terminalFont.variable} ${notoSansFont.variable}`}>
      <body suppressHydrationWarning={true} className={`${interFont.className}`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

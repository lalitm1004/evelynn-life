"use client";
import { useState, useEffect } from "react";

import { Terminal } from "@/providers/fonts";
import UserInterface from "@/components/UserInterface";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia('(max-width: 767px)'); // Adjust the breakpoint as needed

    const handleMobileChange = (event) => {
      setIsMobile(event.matches);
    };

    mobileMediaQuery.addEventListener('change', handleMobileChange);
    setIsMobile(mobileMediaQuery.matches);

    return () => {
      mobileMediaQuery.removeEventListener('change', handleMobileChange);
    };
  }, [])

  return (
    <main>
      {isMobile ? (
        <div className={`${Terminal.className} h-screen flex justify-center items-center`}>
          <p>
            Mobile devices are not supported...
          </p>
        </div>
      ) : (
      <div className="min-h-screen ">
        <UserInterface
          basePath={'/'}
        />
      </div>)}
    </main>
  );
}

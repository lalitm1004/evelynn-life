"use client";
import { useState, useEffect } from "react";

interface TimeInputs {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const useSecondsElapsed = ({
  year,
  month,
  day,
  hour,
  minute,
}: TimeInputs): number | null => {
  const [elapsed, setElapsed] = useState<number | null>(null);

  useEffect(() => {
    const timestampMs = new Date(
      Date.UTC(year, month - 1, day, hour, minute)
    ).getTime();

    const currentTimeMs = new Date().getTime();
    const secondsElapsed = Math.floor((currentTimeMs - timestampMs) / 1000);
    setElapsed(secondsElapsed);
  }, []);

  useEffect(() => {
    if (elapsed !== null) {
      const intervalId = setInterval(() => {
        setElapsed((prev) => (prev !== null ? prev + 1 : null));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [elapsed]);

  return elapsed;
};

export default useSecondsElapsed;
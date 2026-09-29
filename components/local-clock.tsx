"use client";
import { useEffect, useState } from "react";
import profile from "@/data/profile.json";
export function LocalClock() {
  const [time, setTime] = useState<string>();
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("pt-BR", {
          timeZone: profile.timeZone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <span className="local-clock">{time ?? "--:--:--"}</span>;
}

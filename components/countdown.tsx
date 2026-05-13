"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TRIP_CONFIG } from "@/lib/data";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const difference =
    TRIP_CONFIG.departureDate.getTime() - new Date().getTime();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-sm">
          <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-gradient tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </motion.div>
      <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="flex gap-2 sm:gap-3 md:gap-6 justify-center">
        {["Dni", "Godz", "Min", "Sek"].map((label) => (
          <CountdownUnit key={label} value={0} label={label} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 sm:gap-3 md:gap-6 justify-center">
      <CountdownUnit value={timeLeft.days} label="Dni" />
      <CountdownUnit value={timeLeft.hours} label="Godz" />
      <CountdownUnit value={timeLeft.minutes} label="Min" />
      <CountdownUnit value={timeLeft.seconds} label="Sek" />
    </div>
  );
}

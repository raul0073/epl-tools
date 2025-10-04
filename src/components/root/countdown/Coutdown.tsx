'use client';

import { useEffect, useState } from "react";

interface CountdownProps {
  target: Date | null;
  closedLabel?: string;
}

export const Countdown = ({ target, closedLabel = "Predictions Closed" }: CountdownProps) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!target) return null;

  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return <span className="text-red-500 font-bold">{closedLabel}</span>;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);

  const weeks = totalWeeks;
  const days = totalDays % 7;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  let display = "";
  if (weeks > 0) {
    display = `${weeks}w ${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (days > 0) {
    display = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0) {
    display = `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    display = `${minutes}m ${seconds}s`;
  } else {
    display = `${seconds}s`;
  }

  const localTime = target.toLocaleString("en-GB", {
    timeZone: "Asia/Jerusalem",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <span className="text-xs font-mono text-muted-foreground">
      Closes in <span className="font-semibold">{display}</span> ({localTime} Israel time)
    </span>
  );
};

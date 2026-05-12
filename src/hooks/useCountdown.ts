import { useState, useEffect } from 'react';

export interface Countdown {
  days: number;
  hours: number;
  mins: number;
  secs: number;
  done: boolean;
}

export function useCountdown(targetIso: string): Countdown {
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  return {
    days:  Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins:  Math.floor((diff % 3_600_000) / 60_000),
    secs:  Math.floor((diff % 60_000) / 1_000),
    done:  diff === 0,
  };
}

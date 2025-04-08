import { secondsToMinutes } from "./secondsToMinutes";

export function getStoredTime(key: string, fallback: number): string {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, fallback.toString());
      return secondsToMinutes(fallback);
    }
    return secondsToMinutes(Number(stored));
  }
  
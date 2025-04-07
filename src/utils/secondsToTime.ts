import { zeroLeft } from "./zeroLeft"

export function secondsToTime(time: number): string{
    const hours = zeroLeft(time / 3600)
    const min = zeroLeft((time / 60) % 60)
    const sec = zeroLeft((time % 60) % 60)
    return `${hours}:${min}:${sec}`
}
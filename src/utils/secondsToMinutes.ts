import { zeroLeft } from "./zeroLeft"

export function secondsToMinutes(time: number): string{
    const min = zeroLeft((time / 60) % 60)
    const sec = zeroLeft((time % 60) % 60)
    return `${min}:${sec}`
}
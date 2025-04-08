export function timeTextToSeconds(timeText: string): number {
    const [minutes, seconds] = timeText.split(':').map(Number);
    return (minutes * 60) + seconds;
}
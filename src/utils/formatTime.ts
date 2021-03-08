export default function formatTime(time: Date | string): string {
    if (time instanceof Date) {
        return time.getHours() + ':' + time.getMinutes();
    } else {
        return time.substr(0, 5);
    }
}

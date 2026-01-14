export function currentTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}:00`;
}

export function formatTime(time: string): string {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const date = new Date(0, 0, 0, hours, minutes, seconds);
  return date.toLocaleTimeString();

}

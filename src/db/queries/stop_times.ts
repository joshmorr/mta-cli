import { getDb } from "../connection";
import type { StopTime } from "../models";
import { currentTime } from "../../utils/time";

export function getUpcomingStopTimesForStop(stopId: string, time: string = currentTime(), n: number = 5): StopTime[] {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM stop_times WHERE stop_id = ? AND arrival_time >= ? ORDER BY arrival_time LIMIT ?");
  return stmt.all(stopId, time, n) as StopTime[];
}

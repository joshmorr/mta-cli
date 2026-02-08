import { getDb } from "../connection";
import type { Stop, FeedId } from "../../types/gtfs";

export function getStopById(feedId: FeedId, stopId: string): Stop | null {
  const db = getDb(feedId);
  const stmt = db.prepare("SELECT * FROM stops WHERE stop_id = ?");
  return stmt.get(stopId) as Stop | null;
}

export function getStopByName(feedId: FeedId, name: string): Stop | null {
  const db = getDb(feedId);
  const stmt = db.prepare("SELECT * FROM stops WHERE stop_name = ?");
  return stmt.get(name) as Stop | null;
}

export function searchStopsByName(feedId: FeedId, searchTerm: string): Stop[] {
  const db = getDb(feedId);
  const stmt = db.prepare(
    "SELECT * FROM stops WHERE stop_name LIKE ? ORDER BY stop_name"
  );
  return stmt.all(`%${searchTerm}%`) as Stop[];
}

import { getDb } from "../connection";
import type { Stop } from "../models";

export function getAllStops(): Stop[] {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM stops ORDER BY stop_name");
  return stmt.all() as Stop[];
}

export function getStopById(stopId: string): Stop | null {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM stops WHERE stop_id = ?");
  return stmt.get(stopId) as Stop | null;
}

export function searchStopsByName(searchTerm: string): Stop[] {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM stops WHERE stop_name LIKE ? ORDER BY stop_name"
  );
  return stmt.all(`%${searchTerm}%`) as Stop[];
}

export function getStopsByIds(stopIds: string[]): Stop[] {
  if (stopIds.length === 0) return [];
  
  const db = getDb();
  const placeholders = stopIds.map(() => "?").join(", ");
  const stmt = db.prepare(
    `SELECT * FROM stops WHERE stop_id IN (${placeholders}) ORDER BY stop_name`
  );
  return stmt.all(...stopIds) as Stop[];
}

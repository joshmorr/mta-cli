import { getDb } from "../connection";
import type { Stop } from "../../models/static";

export function getStopById(stopId: string): Stop | null {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM stops WHERE stop_id = ?");
  return stmt.get(stopId) as Stop | null;
}

export function getStopByName(name: string): Stop | null {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM stops WHERE stop_name = ?");
  return stmt.get(name) as Stop | null;
}

export function searchStopsByName(searchTerm: string): Stop[] {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM stops WHERE stop_name LIKE ? ORDER BY stop_name"
  );
  return stmt.all(`%${searchTerm}%`) as Stop[];
}

import { getDb } from "../connection";
import type { Route } from "../../models/static";

export function getAllRoutes(): Route[] {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM routes");
  return stmt.all() as Route[];
}

export function getRouteById(routeId: string): Route | null {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM routes WHERE route_id = ?");
  return stmt.get(routeId) as Route | null;
}

export function searchRoutesByName(searchTerm: string): Route[] {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM routes WHERE route_long_name LIKE ? ORDER BY route_long_name"
  );
  return stmt.all(`%${searchTerm}%`) as Route[];
}

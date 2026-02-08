import { getDb } from "../connection";
import type { Route, FeedId } from "../../types/gtfs";

export function getAllRoutes(feedId: FeedId): Route[] {
  const db = getDb(feedId);
  const stmt = db.prepare("SELECT * FROM routes");
  return stmt.all() as Route[];
}

export function getRouteById(feedId: FeedId, routeId: string): Route | null {
  const db = getDb(feedId);
  const stmt = db.prepare("SELECT * FROM routes WHERE route_id = ?");
  return stmt.get(routeId) as Route | null;
}

export function searchRoutesByName(feedId: FeedId, searchTerm: string): Route[] {
  const db = getDb(feedId);
  const stmt = db.prepare(
    "SELECT * FROM routes WHERE route_long_name LIKE ? ORDER BY route_long_name"
  );
  return stmt.all(`%${searchTerm}%`) as Route[];
}

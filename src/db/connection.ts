import { Database } from "bun:sqlite";
import path from "path";
import type { FeedId } from "../types/gtfs";

const dbPool = new Map<string, Database>();

/**
 * Gets a database connection for a specific feed.
 * Connections are pooled and reused across calls.
 */
export function getDb(feedId: FeedId): Database {
  if (!dbPool.has(feedId)) {
    const dbPath = path.join(process.cwd(), "data", `${feedId}.db`);
    dbPool.set(feedId, new Database(dbPath));
  }
  return dbPool.get(feedId)!;
}

/**
 * Closes database connection(s).
 * If feedId is provided, closes only that connection.
 * If no feedId is provided, closes all connections.
 */
export function closeDb(feedId?: FeedId): void {
  if (feedId) {
    const db = dbPool.get(feedId);
    if (db) {
      db.close();
      dbPool.delete(feedId);
    }
  } else {
    // Close all databases
    for (const [id, db] of dbPool.entries()) {
      db.close();
      dbPool.delete(id);
    }
  }
}

/**
 * Returns a list of all currently open database connections.
 */
export function getAllOpenDatabases(): string[] {
  return Array.from(dbPool.keys());
}

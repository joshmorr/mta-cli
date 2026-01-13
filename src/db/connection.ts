import { Database } from "bun:sqlite";
import path from "path";

let dbInstance: Database | null = null;

export function getDb(dbPath?: string): Database {
  if (!dbInstance) {
    const resolvedPath = dbPath || path.join(process.cwd(), "data", "lirr.db");
    dbInstance = new Database(resolvedPath);
  }
  return dbInstance;
}

export function closeDb(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

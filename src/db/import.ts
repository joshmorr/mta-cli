import { Database } from "bun:sqlite";
import { buildSchema } from "./schemas/builder";
import type { FeedId } from "../types/gtfs";

type ParsedData = {
  name: string;
  data: Array<Record<string, string>>;
};

export function importData(parsed: ParsedData[], dbPath: string, feedId: FeedId) {
  // Create a new database instance directly for importing
  // We don't use the pool here because we're doing heavy write operations
  const db = new Database(dbPath);

  // Import data from parsed files with transaction for performance
  db.run("BEGIN TRANSACTION");

  try {
    for (const file of parsed) {
      const tableName = file.name;
      const rows = file.data;
      
      if (rows.length === 0) {
        console.log(`Skipping empty table: ${tableName}`);
        continue;
      }

      const firstRow = rows[0];
      if (!firstRow) continue;

      const csvColumns = Object.keys(firstRow);
      
      // Build schema using hybrid approach (base + feed-specific extensions)
      const { createStatement, indexes } = buildSchema(tableName, feedId, csvColumns);
      
      // Drop existing table and create new one with proper schema
      db.run(`DROP TABLE IF EXISTS ${tableName}`);
      db.run(createStatement);
      
      // Create indexes for performance
      for (const indexStmt of indexes) {
        db.run(indexStmt);
      }

      // Prepare insert statement
      const placeholders = csvColumns.map(() => '?').join(', ');
      const columnNames = csvColumns.join(', ');
      
      const insertStmt = db.prepare(
        `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`
      );

      console.log(`Importing ${rows.length} rows into ${tableName}...`);
      
      for (const row of rows) {
        const values = csvColumns.map(col => row[col] || '');
        insertStmt.run(...values);
      }
    }

    db.run("COMMIT");
    console.log("✓ Database import complete!");
  } catch (error) {
    db.run("ROLLBACK");
    console.error("Import failed:", error);
    throw error;
  } finally {
    db.close();
  }
};

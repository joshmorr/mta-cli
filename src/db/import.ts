import { tables } from "./schema";
import { getDb, closeDb } from "./connection";

type ParsedData = {
  name: string;
  data: Array<Record<string, string>>;
};

export function importData(parsed: ParsedData[], dbPath: string) {
  const db = getDb(dbPath);

  // Drop existing tables to ensure clean import
  for (const table of tables) {
    db.run(`DROP TABLE IF EXISTS ${table.name}`);
  }

  // Create tables from schema definitions
  for (const table of tables) {
    db.run(table.schema);
  }

  // Import data from parsed files with transaction for performance
  db.run("BEGIN TRANSACTION");

  try {
    for (const file of parsed) {
      const tableName = file.name;
      const rows = file.data;
      
      if (rows.length === 0) continue;

      const firstRow = rows[0];
      if (!firstRow) continue;

      const columns = Object.keys(firstRow);
      const placeholders = columns.map(() => '?').join(', ');
      const columnNames = columns.join(', ');
      
      const insertStmt = db.prepare(
        `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`
      );

      console.log(`Importing ${rows.length} rows into ${tableName}...`);
      
      for (const row of rows) {
        const values = columns.map(col => row[col] || '');
        insertStmt.run(...values);
      }
    }

    db.run("COMMIT");
    console.log("Database import complete!");
  } catch (error) {
    db.run("ROLLBACK");
    console.error("Import failed:", error);
    throw error;
  } finally {
    closeDb();
  }
};

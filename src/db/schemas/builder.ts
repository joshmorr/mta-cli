import { BASE_SCHEMAS, type TableSchema } from "./base";
import { FEED_EXTENSIONS } from "./extensions";

/**
 * Generates a CREATE TABLE statement from CSV column headers (fallback for unknown tables)
 */
function generateDynamicSchema(tableName: string, columns: string[]): string {
  const columnDefs = columns.map(col => `${col} TEXT`).join(',\n    ');

  return `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      ${columnDefs}
    )
  `;
}

/**
 * Builds schema for a table using hybrid approach:
 * - Uses base schema with proper types and constraints where defined
 * - Adds feed-specific extensions
 * - Falls back to dynamic schema for unknown tables
 * - Warns about unexpected columns
 */
export function buildSchema(
  tableName: string,
  feedId: string,
  csvColumns: string[]
): {
  createStatement: string;
  indexes: string[];
} {
  const baseSchema = BASE_SCHEMAS[tableName];
  const feedExtension = FEED_EXTENSIONS[feedId]?.[tableName];

  // If this is a feed-specific table not in base schema (e.g., MNR's notes table)
  if (!baseSchema && feedExtension && typeof feedExtension === 'object' && 'core' in feedExtension) {
    const extension = feedExtension as TableSchema;
    const allConstraints = [
      ...extension.core,
      ...(extension.foreignKeys || [])
    ].join(',\n      ');

    return {
      createStatement: `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      ${allConstraints}
    )
  `,
      indexes: extension.indexes || []
    };
  }

  // If no base schema exists, fall back to dynamic
  if (!baseSchema) {
    console.warn(`No schema definition for table: ${tableName}, using dynamic schema`);
    return {
      createStatement: generateDynamicSchema(tableName, csvColumns),
      indexes: []
    };
  }

  // Build schema from base + extensions
  let columns = [...baseSchema.core];

  // Add feed-specific column extensions if they exist
  if (feedExtension && Array.isArray(feedExtension)) {
    columns = [...columns, ...feedExtension];
  }

  // Check for CSV columns not in our schema definition
  const definedColumns = columns.map(c => c.split(' ')[0].toLowerCase());
  const additionalColumns = csvColumns
    .filter(col => !definedColumns.includes(col.toLowerCase()))
    .map(col => `${col} TEXT`);

  if (additionalColumns.length > 0) {
    console.warn(
      `⚠️  Additional columns found in ${tableName} for ${feedId}:`,
      additionalColumns.map(c => c.split(' ')[0])
    );
    columns = [...columns, ...additionalColumns];
  }

  // Combine columns and foreign keys
  const allConstraints = [
    ...columns,
    ...(baseSchema.foreignKeys || [])
  ].join(',\n      ');

  return {
    createStatement: `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      ${allConstraints}
    )
  `,
    indexes: baseSchema.indexes || []
  };
}

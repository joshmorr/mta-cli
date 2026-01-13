export type TableDefinition = {
  name: string;
  schema: string;
};

export const tables: TableDefinition[] = [
  {
    name: "routes",
    schema: `
      CREATE TABLE IF NOT EXISTS routes (
        route_id TEXT PRIMARY KEY,
        route_long_name TEXT,
        route_type TEXT,
        route_color TEXT,
        route_text_color TEXT
      )
    `,
  },
  {
    name: "stops",
    schema: `
      CREATE TABLE IF NOT EXISTS stops (
        stop_id TEXT PRIMARY KEY,
        stop_code TEXT,
        stop_name TEXT,
        stop_lat TEXT,
        stop_lon TEXT,
        stop_url TEXT,
        wheelchair_boarding TEXT
      )
    `,
  },
  {
    name: "trips",
    schema: `
      CREATE TABLE IF NOT EXISTS trips (
        route_id TEXT,
        service_id TEXT,
        trip_id TEXT PRIMARY KEY,
        trip_headsign TEXT,
        trip_short_name TEXT,
        direction_id TEXT,
        shape_id TEXT,
        peak_offpeak TEXT
      )
    `,
  },
  {
    name: "stop_times",
    schema: `
      CREATE TABLE IF NOT EXISTS stop_times (
        trip_id TEXT,
        arrival_time TEXT,
        departure_time TEXT,
        stop_id TEXT,
        stop_sequence TEXT,
        pickup_type TEXT,
        drop_off_type TEXT
      )
    `,
  },
  {
    name: "calendar_dates",
    schema: `
      CREATE TABLE IF NOT EXISTS calendar_dates (
        service_id TEXT,
        date TEXT,
        exception_type TEXT
      )
    `,
  },
  {
    name: "transfers",
    schema: `
      CREATE TABLE IF NOT EXISTS transfers (
        from_stop_id TEXT,
        to_stop_id TEXT,
        from_trip_id TEXT,
        to_trip_id TEXT,
        transfer_type TEXT,
        min_transfer_time TEXT
      )
    `,
  }
];

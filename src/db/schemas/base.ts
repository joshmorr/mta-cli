/**
 * Base GTFS schema definitions with proper types and constraints
 * These represent the core columns common across all feeds
 */

export interface TableSchema {
  core: string[];
  indexes?: string[];
  foreignKeys?: string[];
}

export const BASE_SCHEMAS: Record<string, TableSchema> = {
  agency: {
    core: [
      'agency_id TEXT',
      'agency_name TEXT NOT NULL',
      'agency_url TEXT',
      'agency_timezone TEXT',
      'agency_lang TEXT',
      'agency_phone TEXT'
    ]
  },

  calendar_dates: {
    core: [
      'service_id TEXT NOT NULL',
      'date TEXT NOT NULL',
      'exception_type INTEGER NOT NULL'
    ],
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_calendar_dates_service ON calendar_dates(service_id)',
      'CREATE INDEX IF NOT EXISTS idx_calendar_dates_date ON calendar_dates(date)'
    ]
  },

  feed_info: {
    core: [
      'feed_publisher_name TEXT',
      'feed_publisher_url TEXT',
      'feed_timezone TEXT',
      'feed_lang TEXT',
      'feed_version TEXT'
    ]
  },

  routes: {
    core: [
      'route_id TEXT PRIMARY KEY',
      'route_long_name TEXT NOT NULL',
      'route_type INTEGER NOT NULL',
      'route_color TEXT',
      'route_text_color TEXT'
    ],
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_routes_long_name ON routes(route_long_name)'
    ]
  },

  shapes: {
    core: [
      'shape_id TEXT NOT NULL',
      'shape_pt_lat REAL NOT NULL',
      'shape_pt_lon REAL NOT NULL',
      'shape_pt_sequence INTEGER NOT NULL'
    ],
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_shapes_id ON shapes(shape_id)',
      'CREATE INDEX IF NOT EXISTS idx_shapes_sequence ON shapes(shape_id, shape_pt_sequence)'
    ]
  },

  stop_times: {
    core: [
      'trip_id TEXT NOT NULL',
      'arrival_time TEXT',
      'departure_time TEXT',
      'stop_id TEXT NOT NULL',
      'stop_sequence INTEGER NOT NULL',
      'pickup_type INTEGER',
      'drop_off_type INTEGER'
    ],
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_stop_times_trip ON stop_times(trip_id)',
      'CREATE INDEX IF NOT EXISTS idx_stop_times_stop ON stop_times(stop_id)',
      'CREATE INDEX IF NOT EXISTS idx_stop_times_sequence ON stop_times(trip_id, stop_sequence)'
    ],
    foreignKeys: [
      'FOREIGN KEY (trip_id) REFERENCES trips(trip_id)',
      'FOREIGN KEY (stop_id) REFERENCES stops(stop_id)'
    ]
  },

  stops: {
    core: [
      'stop_id TEXT PRIMARY KEY',
      'stop_code TEXT',
      'stop_name TEXT NOT NULL',
      'stop_lat REAL',
      'stop_lon REAL',
      'stop_url TEXT',
      'wheelchair_boarding INTEGER'
    ],
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_stops_name ON stops(stop_name)',
      'CREATE INDEX IF NOT EXISTS idx_stops_location ON stops(stop_lat, stop_lon)'
    ]
  },

  transfers: {
    core: [
      'from_stop_id TEXT NOT NULL',
      'to_stop_id TEXT NOT NULL',
      'from_trip_id TEXT',
      'to_trip_id TEXT',
      'transfer_type INTEGER',
      'min_transfer_time INTEGER'
    ],
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_transfers_from_stop ON transfers(from_stop_id)',
      'CREATE INDEX IF NOT EXISTS idx_transfers_to_stop ON transfers(to_stop_id)'
    ]
  },

  trips: {
    core: [
      'trip_id TEXT PRIMARY KEY',
      'route_id TEXT NOT NULL',
      'service_id TEXT NOT NULL',
      'trip_headsign TEXT',
      'trip_short_name TEXT',
      'direction_id INTEGER',
      'shape_id TEXT',
      'peak_offpeak TEXT'
    ],
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_trips_route ON trips(route_id)',
      'CREATE INDEX IF NOT EXISTS idx_trips_service ON trips(service_id)',
      'CREATE INDEX IF NOT EXISTS idx_trips_headsign ON trips(trip_headsign)'
    ],
    foreignKeys: [
      'FOREIGN KEY (route_id) REFERENCES routes(route_id)'
    ]
  }
};

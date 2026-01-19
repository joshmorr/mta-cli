import type { TableSchema } from "./base";

/**
 * Feed-specific schema extensions for tables that differ from base GTFS spec
 */

export type FeedExtensions = Record<string, string[] | TableSchema>;

export const FEED_EXTENSIONS: Record<string, Record<string, FeedExtensions[string]>> = {
  mnr: {
    routes: [
      'agency_id TEXT',
      'route_short_name TEXT',
      'route_desc TEXT',
      'route_url TEXT'
    ],
    
    stops: [
      'stop_desc TEXT',
      'zone_id TEXT',
      'location_type INTEGER',
      'parent_station TEXT'
    ],
    
    trips: [
      'block_id TEXT',
      'wheelchair_accessible INTEGER'
    ],
    
    stop_times: [
      'track TEXT',
      'note_id TEXT'
    ],
    
    shapes: [
      'shape_dist_traveled REAL'
    ],
    
    transfers: [
      'from_route_id TEXT',
      'to_route_id TEXT'
    ],
    
    // MNR-specific table not in base GTFS
    notes: {
      core: [
        'note_id TEXT PRIMARY KEY',
        'note_mark TEXT',
        'note_title TEXT',
        'note_desc TEXT'
      ],
      indexes: [
        'CREATE INDEX IF NOT EXISTS idx_notes_id ON notes(note_id)'
      ]
    }
  },

  lirr: {
    // LIRR follows standard GTFS more closely, no additional extensions needed
  }
};

// Base GTFS types with proper typing aligned with database schema
export interface Route {
  route_id: string;
  route_long_name: string;
  route_type: number;
  route_color: string;
  route_text_color: string;
  // MNR-specific optional fields
  agency_id?: string;
  route_short_name?: string;
  route_desc?: string;
  route_url?: string;
}

export interface Stop {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  stop_url: string;
  wheelchair_boarding: number;
  // MNR-specific optional fields
  stop_desc?: string;
  zone_id?: string;
  location_type?: number;
  parent_station?: string;
}

export interface Trip {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign: string;
  trip_short_name: string;
  direction_id: number;
  shape_id: string;
  peak_offpeak: string;
  // MNR-specific optional fields
  block_id?: string;
  wheelchair_accessible?: number;
}

export interface StopTime {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: number;
  pickup_type: number;
  drop_off_type: number;
  // MNR-specific optional fields
  track?: string;
  note_id?: string;
}

export interface CalendarDate {
  service_id: string;
  date: string;
  exception_type: number;
}

export interface Transfer {
  from_stop_id: string;
  to_stop_id: string;
  from_trip_id: string;
  to_trip_id: string;
  transfer_type: number;
  min_transfer_time: number;
  // MNR-specific optional fields
  from_route_id?: string;
  to_route_id?: string;
}

export interface Agency {
  agency_id: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang: string;
  agency_phone: string;
}

export interface Shape {
  shape_id: string;
  shape_pt_lat: number;
  shape_pt_lon: number;
  shape_pt_sequence: number;
  // MNR-specific optional fields
  shape_dist_traveled?: number;
}


export interface Note {
  note_id: string;
  note_mark: string;
  note_title: string;
  note_desc: string;
}

// Extended types for joined queries
export interface StopTimeWithDetails extends StopTime {
  stop?: Stop;
}

export interface TripWithRoute extends Trip {
  route?: Route;
}

export enum FeedId {
  LIRR = 'lirr',
  MNR = 'mnr',
}

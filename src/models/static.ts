// Base GTFS types with proper typing aligned with database schema
export interface Route {
  route_id: string;
  route_long_name: string;
  route_type: number;
  route_color: string;
  route_text_color: string;
}

export interface Stop {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  stop_url: string;
  wheelchair_boarding: number;
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
}

export interface StopTime {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: number;
  pickup_type: number;
  drop_off_type: number;
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
}

// MNR-specific types
export interface MNRRoute extends Route {
  agency_id: string;
  route_short_name: string;
  route_desc: string;
  route_url: string;
}

export interface MNRStop extends Stop {
  stop_desc: string;
  zone_id: string;
  location_type: number;
  parent_station: string;
}

export interface MNRTrip extends Trip {
  block_id: string;
  wheelchair_accessible: number;
}

export interface MNRStopTime extends StopTime {
  track: string;
  note_id: string;
}

export interface MNRShape extends Shape {
  shape_dist_traveled: number;
}

export interface MNRTransfer extends Transfer {
  from_route_id: string;
  to_route_id: string;
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

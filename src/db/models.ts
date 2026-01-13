export interface Route {
  route_id: string;
  route_long_name: string;
  route_type: string;
  route_color: string;
  route_text_color: string;
}

export interface Stop {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
  stop_url: string;
  wheelchair_boarding: string;
}

export interface Trip {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign: string;
  trip_short_name: string;
  direction_id: string;
  shape_id: string;
  peak_offpeak: string;
}

export interface StopTime {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: string;
  pickup_type: string;
  drop_off_type: string;
}

export interface CalendarDate {
  service_id: string;
  date: string;
  exception_type: string;
}

export interface Transfer {
  from_stop_id: string;
  to_stop_id: string;
  from_trip_id: string;
  to_trip_id: string;
  transfer_type: string;
  min_transfer_time: string;
}

// Extended types for joined queries
export interface StopTimeWithDetails extends StopTime {
  stop?: Stop;
}

export interface TripWithRoute extends Trip {
  route?: Route;
}

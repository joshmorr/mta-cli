import { getDb } from "../connection";
import type { Trip, StopTime, StopTimeWithDetails } from "../models";

export function getTripById(tripId: string): Trip | null {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM trips WHERE trip_id = ?");
  return stmt.get(tripId) as Trip | null;
}

export function getTripsByRoute(routeId: string): Trip[] {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM trips WHERE route_id = ? ORDER BY trip_headsign, trip_short_name"
  );
  return stmt.all(routeId) as Trip[];
}

export function getStopTimesForTrip(tripId: string): StopTimeWithDetails[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT 
      st.trip_id,
      st.arrival_time,
      st.departure_time,
      st.stop_id,
      st.stop_sequence,
      st.pickup_type,
      st.drop_off_type,
      s.stop_code,
      s.stop_name,
      s.stop_lat,
      s.stop_lon,
      s.stop_url,
      s.wheelchair_boarding
    FROM stop_times st
    LEFT JOIN stops s ON st.stop_id = s.stop_id
    WHERE st.trip_id = ?
    ORDER BY CAST(st.stop_sequence AS INTEGER)
  `);
  
  const results = stmt.all(tripId) as any[];
  
  return results.map((row) => ({
    trip_id: row.trip_id,
    arrival_time: row.arrival_time,
    departure_time: row.departure_time,
    stop_id: row.stop_id,
    stop_sequence: row.stop_sequence,
    pickup_type: row.pickup_type,
    drop_off_type: row.drop_off_type,
    stop: {
      stop_id: row.stop_id,
      stop_code: row.stop_code,
      stop_name: row.stop_name,
      stop_lat: row.stop_lat,
      stop_lon: row.stop_lon,
      stop_url: row.stop_url,
      wheelchair_boarding: row.wheelchair_boarding,
    },
  }));
}

export function getUpcomingTripsAtStop(stopId: string, time: string = "00:00:00"): StopTimeWithDetails[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT 
      st.trip_id,
      st.arrival_time,
      st.departure_time,
      st.stop_id,
      st.stop_sequence,
      st.pickup_type,
      st.drop_off_type,
      s.stop_code,
      s.stop_name,
      s.stop_lat,
      s.stop_lon,
      s.stop_url,
      s.wheelchair_boarding
    FROM stop_times st
    LEFT JOIN stops s ON st.stop_id = s.stop_id
    WHERE st.stop_id = ? AND st.departure_time >= ?
    ORDER BY st.departure_time
    LIMIT 20
  `);
  
  const results = stmt.all(stopId, time) as any[];
  
  return results.map((row) => ({
    trip_id: row.trip_id,
    arrival_time: row.arrival_time,
    departure_time: row.departure_time,
    stop_id: row.stop_id,
    stop_sequence: row.stop_sequence,
    pickup_type: row.pickup_type,
    drop_off_type: row.drop_off_type,
    stop: {
      stop_id: row.stop_id,
      stop_code: row.stop_code,
      stop_name: row.stop_name,
      stop_lat: row.stop_lat,
      stop_lon: row.stop_lon,
      stop_url: row.stop_url,
      wheelchair_boarding: row.wheelchair_boarding,
    },
  }));
}

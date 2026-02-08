import { getStopById, getStopByName, searchStopsByName } from "../db/repositories/stops.repository";
import { FeedId } from "../types/gtfs";
import type { Stop } from "../types/gtfs";

export default class StopService {
  /**
   * Gets a specific stop by ID from a specific feed
   */
  getStopById(feedId: FeedId, stopId: string): Stop | null {
    return getStopById(feedId, stopId);
  }

  /**
   * Gets a specific stop by exact name from a specific feed
   */
  getStopByName(feedId: FeedId, name: string): Stop | null {
    return getStopByName(feedId, name);
  }

  /**
   * Searches for stops by name within a specific feed
   */
  searchStops(feedId: FeedId, searchTerm: string): Stop[] {
    return searchStopsByName(feedId, searchTerm);
  }

  /**
   * Searches for stops across all available feeds
   */
  searchStopsAcrossFeeds(searchTerm: string): Record<string, Stop[]> {
    const feedIds = Object.values(FeedId) as FeedId[];
    const results: Record<string, Stop[]> = {};
    
    for (const feedId of feedIds) {
      try {
        results[feedId] = searchStopsByName(feedId, searchTerm);
      } catch (error) {
        console.error(`Error searching stops for feed ${feedId}:`, error);
        results[feedId] = [];
      }
    }
    
    return results;
  }

  /**
   * Finds a stop by ID across all feeds
   */
  findStopAcrossFeeds(stopId: string): { feedId: FeedId; stop: Stop } | null {
    const feedIds = Object.values(FeedId) as FeedId[];
    
    for (const feedId of feedIds) {
      try {
        const stop = getStopById(feedId, stopId);
        if (stop) {
          return { feedId, stop };
        }
      } catch (error) {
        // Database might not exist yet, continue searching
        continue;
      }
    }
    
    return null;
  }
}

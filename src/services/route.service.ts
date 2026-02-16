import { getAllRoutes, getRouteById, searchRoutesByName } from "../db/repositories/routes.repository";
import { FeedId } from "../types/gtfs";
import type { Route } from "../types/gtfs";

export default class RouteService {
  /**
   * Gets all routes for a specific feed
   */
  getAllRoutes(feedId: FeedId): Route[] {
    return getAllRoutes(feedId);
  }

  /**
   * Gets a specific route by ID from a specific feed
   */
  getRouteById(feedId: FeedId, routeId: string): Route | null {
    return getRouteById(feedId, routeId);
  }

  /**
   * Searches for routes by name within a specific feed
   */
  searchRoutes(feedId: FeedId, searchTerm: string): Route[] {
    return searchRoutesByName(feedId, searchTerm);
  }

  /**
   * Gets all routes across all available feeds
   */
  getAllRoutesAcrossFeeds(): Record<string, Route[]> {
    const feedIds = Object.values(FeedId) as FeedId[];
    const results: Record<string, Route[]> = {};
    
    for (const feedId of feedIds) {
      try {
        results[feedId] = getAllRoutes(feedId);

      } catch (error) {
        console.error(`Error fetching routes for feed ${feedId}:`, error);
        results[feedId] = [];
      }
    }
    
    return results;
  }

  /**
   * Searches for a route by ID across all feeds
   */
  findRouteAcrossFeeds(routeId: string): { feedId: FeedId; route: Route } | null {
    const feedIds = Object.values(FeedId) as FeedId[];
    
    for (const feedId of feedIds) {
      try {
        const route = getRouteById(feedId, routeId);
        if (route) {
          return { feedId, route };
        }
      } catch (error) {
        // Database might not exist yet, continue searching
        continue;
      }
    }
    
    return null;
  }
}

import feedsConfig from "../../config/feeds.json";
import { FeedId } from "../types/gtfs";

export function getStaticFeedUrl(feed: FeedId) {
  return feedsConfig.baseUrls.static + "/" + feedsConfig.feeds[feed].endpoints.static;
}

export function getRealtimeFeedUrl(feed: FeedId) {
  return feedsConfig.baseUrls.realtime + "/" + feedsConfig.feeds[feed].endpoints.realtime;
}

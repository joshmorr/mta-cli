import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import { FeedId } from "../types/gtfs";
import { getRealtimeFeedUrl, getStaticFeedUrl } from "./urls";

export async function fetchStaticFeed(feed: FeedId) {

  const url = getStaticFeedUrl(feed);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.arrayBuffer();
}

export async function fetchRealtimeData(feed: FeedId) {
  const url = getRealtimeFeedUrl(feed);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  const buf = await res.arrayBuffer();

  return GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buf));
}


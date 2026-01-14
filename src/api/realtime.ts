import GtfsRealtimeBindings from "gtfs-realtime-bindings";

const ALERTS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Flirr-alerts";

export async function getRealtimeData
() {
  const res = await fetch(ALERTS_URL);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  const buf = await res.arrayBuffer();

  const feed =
    GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buf),
    );

  return feed.entity;
}

const entities = await getRealtimeData();

console.log(JSON.stringify(entities, null, 2));


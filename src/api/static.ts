import type { Feed } from "../types";

const BASE_URL = 'https://rrgtfsfeeds.s3.amazonaws.com';

const filenames: Record<Feed, string> = {
  lirr: 'gtfslirr.zip',
  mnr: 'gtfsmnr.zip',
};

export async function getStaticData(feed: Feed) {
  const res = await fetch(`${BASE_URL}/${filenames[feed]}`);

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.arrayBuffer();
}

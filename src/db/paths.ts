import { mkdirSync } from "fs";
import path from "path";
import { dirs } from "xdirs";
import type { FeedId } from "../types/gtfs";

const APP_NAME = "mta-cli";

export function getDbDir(): string {
  const dir = dirs(APP_NAME).data;
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function getDbPath(feedId: FeedId): string {
  return path.join(getDbDir(), `${feedId}.db`);
}

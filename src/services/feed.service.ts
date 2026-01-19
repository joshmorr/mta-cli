import parse from "csv-simple-parser";
import { importData } from "../db/import";
import { unzip } from "../utils/unzip";
import { fetchStaticFeed } from "../api/client";
import { FeedId } from "../models/static";

export default class FeedService {
  /**
   * Updates a single feed by downloading, parsing, and importing the GTFS data
   */
  async updateFeed(feedId: FeedId): Promise<void> {
    const res = await fetchStaticFeed(feedId);
    const unzipped = unzip(Buffer.from(res));
    
    const parsed = unzipped.map(({ name, data }) => {
      return {
        name: name,
        data: parse(data, { header: true }) as Array<Record<string, string>>,
      };
    });

    importData(parsed, `data/${feedId}.db`, feedId);
  }

  /**
   * Updates all available feeds
   */
  async updateAllFeeds(): Promise<void> {
    const feedIds = Object.values(FeedId) as FeedId[];
    for (const feedId of feedIds) {
      await this.updateFeed(feedId);
    }
  }
}

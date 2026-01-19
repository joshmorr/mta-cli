import parse from "csv-simple-parser";
import { importData } from "../db/import";
import { unzip } from "../utils/zip";
import { fetchStaticFeed } from "../api/client";
import { FeedId } from "../types/gtfs";
import type { FeedsConfig } from "../types/feeds";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

export default class FeedService {
  /**
   * Loads the feeds configuration from the config file
   */
  loadFeedsConfig(): FeedsConfig {
    // Get the path to the config file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const configPath = join(__dirname, '../../config/feeds.json');
    
    // Read and parse the feeds configuration
    const configData = readFileSync(configPath, 'utf-8');
    const config: FeedsConfig = JSON.parse(configData);
    
    return config;
  }
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

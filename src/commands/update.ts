import { Command } from "commander";
import FeedService from "../services/feed.service";
import { FeedId } from "../models/static";

interface UpdateOptions {
  feed?: string;
}

export function registerUpdateCommand(program: Command) {
  program
    .command('update')
    .description('Update data')
    .option('--feed <feed>', 'Feed name')
    .action(updateCommand);
}

async function updateCommand(options: UpdateOptions) {
  const feedService = new FeedService();
  
  try {
    if (options.feed) {
      await feedService.updateFeed(options.feed as FeedId);
      console.log(`Successfully updated feed: ${options.feed}`);
    } else {
      await feedService.updateAllFeeds();
      console.log('Successfully updated all feeds');
    }
  } catch (error) {
    console.error('Error updating feeds:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

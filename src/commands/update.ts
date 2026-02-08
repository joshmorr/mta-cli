import { Command } from "commander";
import chalk from "chalk";
import FeedService from "../services/feed.service";
import { FeedId } from "../types/gtfs";

export function registerUpdateCommand(program: Command) {
  program
    .command('update')
    .description('Update feed data')
    .option('--feed <feed>', 'Feed name')
    .action(updateCommand);
}

interface UpdateOptions {
  feed?: string;
}

async function updateCommand(options: UpdateOptions) {
  const feedService = new FeedService();
  
  try {
    if (options.feed) {
      // Validate feed ID
      const feedId = options.feed.toLowerCase() as FeedId;
      if (!Object.values(FeedId).includes(feedId)) {
        console.error(chalk.red(`Invalid feed: ${options.feed}`));
        console.log(`Available feeds: ${Object.values(FeedId).join(', ')}`);
        process.exit(1);
      }
      
      console.log(chalk.blue(`Updating ${feedId} feed...`));
      await feedService.updateFeed(feedId);
      console.log(chalk.green(`✓ Successfully updated feed: ${feedId}`));
    } else {
      console.log(chalk.blue('Updating all feeds...'));
      await feedService.updateAllFeeds();
      console.log(chalk.green('✓ Successfully updated all feeds'));
    }
  } catch (error) {
    console.error(chalk.red('Error updating feeds:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

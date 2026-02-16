import { Command } from "commander";
import chalk from "chalk";
import FeedService from "../services/feed.service";
import { Database } from "bun:sqlite";
import { existsSync } from "fs";
import { getDbPath } from "../db/paths";
import { FeedId } from "../types/gtfs";

export function registerFeedsCommands(program: Command) {
  const feedsCommand = program
    .command('feeds')
    .description('Manage static feeds');

  feedsCommand
    .command('list')
    .description('List all feeds')
    .action(listFeeds);
}

/**
 * Get the list of tables from a database file
 */
function getTablesFromDb(dbPath: string): string[] {
  try {
    const db = new Database(dbPath);
    const tables = db.query<{ name: string }, []>(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    ).all();
    db.close();
    return tables.map(t => t.name);
  } catch (error) {
    return [];
  }
}

function isFeedId(value: string): value is FeedId {
  return (Object.values(FeedId) as string[]).includes(value);
}

function listFeeds() {
  try {
    const feedService = new FeedService();
    const config = feedService.loadFeedsConfig();
    
    // Display header
    console.log(chalk.bold.cyan('\nAvailable MTA Feeds:\n'));
    
    // Display each feed
    const feeds = Object.values(config.feeds);
    
    if (feeds.length === 0) {
      console.log(chalk.yellow('No feeds configured.'));
      return;
    }
    
    feeds.forEach((feed, index) => {
      console.log(chalk.bold.white(`${index + 1}. ${feed.name}`));
      console.log(`   ${chalk.gray('ID:')}          ${chalk.green(feed.id)}`);
      console.log(`   ${chalk.gray('Type:')}        ${feed.type}`);
      console.log(`   ${chalk.gray('Description:')} ${feed.description}`);
      console.log(`   ${chalk.gray('URLs:')}`);
      
      // Build full URLs by combining base URLs with endpoints
      const staticUrl = `${config.baseUrls.static}/${feed.endpoints.static}`;
      const realtimeUrl = `${config.baseUrls.realtime}/${feed.endpoints.realtime}`;
      const alertsUrl = `${config.baseUrls.realtime}/${feed.endpoints.alerts}`;
      
      console.log(`     ${chalk.gray('Static:')}    ${staticUrl}`);
      console.log(`     ${chalk.gray('Realtime:')}  ${realtimeUrl}`);
      console.log(`     ${chalk.gray('Alerts:')}    ${alertsUrl}`);
      
      // Check for database and list tables
      if (isFeedId(feed.id)) {
        const dbPath = getDbPath(feed.id);
        if (existsSync(dbPath)) {
          const tables = getTablesFromDb(dbPath);
          if (tables.length > 0) {
            console.log(`   ${chalk.gray('Tables:')}     ${tables.join(', ')}`);
          } else {
            console.log(`   ${chalk.gray('Tables:')}     ${chalk.dim('(no tables)')}`);
          }
        } else {
          console.log(`   ${chalk.gray('Database:')}   ${chalk.yellow('Not downloaded')}`);
        }
      } else {
        console.log(`   ${chalk.gray('Database:')}   ${chalk.red('Unsupported feed ID')}`);
      }
      
      // Add spacing between feeds
      if (index < feeds.length - 1) {
        console.log('');
      }
    });
    
    console.log('');
  } catch (error) {
    console.error(chalk.red('Error reading feeds configuration:'), error);
    process.exit(1);
  }
}

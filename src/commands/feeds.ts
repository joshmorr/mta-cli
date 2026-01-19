import { Command } from "commander";

export function registerFeedsCommands(program: Command) {
  const feedsCommand = program
    .command('feeds')
    .description('Manage MTA feeds');

  feedsCommand
    .command('list')
    .description('List all feeds')
    .action(listFeeds);
}

function listFeeds() {
  console.log('Listing all feeds');
}

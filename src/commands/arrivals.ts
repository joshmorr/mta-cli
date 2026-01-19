import { Command } from "commander";

interface ArrivalsOptions {
  stop?: string;
  route?: string;
  direction?: string;
  limit?: string;
}

export function registerArrivalsCommand(program: Command) {
  program
    .command('arrivals')
    .description('Get arrivals')
    .option('--stop <stop>', 'Stop identifier or name')
    .option('--route <route>', 'Route identifier')
    .option('--direction <direction>', 'Direction (north, south, east, west)')
    .option('--limit <limit>', 'Limit number of results')
    .action(getArrivals);
}

function getArrivals(options: ArrivalsOptions) {
  console.log('Getting arrivals:', options);
}

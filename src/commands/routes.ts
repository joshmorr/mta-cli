import { Command } from "commander";

interface RouteListOptions {
  feed?: string;
}

interface RouteInfoOptions {
  route?: string;
  feed?: string;
}

export function registerRoutesCommands(program: Command) {
  const routesCommand = program
    .command('routes')
    .description('Manage routes');

  routesCommand
    .command('list')
    .description('Get routes for a specific feed')
    .option('--feed <feed>', 'Feed name (e.g., subway)')
    .action(listRoutes);

  routesCommand
    .command('info')
    .description('Get route info')
    .option('--route <route>', 'Route identifier')
    .option('--feed <feed>', 'Feed name')
    .action(getRouteInfo);
}

function listRoutes(options: RouteListOptions) {
  console.log('Listing routes for feed:', options.feed);
}

function getRouteInfo(options: RouteInfoOptions) {
  console.log('Route info:', options.route, 'for feed:', options.feed);
}

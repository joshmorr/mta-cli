import { Command } from "commander";
import chalk from "chalk";
import RouteService from "../services/route.service";
import { FeedId } from "../types/gtfs";
import type { Route } from "../types/gtfs";

interface RouteListOptions {
  feed?: string;
}

interface RouteInfoOptions {
  route?: string;
  feed?: string;
}

const routeService = new RouteService();

/**
 * Colorize text using the route's color
 * @param text - Text to colorize
 * @param routeColor - Hex color code (without #)
 * @param textColor - Optional text color (for contrast)
 * @returns Colorized text
 */
function colorizeRoute(text: string, routeColor?: string, textColor?: string): string {
  if (!routeColor) {
    return text;
  }

  // Ensure the color is a valid 6-character hex code
  const hexColor = routeColor.replace('#', '').padEnd(6, '0').substring(0, 6);
  
  // Use text color if provided, otherwise use white or black based on background brightness
  let fgColor = textColor ? textColor.replace('#', '') : null;
  
  if (!fgColor) {
    // Calculate brightness to determine if we should use white or black text
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Use white text for dark backgrounds, black for light backgrounds
    fgColor = brightness > 128 ? '000000' : 'FFFFFF';
  }
  
  return chalk.hex(`#${hexColor}`)(text);
}

/**
 * Display routes in a tabular format
 */
function displayRoutesTable(routes: Route[], feedId?: string) {
  if (routes.length === 0) {
    console.log('No routes found.');
    return;
  }

  // Calculate column widths based on actual text length
  const idWidth = Math.max(
    'ID'.length,
    ...routes.map(r => r.route_id.length)
  );
  const nameWidth = Math.max(
    'Route Name'.length,
    ...routes.map(r => r.route_long_name.length)
  );

  // Print header
  const headerId = chalk.bold('ID'.padEnd(idWidth));
  const headerName = chalk.bold('Route Name'.padEnd(nameWidth));
  console.log(`  ${headerId}  ${headerName}`);
  
  // Print separator line
  const separator = '─'.repeat(idWidth + nameWidth + 4);
  console.log(chalk.dim(`  ${separator}`));

  // Print each route
  routes.forEach(route => {
    const id = route.route_id.padEnd(idWidth);
    // Add padding around the route name, then colorize
    const paddedName = ` ${route.route_long_name} `.padEnd(nameWidth);
    const coloredName = route.route_color 
      ? colorizeRoute(paddedName, route.route_color, route.route_text_color)
      : paddedName;
    console.log(`  ${id}  ${coloredName}`);
  });
}

export function registerRoutesCommands(program: Command) {
  const routesCommand = program
    .command('routes')
    .description('Manage routes');

  routesCommand
    .command('list')
    .description('Get routes for a specific feed')
    .option('--feed <feed>', 'Feed name (e.g., lirr, mnr)')
    .action(listRoutes);

  routesCommand
    .command('info')
    .description('Get route info')
    .option('--route <route>', 'Route identifier')
    .option('--feed <feed>', 'Feed name (e.g., lirr, mnr)')
    .action(getRouteInfo);
}

function listRoutes(options: RouteListOptions) {
  if (!options.feed) {
    // If no feed specified, show all routes from all feeds
    console.log('Listing routes from all feeds...\n');
    const allRoutes = routeService.getAllRoutesAcrossFeeds();
    
    for (const [feedId, routes] of Object.entries(allRoutes)) {
      console.log(`\n${feedId.toUpperCase()} (${routes.length} routes):`);
      displayRoutesTable(routes, feedId);
    }
    return;
  }

  // Validate feed ID
  const feedId = options.feed.toLowerCase() as FeedId;
  if (!Object.values(FeedId).includes(feedId)) {
    console.error(`Invalid feed: ${options.feed}. Available feeds: ${Object.values(FeedId).join(', ')}`);
    return;
  }

  try {
    const routes = routeService.getAllRoutes(feedId);
    console.log(`\nRoutes for ${feedId.toUpperCase()} (${routes.length} total):\n`);
    displayRoutesTable(routes, feedId);
  } catch (error) {
    console.error(`Error fetching routes for ${feedId}:`, error);
    console.log(`\nTip: Make sure you've downloaded the ${feedId} feed data using: mta update --feed ${feedId}`);
  }
}

function getRouteInfo(options: RouteInfoOptions) {
  if (!options.route) {
    console.error('Please specify a route ID using --route');
    return;
  }

  if (!options.feed) {
    // Search across all feeds
    console.log(`Searching for route ${options.route} across all feeds...\n`);
    const result = routeService.findRouteAcrossFeeds(options.route);
    
    if (result) {
      console.log(`Found in feed: ${result.feedId.toUpperCase()}\n`);
      displayRouteInfo(result.route);
    } else {
      console.log('Route not found in any feed.');
    }
    return;
  }

  // Validate feed ID
  const feedId = options.feed.toLowerCase() as FeedId;
  if (!Object.values(FeedId).includes(feedId)) {
    console.error(`Invalid feed: ${options.feed}. Available feeds: ${Object.values(FeedId).join(', ')}`);
    return;
  }

  try {
    const route = routeService.getRouteById(feedId, options.route);
    if (route) {
      displayRouteInfo(route);
    } else {
      console.log(`Route ${options.route} not found in ${feedId} feed.`);
    }
  } catch (error) {
    console.error(`Error fetching route info:`, error);
    console.log(`\nTip: Make sure you've downloaded the ${feedId} feed data using: mta update --feed ${feedId}`);
  }
}

function displayRouteInfo(route: any) {
  console.log('Route Information:');
  console.log(`  ID: ${route.route_id}`);
  console.log(`  Name: ${route.route_long_name}`);
  if (route.route_short_name) console.log(`  Short Name: ${route.route_short_name}`);
  if (route.route_desc) console.log(`  Description: ${route.route_desc}`);
  console.log(`  Type: ${route.route_type}`);
  if (route.route_color) console.log(`  Color: #${route.route_color}`);
  if (route.agency_id) console.log(`  Agency: ${route.agency_id}`);
}

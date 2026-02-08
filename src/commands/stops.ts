import { Command } from "commander";
import StopService from "../services/stop.service";
import { FeedId } from "../types/gtfs";

interface StopSearchOptions {
  feed?: string;
}

interface StopNearbyOptions {
  lat?: string;
  lon?: string;
  radius?: string;
  feed?: string;
}

interface StopInfoOptions {
  stop?: string;
  feed?: string;
}

const stopService = new StopService();

export function registerStopsCommands(program: Command) {
  const stopsCommand = program
    .command('stops')
    .description('Manage stops');

  stopsCommand
    .command('search')
    .description('Find stops by name')
    .argument('<query>', 'Search query')
    .option('--feed <feed>', 'Feed name (e.g., lirr, mnr)')
    .action(searchStops);

  stopsCommand
    .command('nearby')
    .description('Find stops nearby')
    .option('--lat <lat>', 'Latitude')
    .option('--lon <lon>', 'Longitude')
    .option('--radius <radius>', 'Radius in meters')
    .option('--feed <feed>', 'Feed name (e.g., lirr, mnr)')
    .action(findNearbyStops);

  stopsCommand
    .command('info')
    .description('Get stop info')
    .option('--stop <stop>', 'Stop identifier')
    .option('--feed <feed>', 'Feed name (e.g., lirr, mnr)')
    .action(getStopInfo);
}

function searchStops(query: string, options: StopSearchOptions) {
  if (!options.feed) {
    // Search across all feeds
    console.log(`Searching for stops matching "${query}" across all feeds...\n`);
    const results = stopService.searchStopsAcrossFeeds(query);
    
    for (const [feedId, stops] of Object.entries(results)) {
      if (stops.length > 0) {
        console.log(`\n${feedId.toUpperCase()} (${stops.length} stops):`);
        stops.slice(0, 10).forEach(stop => {
          console.log(`  ${stop.stop_id}: ${stop.stop_name}`);
        });
        if (stops.length > 10) {
          console.log(`  ... and ${stops.length - 10} more`);
        }
      }
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
    const stops = stopService.searchStops(feedId, query);
    console.log(`\nStops matching "${query}" in ${feedId.toUpperCase()} (${stops.length} total):\n`);
    stops.forEach(stop => {
      console.log(`  ${stop.stop_id}: ${stop.stop_name}`);
    });
  } catch (error) {
    console.error(`Error searching stops:`, error);
    console.log(`\nTip: Make sure you've downloaded the ${feedId} feed data using: mta update --feed ${feedId}`);
  }
}

function findNearbyStops(options: StopNearbyOptions) {
  console.log('Finding stops nearby:', options.lat, options.lon, 'radius:', options.radius);
  console.log('Note: Nearby stops feature not yet implemented');
  // TODO: Implement geospatial query using lat/lon
}

function getStopInfo(options: StopInfoOptions) {
  if (!options.stop) {
    console.error('Please specify a stop ID using --stop');
    return;
  }

  if (!options.feed) {
    // Search across all feeds
    console.log(`Searching for stop ${options.stop} across all feeds...\n`);
    const result = stopService.findStopAcrossFeeds(options.stop);
    
    if (result) {
      console.log(`Found in feed: ${result.feedId.toUpperCase()}\n`);
      displayStopInfo(result.stop);
    } else {
      console.log('Stop not found in any feed.');
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
    const stop = stopService.getStopById(feedId, options.stop);
    if (stop) {
      displayStopInfo(stop);
    } else {
      console.log(`Stop ${options.stop} not found in ${feedId} feed.`);
    }
  } catch (error) {
    console.error(`Error fetching stop info:`, error);
    console.log(`\nTip: Make sure you've downloaded the ${feedId} feed data using: mta update --feed ${feedId}`);
  }
}

function displayStopInfo(stop: any) {
  console.log('Stop Information:');
  console.log(`  ID: ${stop.stop_id}`);
  console.log(`  Name: ${stop.stop_name}`);
  if (stop.stop_code) console.log(`  Code: ${stop.stop_code}`);
  if (stop.stop_desc) console.log(`  Description: ${stop.stop_desc}`);
  console.log(`  Location: ${stop.stop_lat}, ${stop.stop_lon}`);
  if (stop.stop_url) console.log(`  URL: ${stop.stop_url}`);
  if (stop.zone_id) console.log(`  Zone: ${stop.zone_id}`);
  console.log(`  Wheelchair Accessible: ${stop.wheelchair_boarding === 1 ? 'Yes' : 'No'}`);
}

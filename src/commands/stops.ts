import { Command } from "commander";

interface StopNearbyOptions {
  lat?: string;
  lon?: string;
  radius?: string;
}

interface StopInfoOptions {
  stop?: string;
}

export function registerStopsCommands(program: Command) {
  const stopsCommand = program
    .command('stops')
    .description('Manage stops');

  stopsCommand
    .command('search')
    .description('Find stops by name')
    .argument('<query>', 'Search query')
    .action(searchStops);

  stopsCommand
    .command('nearby')
    .description('Find stops nearby')
    .option('--lat <lat>', 'Latitude')
    .option('--lon <lon>', 'Longitude')
    .option('--radius <radius>', 'Radius in meters')
    .action(findNearbyStops);

  stopsCommand
    .command('info')
    .description('Get stop info')
    .option('--stop <stop>', 'Stop identifier')
    .action(getStopInfo);
}

function searchStops(query: string) {
  console.log('Searching stops for:', query);
}

function findNearbyStops(options: StopNearbyOptions) {
  console.log('Finding stops nearby:', options.lat, options.lon, 'radius:', options.radius);
}

function getStopInfo(options: StopInfoOptions) {
  console.log('Stop info for:', options.stop);
}

import { Command } from "commander";

interface TripsOptions {
  route?: string;
  direction?: string;
}

interface TripInfoOptions {
  trip?: string;
}

export function registerTripsCommands(program: Command) {
  const tripsCommand = program
    .command('trips')
    .description('Manage trips');

  tripsCommand
    .option('--route <route>', 'Route identifier')
    .option('--direction <direction>', 'Direction')
    .action(listTrips);

  tripsCommand
    .command('info')
    .description('Get trip info')
    .option('--trip <trip>', 'Trip identifier')
    .action(getTripInfo);
}

function listTrips(options: TripsOptions) {
  if (options.route || options.direction) {
    console.log('Getting trips:', options);
  }
}

function getTripInfo(options: TripInfoOptions) {
  console.log('Trip info for:', options.trip);
}

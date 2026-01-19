import { program } from "commander";
import {
  registerFeedsCommands,
  registerRoutesCommands,
  registerStopsCommands,
  registerArrivalsCommand,
  registerTripsCommands,
  registerAlertsCommand,
} from "./commands";

// Register all commands
registerFeedsCommands(program);
registerRoutesCommands(program);
registerStopsCommands(program);
registerArrivalsCommand(program);
registerTripsCommands(program);
registerAlertsCommand(program);

program.parse();

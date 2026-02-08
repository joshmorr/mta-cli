import { program } from "commander";
import {
  registerFeedsCommands,
  registerUpdateCommand,
  registerRoutesCommands,
  registerStopsCommands,
  registerArrivalsCommand,
  registerTripsCommands,
  registerAlertsCommand,
} from "./commands";

// Register all commands
registerFeedsCommands(program);
registerUpdateCommand(program);
registerRoutesCommands(program);
registerStopsCommands(program);
registerArrivalsCommand(program);
registerTripsCommands(program);
registerAlertsCommand(program);

program.parse();

import { program } from "commander";
import {
  registerFeedsCommands,
  registerRoutesCommands,
  registerStopsCommands,
  registerArrivalsCommand,
  registerTripsCommands,
  registerAlertsCommand,
  registerUpdateCommand,
} from "./commands";

// Register all commands
registerFeedsCommands(program);
registerRoutesCommands(program);
registerStopsCommands(program);
registerArrivalsCommand(program);
registerTripsCommands(program);
registerAlertsCommand(program);
registerUpdateCommand(program);

program.parse();

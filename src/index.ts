#!/usr/bin/env bun

import { program } from "commander"; 
import { update } from "./commands/update";
import { routeCommand } from "./commands/route";
import { stopCommand } from "./commands/stop";

program
  .command('update')
  .description('Update the database')
  .action(update);

program
  .command('route')
  .description('Get route info')
  .action(() => routeCommand());

program
  .command('stop')
  .description('Get stop info')
  .argument('<name>', 'Stop name')
  .action((name) => stopCommand(name));

program.parse();

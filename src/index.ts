#!/usr/bin/env bun

import { program } from "commander"; 
import { update } from "./commands/update";
import { routeCommand } from "./commands/route";

program
  .command('update')
  .description('Update the database')
  .action(update);
  
program
.command('route')
  .description('Get route information') 
  .action(() => routeCommand(process.argv.slice(3)));
program.parse(process.argv);

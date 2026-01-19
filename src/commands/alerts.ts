import { Command } from "commander";

interface AlertsOptions {
  feed?: string;
  route?: string;
  stop?: string;
}

export function registerAlertsCommand(program: Command) {
  program
    .command('alerts')
    .description('Get service alerts')
    .option('--feed <feed>', 'Feed name')
    .option('--route <route>', 'Route identifier')
    .option('--stop <stop>', 'Stop identifier')
    .action(getAlerts);
}

function getAlerts(options: AlertsOptions) {
  console.log('Getting alerts:', options);
}

import chalk from "chalk";
import { getAllRoutes } from "../db/queries/routes";

export function routeCommand(args: string[]) {
    if (args.length === 0) {
        const routes = getAllRoutes();
        routes.forEach(route => {
            console.log(`${chalk.hex(route.route_color)(route.route_long_name)}`);
        });
    }
}


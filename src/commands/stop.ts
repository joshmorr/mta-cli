import { getUpcomingStopTimesForStop } from "../db/queries/stop_times";
import { getStopByName } from "../db/queries/stops";
import { formatTime } from "../utils/time";

export function stopCommand(name: string) {
    const stop = getStopByName(name);
    if (!stop) {
        console.error("Stop not found");
        return;
    }
    const stopTimes = getUpcomingStopTimesForStop(stop.stop_id);
    
    console.log(`${stop.stop_name}\n`);
    console.log(`Location: ${stop.stop_lat}, ${stop.stop_lon}\n`);
    console.log('Upcoming departures:');
    stopTimes.forEach(stopTime => {
        console.log(formatTime(stopTime.departure_time));
    });
}

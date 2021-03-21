import { secondsToTime } from '../../core/utils/seconds-to-time';

export function prettyUploadETA(seconds: number) {
    const time = secondsToTime(seconds);
    if ( ! time.seconds) time.seconds = 1;

    // Only display hours and minutes if they are greater than 0 but always
    // display minutes if hours is being displayed
    // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s
    const hoursStr = time.hours ? time.hours + 'h ' : '';
    const minutesVal = time.hours ? ('0' + time.minutes).substr(-2) : time.minutes;
    const minutesStr = minutesVal ? minutesVal + 'm ' : '';
    const secondsVal = minutesVal ? ('0' + time.seconds).substr(-2) : time.seconds;
    const secondsStr = secondsVal + 's';

    return `${hoursStr}${minutesStr}${secondsStr}`;
}



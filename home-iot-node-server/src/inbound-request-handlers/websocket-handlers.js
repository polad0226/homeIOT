import { getAdminHvac, updateAdminHvac } from '../data-access-layer/database-operations.js';
import HVAC from '../models/hvac.js';

export async function handleBidirectionalHvacUpdates(websocket, request) {
    console.log('HVAC websocket connection established...');
    const dbRow = await getAdminHvac();
    const hvac = new HVAC(dbRow['outer_temp'], dbRow['inner_temp'], dbRow['set_temp']);
    websocket.send(JSON.stringify(hvac));

    websocket.emit('connect', 'Just Connected');
    const idealTempInterval = moveTowardIdealTemp(websocket, hvac);
    const gradualTempInterval = interiorTempChange(websocket, hvac);
    
    // When receiving change in set temperature on thermostat.
    websocket.on('message', data => {
        data = JSON.parse(data);
        // console.log(data);
        hvac.currentSetTemp = data.currentSetTemp;

        moveTowardIdealTemp(websocket, hvac);
    });
    
    websocket.on('close', () => {
        if(idealTempInterval)
            clearIntervalAndUpdateDb(idealTempInterval, hvac);

        console.log('Connection Closed!!!!');
    });
}

function moveTowardIdealTemp(websocket, hvac) {
    const intervalId = setInterval(() => {
        // console.log(hvac);
        /**
         * if inner temp is too low
         * else if inner temp is too high
         * else inner temp is within acceptable range.
        */
        if(hvac.innerTemp - hvac.currentSetTemp < -2) {
            hvac.innerTemp += 1;
        } else if(hvac.innerTemp - hvac.currentSetTemp > 2) {
            hvac.innerTemp -= 1;
        } else {
            clearIntervalAndUpdateDb(intervalId, hvac);
            return;
        }

        websocket.send(JSON.stringify(hvac));
    }, 1000);

    return intervalId;
}

export function interiorTempChange(websocket, hvac) {
    const intervalId = setInterval(() => {
        //  For every 10 deg F difference in external temp, interior temp will +/- 2 deg F per hour
        const difference = hvac.innerTemp - hvac.outerTemp;
        if(difference <= -10) {
            const rate = Math.floor(Math.abs(difference) / 10);
            hvac.innerTemp += 2 * rate;
        } else if(difference >= 10) {
            const rate = Math.floor(Math.abs(difference) / 10);
            hvac.innerTemp -= 2 * rate;
        } else {
            return;
        }

        websocket.send(JSON.stringify(hvac));
    }, 6000);

    return intervalId;
}

function clearIntervalAndUpdateDb(intervalId, hvac) {
    clearInterval(intervalId);
    updateAdminHvac(hvac);
}
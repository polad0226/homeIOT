import { Clock } from "../models/clock.js";

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
};

/* let count = 0;
export function countEvent(request, response) {
    response.writeHead(200, headers);

    const intervalId = setInterval(() => {
        const data = `data: ${JSON.stringify(count++)}\n\n`;
        response.write(data);
    }, 3000);

    request.on('close', () => {
        count = 0;
        clearInterval(intervalId);
        console.log('Connection to count closed');
    });
} */

export function tick(request, response) {
    console.log('Connection to clock established...');
    response.writeHead(200, headers);

    const globalClock = Clock.getGlobalClock().getEventEmitter();
    globalClock.on('tick', time => {
        response.write(time);
    });

    request.on('close', () => {
        console.log('Connection to clock closed');
    });
}
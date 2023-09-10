import express from 'express';
import { tick } from './src/inbound-request-handlers/server-sent-events.js';
import { handleBidirectionalHvacUpdates } from './src/inbound-request-handlers/websocket-handlers.js';
import expressWs from 'express-ws';
import { getAllAppliances, getAllWatts, getWatts, turnOnAppliance } from './src/inbound-request-handlers/http-requests.js';
import { createHvacTable, closeDbConnection } from './src/data-access-layer/database-operations.js';

const app = expressWs(express()).app;
const port = 8000;
app.use(express.json());
createHvacTable();

// Http requests
app.get('/appliances', getAllAppliances);
app.head('/appliances/toggle/:id', turnOnAppliance);
app.get('/appliances/watts', getAllWatts);
app.get('/appliances/watts/:id', getWatts);

// Server Sent Events
// app.get('/count', countEvent);
app.get('/clock', tick);

// Websockets
app.ws('/hvac', handleBidirectionalHvacUpdates);

const server = app.listen(port, () => {
    console.log(`NodeJS Express Server is listening on http://localhost:${port}`);
    console.log(`Websocket set up at ws://localhost:${port}\n`);
});

server.on('close', () => {
    console.log('Closing db...');
    closeDbConnection();
});
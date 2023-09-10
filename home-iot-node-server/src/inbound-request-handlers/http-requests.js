import House from "../models/house.js";

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
};

const house = House.getSingleton();
export function getAllAppliances(request, response) {
    const payload = JSON.stringify(house, (key, value) => {
        if(key !== '_intervals')
            return value;

        return undefined;
    });

    response.writeHead(200, headers).end(payload);
}

export function turnOnAppliance(request, response) {
    const applianceId = request.params.id;
    
    const didToggle = house.toggleAppliance(applianceId);
    if(didToggle) {
        response.writeHead(200, headers).end();
    } else {
        response.writeHead(500, headers).end();
    }
}

export function getWatts(request, response) {
    const applianceId = request.params.id;
    const watts = house.getTotalWattsForAppliance(applianceId);
    
    response.set(headers).send(JSON.stringify(watts));
}

export function getAllWatts(request, response) {
    const watts = house.getTotalWatts();
    response.set(headers).send(JSON.stringify(watts));
}
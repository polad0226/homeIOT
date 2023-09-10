
// Weather
// const outerTempCard = 
const outerTempSpan = document.querySelector('.outer-temp');


const innerTempCard = document.querySelector('.inner-temp');
const innerTempSpan = innerTempCard.children[1];

// main thermo
// const thermostatCard = document.querySelector('.set-temp');
const temperatureSpan = document.querySelector('.temperature_hvac')


// const buttonContainer = thermostatCard.children[2];

const upButton = document.querySelector('.plus');
const downButton = document.querySelector('.minus');

const weather = document.querySelector('.degree1');


// const outerTempCard = document.querySelector('.outer-temp');
// const outerTempSpan = outerTempCard.children[1];

// const innerTempCard = document.querySelector('.inner-temp');
// const innerTempSpan = innerTempCard.children[1];

// // const thermostatCard = document.querySelector('.set-temp');
// const temperatureSpan = document.querySelector('.temperature_hvac');


// // const buttonContainer = thermostatCard.children[2];
// const upButton = document.querySelector('.plus');
// const downButton = document.querySelector('.minus');




const hvacUrl = 'ws://localhost:8000/hvac';
const websocket = new WebSocket(hvacUrl);
const setupWebsocketConnection = () => {
    websocket.onopen = event => {
        console.log('Connection opened!!!!!!');
    }

    websocket.onmessage = event => {
        const data = JSON.parse(event.data);

        // console.log(data);
        // outerTempSpan.textContent = data.outerTemp + '°F';
        weather.textContent = parseInt(data.outerTemp);
        innerTempSpan.textContent = data.innerTemp + '°F';

        // Initial value for thermostat.
        if(temperatureSpan.textContent.length === 0) {
            temperatureSpan.textContent = data.currentSetTemp + '°F';
        }
    };

    websocket.onerror = err => {
        console.log('Websocket Error Occurred!');
        console.log(err);
    };

    websocket.onclose = msg => {
        console.log(msg);
    }
}

let timeoutId = null;
const debounceDuration = 2000;
const raiseTemperatureDebounced = () => {
    if(timeoutId) {
        clearTimeout(timeoutId);
    }

    const currentSetTemp = Number(temperatureSpan.textContent.replace('°F', '')) + 1;
    temperatureSpan.textContent = `${currentSetTemp}°F`;
    timeoutId = setTimeout(raiseTemperature, debounceDuration);
}

const raiseTemperature = () => {
    timeoutId = null;

    const outerTemp = Number(outerTempSpan.textContent.replace('°F', ''));
    const innerTemp = Number(innerTempSpan.textContent.replace('°F', ''));
    const currentSetTemp = Number(temperatureSpan.textContent.replace('°F', ''));
    
    const updatedTemperatures = {
        outerTemp: outerTemp, 
        innerTemp: innerTemp, 
        currentSetTemp: currentSetTemp
    };

    // console.log('set temp: ' + currentSetTemp);
    websocket.send(JSON.stringify(updatedTemperatures));
}

const lowerTemperatureDebounced = () => {
    if(timeoutId) {
        clearTimeout(timeoutId);
    }

    const currentSetTemp = Number(temperatureSpan.textContent.replace('°F', '')) - 1;
    temperatureSpan.textContent = `${currentSetTemp}°F`;
    timeoutId = setTimeout(lowerTemperature, debounceDuration);
}

const lowerTemperature = () => {
    timeoutId = null;

    const outerTemp = Number(outerTempSpan.textContent.replace('°F', ''));
    const innerTemp = Number(innerTempSpan.textContent.replace('°F', ''));
    const currentSetTemp = Number(temperatureSpan.textContent.replace('°F', ''));
    
    const updatedTemperatures = {
        outerTemp: outerTemp, 
        innerTemp: innerTemp, 
        currentSetTemp: currentSetTemp
    };

    // console.log('set temp: ' + currentSetTemp);
    websocket.send(JSON.stringify(updatedTemperatures));
}

upButton.addEventListener('click', raiseTemperatureDebounced);
downButton.addEventListener('click', lowerTemperatureDebounced);
setupWebsocketConnection();
import { EventEmitter } from 'node:events';

// Underscore denotes a private variable that should not be accessed directly.
export class Clock {
    _clockInstance = null;
    _hours = []
    _minutes = [];
    _intervalId = null;
    _event = null;

    constructor() {
        for(let i = 0; i < 24; i++) {
            if(i < 10) {
                this._hours.push('0' + i);
                continue;
            }
    
            this._hours.push('' + i);
        }
    
        for(let j = 0; j < 60; j++) {
            if(j < 10) {
                this._minutes.push('0' + j);
                continue;
            }
    
            this._minutes.push('' + j);
        }

        this._event = new EventEmitter();

        let currentHourIndex = 0;
        // Start at -1 so tick starts at 00:00.
        let currentMinuteIndex = -1;
        this._intervalId = setInterval(() => {
            currentMinuteIndex++;
    
            if(currentMinuteIndex >= this._minutes.length) {
                currentHourIndex++;
                currentMinuteIndex = 0;
            }
    
            if(currentHourIndex >= this._hours.length) {
                currentHourIndex = 0;
            }
    
            const currentTime = `${this._hours[currentHourIndex]}:${this._minutes[currentMinuteIndex]}`;
            const data = `data: ${JSON.stringify(currentTime)}\n\n`;
            this._event.emit('tick', data);
        }, 1000);
    }

    static getGlobalClock() {
        if(!this._clockInstance) {
            this._clockInstance = new Clock();
        }

        return this._clockInstance;
    }

    turnOffGlobalClock() {
        if(this._intervalId)
            clearInterval(this._intervalId);
    }

    getEventEmitter() {
        return this._event;
    }
}
import { v4 as uuid } from 'uuid';

// Underscore denotes a private variable that should not be accessed directly.
// timeOn properties represent the amount of time the appliance has been on, in minutes.
export default class House {
    _instance;

    masterBedroom;
    bedroom2;
    bedroom3;
    bathroom1;
    bathroom2;
    garage;
    washer;
    dryer;
    frontDoor;
    backDoor;
    doorToGarage;
    livingRoom;
    kitchen;

    /* * 
     * This hashmap keeps track of all the _intervals created that are periodically adding 
     * to the amount of time an appliance is left on.
     * */
    _intervals;

    constructor() {
        this._intervals = new Map();
        
        this.masterBedroom = {
            id: uuid(),
            overheadLight: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            firstLamp: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            secondLamp: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            television: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 100
            },
            firstWindowIsOpen: false,
            secondWindowIsOpen: false
        }

        this.bedroom2 = {
            id: uuid(),
            overheadLight: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            firstLamp: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            secondLamp: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            firstWindowIsOpen: false,
            secondWindowIsOpen: false
        }

        this.bedroom3 = {
            id: uuid(),
            overheadLight: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            firstLamp: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            secondLamp: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            firstWindowIsOpen: false,
            secondWindowIsOpen: false
        }

        this.bathroom1 = {
            id: uuid(),
            overheadLight: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            exhaustFan: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 30
            },
            windowIsOpen: false
        }

        this.bathroom2 = {
            id: uuid(),
            overheadLight: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            exhaustFan: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 30
            },
            windowIsOpen: false
        }

        this.garage = {
            id: uuid(),
            firstDoorIsOpen: false,
            secondDoorIsOpen: false
        }

        this.washer = {
            id: 'something',
            isOn: false,
            timeOn: 0,
            watts: 500
        }

        this.dryer = {
            id: uuid(),
            isOn: false,
            timeOn: 0,
            watts: 3000
        }

        this.frontDoor = {
            id: uuid(),
            isOpen: false
        }

        this.backDoor = {
            id: uuid(),
            isOpen: false
        }

        this.doorToGarage = {
            id: uuid(),
            isOpen: false
        }

        this.livingRoom = {
            id: uuid(),
            overheadLight: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            firstLampIsOn: false,
            secondLampIsOn: false,
            television: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 636
            },
            firstWindowIsOpen: false,
            secondWindowIsOpen: false,
            thirdWindowIsOpen: false
        }

        this.kitchen = {
            id: uuid(),
            overheadLight: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 60
            },
            stove: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 3500
            },
            oven: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 4000
            },
            microwave: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 1100
            },
            refrigerator: {
                id: uuid(),
                watts: 150
            },
            dishWasher: {
                id: uuid(),
                isOn: false,
                timeOn: 0,
                watts: 1800
            }
        }
    }

    static getSingleton() {
        if(!this._instance) {
            this._instance = new House();
        }

        return this._instance;
    }

    /** 
     * Watts occur on an hourly basis.
     * The properties timeOn and timeOn are represented in minutes.
     * 
     * returns boolean => whether or not the function successfuly toggled the appliance.
    */
    toggleAppliance(id) {
        const appliance = this.getApplianceById(id);
        
        if(!appliance || appliance.isOn === undefined)
            return false;

        // Toggle appliance on/off.
        appliance.isOn = !appliance.isOn;

        if(appliance.isOn) {
            const intervalId = setInterval(() => {
                appliance.timeOn += 1;
                // console.log(appliance.timeOn);
            }, 1000);

            // If somehow an interval was left alive after an appliance was previously turned off,
            // we remove that interval before we set the new one.
            if(this._intervals.has(appliance.id)) {
                const orphanInterval = this._intervals.get(appliance.id);
                clearInterval(orphanInterval);
            }

            this._intervals.set(appliance.id, intervalId);
        } else { // Stop Counting amount of time the appliace is on since it was just turned off.
            const intervalForAppliance = this._intervals.get(appliance.id);
            clearInterval(intervalForAppliance);
        }

        return true;
    }

    getApplianceById(id) {
        return this._getApplianceByIdHelper(id, this);
    }
    
    _getApplianceByIdHelper(targetId, object) {
        for(let key in object) {
            // We don't ever want to return this singleton as an appliance.
            if(key === '_instance')
                continue;

            const field = object[key];
            if(typeof field === 'object') {
                if(field.id === targetId)
                    return field;

                const appliance = this._getApplianceByIdHelper(targetId, field);
                if(appliance && appliance.id === targetId)
                    return appliance;
            }
        }

        return null;
    }

    getTotalWattsForAppliance(id) {
        const appliance = this.getApplianceById(id);
        const minutes = appliance.timeOn;
        const hours = minutes / 60;
        const total = appliance.watts * hours;

        return total;
    }

    getTotalWatts() {
        return this._getTotalWattsHelper(this);
    }

    _getTotalWattsHelper(object) {
        let totalWatts = 0;
        if(object.timeOn) {
            const minutes = object.timeOn;
            const hours = minutes / 60;
            const total = object.watts * hours;
            totalWatts += total;
        }

        for(let key in object) {
            // Skip this singleton.
            if(key === '_instance')
                continue;

            const field = object[key];
            if(typeof field === 'object') {
                const childWatts = this._getTotalWattsHelper(field);
                totalWatts += childWatts;
            }
        }

        return totalWatts;
    }
}
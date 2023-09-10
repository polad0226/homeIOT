import axios from 'axios';

const RAPID_API_KEY = '62c6cb569emshea818f9bd337cc1p1e00adjsna8625b059f24';
export function getWeatherByHour(date) {
    if(!date) {
        throw new Error('A date should be passed to the getWeatherByHour() function.');
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const currentDate = `${year}-${month}-${day}`;
    
    const bhamStationID = '72228';
    const start = currentDate;
    const end = currentDate;
    const unitSystem = 'imperial';
    const timezone = 'America/Chicago';
    
    const payload = axios.get('https://meteostat.p.rapidapi.com/stations/hourly', {
        params: {station: bhamStationID, start: start, end: end, units: unitSystem, tz: timezone},
        headers: {
            'x-rapidapi-host': 'meteostat.p.rapidapi.com',
            'x-rapidapi-key': RAPID_API_KEY
        }
    })
    .then(res => res.data)
    .then(payload => {
        console.log(payload);
        return payload;
    })
    .catch(err => {
        // console.error(err)
        return null;
    });

    return payload;
}
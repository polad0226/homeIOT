import pg from 'pg';
import { getWeatherByHour } from '../outbound-requests/meteostat-api.js';

const { Client } = pg;
const client = new Client({
    user: 'Team1',
    host: '138.26.48.83',
    database: 'Team1DB',
    password: 'team1',
    port: 5432
});
client.connect();

export async function createHvacTable() {
    const tableStatement = `
    CREATE TABLE IF NOT EXISTS hvac (
        user_name varchar(50) NOT NULL,
        set_temp integer NOT NULL DEFAULT '72',
        inner_temp integer NOT NULL DEFAULT '72',
        outer_temp integer NOT NULL DEFAULT '60',
        PRIMARY KEY (user_name)
    )
    `;

    let tableCreationResult;
    let adminCreated = false;
    try {
        tableCreationResult = await client.query(tableStatement);

        const selectStatement = 'SELECT * FROM hvac WHERE user_name = \'admin\'';
        const selectResult = await client.query(selectStatement);
        if(selectResult.rows.length > 0)
            adminCreated = true;
    } catch(err) {
        console.log('Error creating hvac table...');
        console.error(err);
    }

    if(!adminCreated) {
        try {
            console.log(tableCreationResult);
    
            const currentDate = new Date();
            const payload = await getWeatherByHour(currentDate);
            const currentHour = currentDate.getHours();
            const currentOutsideTemperature = payload ? payload.data[currentHour].temp : null;
            
            const insert = currentOutsideTemperature ? 'INSERT INTO hvac(user_name, outer_temp) VALUES ($1, $2)' : 'INSERT INTO hvac(user_name) VALUES ($1)';
            const values = currentOutsideTemperature ? ['admin', currentOutsideTemperature] : ['admin'];
            const insertResult = await client.query(insert, values);
    
            console.log('Logging Insert Statement...');
            console.log(insertResult);
        }
        catch(err) {
            console.log('Error inserting admin into hvac table...');
            console.error(err);
        }
    }
}

export async function getAdminHvac() {
    const query = 'SELECT * FROM hvac WHERE user_name = \'admin\'';
    
    try {
        const queryResult = await client.query(query);
        console.log('hvac query result...');
        console.log(queryResult);

        return queryResult.rows[0];
    } catch (err) {
        console.log('Error querying hvac table...');
        console.error(err);
    }
}

export async function updateAdminHvac(hvac) {
    const sqlStatement = `
    UPDATE hvac
    SET set_temp = $2,
    inner_temp = $3,
    outer_temp = $4
    WHERE user_name = $1
    `;
    const values = ['admin', hvac.currentSetTemp, hvac.innerTemp, hvac.outerTemp];

    await client.query(sqlStatement, values);
}

export function closeDbConnection() {
    client.end((err) => {
        console.log('client has disconnected from db')
        if (err) {
            console.log('error during disconnection', err.stack)
        }
    });
}
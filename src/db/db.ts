import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT as any,
});


export function getCompoundData() {
    pool.query('SELECT * FROM compound', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results.rows);
    });
}

async function insertFirehydrant(payload: {
    no_pili: string, //* 3 Char, example: 001
    code_pili: string,
    address: string,
    latitude: number,
    longitude: number,
    station_id: string,
    status_id: string,
    ownership_id: number,
    fhtype_id: number,
    created_by: number
}) {
    const {
        no_pili,
        code_pili,
        address,
        latitude,
        longitude,
        station_id,
        status_id,
        ownership_id,
        fhtype_id,
        created_by
    } = payload;

    try {
        // Step 1: Insert fire hydrant record using the retrieved station ID
        const insertQuery = `
            INSERT INTO fire_hydrant (no_pili, code_pili, address, latitude, longitude, external_station_id, status_id, ownership_id, fhtype_id, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const insertResult = await pool.query(insertQuery, [
            no_pili,
            code_pili,
            address,
            latitude,
            longitude,
            station_id,
            status_id,
            ownership_id,
            fhtype_id,
            created_by
        ]);

        // Log the result or handle success
        console.log('Fire hydrant inserted:', insertResult.rows[0]);

    } catch (error) {
        console.error('Error executing query:', error);
    }
    // finally {
    //     if (pool) {
    //         pool.release(); // Release the client back to the pool
    //     }
    // }
};
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

export async function insertFirehydrant(payload: {
    no_pili: string, //* 3 Char, example: 001
    code_pili: string,
    address: string,
    latitude: number,
    longitude: number,
    station_id: string,
    parliament_id: string | null,
    status_id: string,
    ownership_id: string,
    fhtype_id: string,
    created_by: string
    source_creation: "Add",
}) {
    const {
        no_pili,
        code_pili,
        address,
        latitude,
        longitude,
        station_id,
        parliament_id,
        status_id,
        ownership_id,
        fhtype_id,
        created_by,
        source_creation,
    } = payload;

    try {
        // Step 1: Insert fire hydrant record using the retrieved station ID
        const insertQuery = `
            INSERT INTO fire_hydrant (
                no_pili, 
                code_pili, 
                address, 
                latitude, 
                longitude, 
                external_station_id,
                parliament_id,
                status_id, 
                ownership_id, 
                fhtype_id, 
                created_by,
                source_creation,
                created_at,
                is_has_industry_risk,
                is_has_housing_risk,
                is_has_school_risk
            )
            VALUES (
                $1, 
                $2, 
                $3, 
                $4, 
                $5, 
                $6, 
                $7, 
                $8, 
                $9, 
                $10,
                $11,
                $12,
                NOW() AT TIME ZONE 'UTC',
                FALSE,
                FALSE,
                FALSE
            )
            RETURNING *
        `;

        const insertResult = await pool.query(insertQuery, [
            no_pili,
            code_pili,
            address,
            latitude,
            longitude,
            station_id,
            parliament_id,
            status_id,
            ownership_id,
            fhtype_id,
            created_by,
            source_creation,
            //TODO: add installation_date, maybe
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
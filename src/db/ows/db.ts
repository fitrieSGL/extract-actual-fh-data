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


interface FHISOwsType {
    reference_no: string | null,
    created_by: number | null
    type_id: string | null,
    latitude: number | null,
    longitude: number | null,
    status_id: number | null,
    address: string | null,
    station_id: string | null,
    state_id: string | null,
    district_id: string | null,
}

export async function insertOwsWithTransaction(payload: FHISOwsType) {
    const {
        reference_no,
        created_by,
        type_id,
        latitude,
        longitude,
        status_id,
        address,
        station_id,
        state_id,
        district_id,
    } = payload;

    // Get a client from the pool
    const client = await pool.connect();

    try {
        // Begin transaction
        await client.query('BEGIN');

        const insertQuery = `
            INSERT INTO open_water (
                reference_no,
                created_by,
                type_id,
                latitude,
                longitude,
                status_id,
                address,
                station_id,
                state_id,
                district_id
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
            )
            RETURNING *
        `;

        const insertResult = await client.query(insertQuery, [
            reference_no,
            created_by,
            type_id,
            latitude,
            longitude,
            status_id,
            address,
            station_id,
            state_id,
            district_id,
        ]);

        // Commit transaction
        await client.query('COMMIT');

        console.log('OWS inserted:', insertResult.rows[0]);
        return insertResult.rows[0];

    } catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        console.error('Error executing query:', error);
        throw error;
    } finally {
        // Release the client back to the pool
        client.release();
    }
}

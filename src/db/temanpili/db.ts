import dayjs from 'dayjs';
import * as dotenv from 'dotenv';
import { Pool, PoolClient } from 'pg';

dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT as any,
});


export interface TemanPiliType {
    station_id: string | null,
    no_pili: string,
    name: string
    no_ic: string
    email: string
    phone_no: string
    address: string
    postcode: string
    state_id: string
    district_id: string
    occupation: string
    office_address: string
    office_postcode: string
    office_state_id: string
    office_district_id: string
    // image_url: string
    created_at: string
    gender: string
    // membership_no: string
    status: string
}

export async function insertTemanPiliWithTransaction(payload: TemanPiliType) {
    const {
        station_id,
        no_pili,
        name,
        no_ic,
        email,
        phone_no,
        address,
        postcode,
        state_id,
        district_id,
        occupation,
        office_address,
        office_postcode,
        office_state_id,
        office_district_id,
        created_at,
        gender,
        status,
    } = payload;

    // Get a client from the pool
    const client = await pool.connect();

    try {
        // Begin transaction
        await client.query('BEGIN');

        const insertQuery = `
            INSERT INTO teman_pili_bomba (
                external_station_id,
                name,
                ic_no,
                email,
                phone_no,
                address,
                postcode,
                state_id,
                district_id,
                occupation,
                office_address,
                office_postcode,
                office_state_id,
                office_district_id,
                created_at,
                gender_id,
                status_options_id,
                created_by
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
            )
            RETURNING *
        `;

        const ADMIN_SYSTEM_ID = 249;
        const insertResult = await client.query(insertQuery, [
            station_id,
            name,
            no_ic,
            email,
            phone_no,
            address,
            postcode,
            state_id,
            district_id,
            occupation,
            office_address,
            office_postcode,
            office_state_id,
            office_district_id,
            created_at,
            gender,
            status,
            ADMIN_SYSTEM_ID
        ]);

        const temanPiliId = insertResult.rows[0].id;
        const station_code = no_pili?.split("-")[0];
        await updateTemanPiliMembershipNo(client, {
            created_at,
            station_code: station_code,
            teman_pili_id: temanPiliId
        });

        await linkFireHydrantTemanPili(client, {
            temanpili_id: temanPiliId,
            no_pili,
        })

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



async function updateTemanPiliMembershipNo(
    client: PoolClient,
    payload: {
        created_at: string,
        station_code: string | null,
        teman_pili_id: number
    }
) {
    if (!payload.station_code) {
        return;
    }

    const year = dayjs(payload.created_at).year();

    // Count how many members already exist for this station + year
    const countQuery = `
        SELECT COUNT(*) as total
        FROM teman_pili_bomba
        WHERE membership_no LIKE $1
    `;
    const countResult = await client.query(countQuery, [`${payload.station_code}-${year}-%`]);
    const sequence = parseInt(countResult.rows[0].total) + 1;

    const membershipNo = `${payload.station_code}-${year}-${sequence.toString().padStart(3, "0")}`;

    const updateQuery = `
        UPDATE teman_pili_bomba
        SET membership_no = $1
        WHERE id = $2
    `;

    await client.query(updateQuery, [
        membershipNo,
        payload.teman_pili_id,
    ]);
}


async function linkFireHydrantTemanPili(
    client: PoolClient,
    payload: { temanpili_id: string | null, no_pili: string | null }
) {
    if (!payload.temanpili_id && !payload.no_pili) {
        return;
    }

    const insertQuery = `
        INSERT INTO fire_hydrant_teman_pili (firehydrant_id, temanpili_id)
        SELECT 
            fh.id,
            $1
        FROM fire_hydrant fh
        WHERE fh.no_pili = $2;
    `;

    await client.query(insertQuery, [
        payload.temanpili_id,
        payload.no_pili,
    ]);

}

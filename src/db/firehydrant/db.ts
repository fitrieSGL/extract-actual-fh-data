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
    state_id: string,
    parliament_id: string | null,
    zone_id: string | null,
    status_id: string,
    ownership_id: string,
    fhtype_id: string,
    created_by: string
    source_creation: "Add",
    district_id: string | null,
}) {
    const {
        no_pili,
        code_pili,
        address,
        latitude,
        longitude,
        station_id,
        state_id,
        parliament_id,
        zone_id,
        status_id,
        ownership_id,
        fhtype_id,
        created_by,
        source_creation,
        district_id,
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
                state_id,
                parliament_id,
                zone_id,
                status_id, 
                ownership_id, 
                fhtype_id, 
                created_by,
                source_creation,
                created_at,
                is_has_industry_risk,
                is_has_housing_risk,
                is_has_school_risk,
                district_id
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
                $13,
                $14,
                NOW() AT TIME ZONE 'UTC',
                FALSE,
                FALSE,
                FALSE,
                $15
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
            state_id,
            parliament_id,
            zone_id,
            status_id,
            ownership_id,
            fhtype_id,
            created_by,
            source_creation,
            district_id,
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

}


export async function insertFirehydrantWithTransaction(payload: {
    no_pili: string,
    code_pili: string,
    address: string,
    latitude: number,
    longitude: number,
    station_id: string,
    state_id: string,
    parliament_id: string | null,
    zone_id: string | null,
    status_id: string,
    ownership_id: string,
    fhtype_id: string,
    created_by: string
    source_creation: "Add",
    district_id: string | null,
}) {
    const {
        no_pili,
        code_pili,
        address,
        latitude,
        longitude,
        station_id,
        state_id,
        parliament_id,
        zone_id,
        status_id,
        ownership_id,
        fhtype_id,
        created_by,
        source_creation,
        district_id,
    } = payload;

    // Get a client from the pool
    const client = await pool.connect();

    try {
        // Begin transaction
        await client.query('BEGIN');

        const insertQuery = `
            INSERT INTO fire_hydrant (
                no_pili, 
                code_pili, 
                address, 
                latitude, 
                longitude, 
                external_station_id,
                state_id,
                parliament_id,
                zone_id,
                status_id, 
                ownership_id, 
                fhtype_id, 
                created_by,
                source_creation,
                created_at,
                is_has_industry_risk,
                is_has_housing_risk,
                is_has_school_risk,
                district_id
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, NOW() AT TIME ZONE 'UTC',
                FALSE, FALSE, FALSE, $15
            )
            RETURNING *
        `;

        const insertResult = await client.query(insertQuery, [
            no_pili,
            code_pili,
            address,
            latitude,
            longitude,
            station_id,
            state_id,
            parliament_id,
            zone_id,
            status_id,
            ownership_id,
            fhtype_id,
            created_by,
            source_creation,
            district_id,
        ]);

        // If you have more queries, add them here
        // await client.query('INSERT INTO another_table ...');

        // Commit transaction
        await client.query('COMMIT');

        console.log('Fire hydrant inserted:', insertResult.rows[0]);
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




export async function insertFirehydrantWithTransactionV2(payload: {
    no_pili: string,
    code_pili: string,
    isHaveMainPipe: boolean | null | undefined,
    mainPipeSize: number | null | undefined,
    distanceFromNearestStation: number | null | undefined,
    distanceFromNearestFireHydrant: number | null | undefined,
    distanceFromOpenWaterSources: number | null | undefined,
    waterProduction: number | null | undefined,
    staticWaterPressure: number | null | undefined,
    currentWaterPressure: number | null | undefined,
    totalPopulation: number | null | undefined,
    totalPremises: number | null | undefined,
    totalBuildingOver4floors: number | null | undefined,
    is_has_industry_risk: boolean,
    is_has_housing_risk: boolean,
    is_has_school_risk: boolean,
    otherRisks: string,
    address: string,
    latitude: number | null | undefined,
    longitude: number | null | undefined,
    postcode: number | null | undefined,
    installation_date: string | null | undefined,
    external_station_id: string,
    state_id: string,
    district_id: string | null | undefined,
    parliament_id: string | null | undefined,
    assemblymen_id: string | null | undefined,
    zone_id: number | null | undefined,
    fhtype_id: string | null | undefined,
    ownership_id: string | null | undefined,
    status_id: string | null | undefined,
    created_by: number,
}) {
    const {
        no_pili,
        code_pili,
        isHaveMainPipe,
        mainPipeSize,
        distanceFromNearestStation,
        distanceFromNearestFireHydrant,
        distanceFromOpenWaterSources,
        waterProduction,
        staticWaterPressure,
        currentWaterPressure,
        totalPopulation,
        totalPremises,
        totalBuildingOver4floors,
        is_has_industry_risk,
        is_has_housing_risk,
        is_has_school_risk,
        otherRisks,
        address,
        latitude,
        longitude,
        postcode,
        installation_date,
        external_station_id,
        state_id,
        district_id,
        parliament_id,
        assemblymen_id,
        zone_id,
        fhtype_id,
        ownership_id,
        status_id,
        created_by,
    } = payload;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const insertQuery = `
            INSERT INTO fire_hydrant (
                no_pili,
                code_pili,
                "isHaveMainPipe",
                "mainPipeSize",
                "distanceFromNearestStation",
                "distanceFromNearestFireHydrant",
                "distanceFromOpenWaterSources",
                "waterProduction",
                "staticWaterPressure",
                "currentWaterPressure",
                "totalPopulation",
                "totalPremises",
                "totalBuildingOver4floors",
                is_has_industry_risk,
                is_has_housing_risk,
                is_has_school_risk,
                "otherRisks",
                address,
                latitude,
                longitude,
                postcode,
                installation_date,
                external_station_id,
                state_id,
                district_id,
                parliament_id,
                assemblymen_id,
                zone_id,
                fhtype_id,
                ownership_id,
                status_id,
                created_by,
                source_creation,
                created_at
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
                $31, $32, $33, NOW() AT TIME ZONE 'Asia/Kuala_Lumpur'
            )
            RETURNING *
        `;

        const insertResult = await client.query(insertQuery, [
            no_pili,
            code_pili,
            isHaveMainPipe ?? null,
            mainPipeSize ?? null,
            distanceFromNearestStation ?? null,
            distanceFromNearestFireHydrant ?? null,
            distanceFromOpenWaterSources ?? null,
            waterProduction ?? null,
            staticWaterPressure ?? null,
            currentWaterPressure ?? null,
            totalPopulation ?? null,
            totalPremises ?? null,
            totalBuildingOver4floors ?? null,
            is_has_industry_risk,
            is_has_housing_risk,
            is_has_school_risk,
            otherRisks,
            address,
            latitude ?? null,
            longitude ?? null,
            postcode ?? null,
            installation_date ?? null,
            external_station_id,
            state_id,
            district_id ?? null,
            parliament_id ?? null,
            assemblymen_id ?? null,
            zone_id ?? null,
            fhtype_id ?? null,
            ownership_id ?? null,
            status_id ?? null,
            created_by,
            "Add",
        ]);

        await client.query('COMMIT');

        console.log('Fire hydrant inserted:', insertResult.rows[0]);
        return insertResult.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error executing query:', error);
        throw error;
    } finally {
        client.release();
    }
}



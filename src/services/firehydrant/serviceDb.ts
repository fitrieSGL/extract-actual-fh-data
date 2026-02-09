import { DistrictType, ParliamentType, StationType } from 'types/csv';
import { insertFirehydrant, insertFirehydrantWithTransaction } from '../db/db';
import { readCSVFile } from '../services/extractExcel';
import * as ExcelJS from 'exceljs';
import { generateCSV } from './csv-service';

interface SPPBFhType {
    id_pili: number;
    hydrant_id_uuid: string;
    station_id_uuid: string;
    station_id: number;
    station_code: string;
    zon: string;
    no_pili: number;
    pili_num_combine: string;
    alamat: string;
    penanda_kawasan: string;
    id_kedudukan: number;
    kedudukan: string;
    lokasi: string;
    latitud: number;
    longitud: number;
    id_negeri: number;
    state_id_uuid: string;
    negeri: string;
    id_daerah: number;
    daerah: string;
    id_pemilikan_pili: number;
    pemilikan_pili: string;
    id_status_pili: number;
    status_pili: string;
    diameter_pengeluaran: number;
    id_jenis_pili: number;
    jenis_pili: string;
    id_parlimen: number;
    parlimen: string;
    tarikh_pili: string;
    id_syarikat_air: number;
    flag_migrasi: string;
    id_bandar: number;
    bandar: string;
    city_id_uuid: string;
}

interface SPPBFhTwoType {
    id_pili: string;
    hydrant_id_uuid: string;
    station_id_uuid: string | null;
    station_id: string | null;
    external_station_id: string | null;
    station_code: string;
    zon: string;
    no_pili: string;
    pili_num_combine: string;
    alamat: string;
    alamat2: string;
    penanda_kawasan: string;
    no_premis: string;
    id_kedudukan: string;
    kedudukan: string;
    poskod: string;
    lokasi: string;
    latitud: number | null;
    longitud: number | null;
    id_negeri: string | null;
    state_id: string | null;
    state_id_uuid: string;
    negeri: string;
    id_daerah: string | null;
    district_id: string | null;
    daerah: string;
    id_pemilikan_pili: string;
    pemilikan_pili: string;
    id_status_pili: string;
    status_pili: string;
    diameter_pengeluaran: string;
    image_1: string;
    catatan: string;
    id_jenis_pili: string;
    jenis_pili: string;
    id_parlimen: string | null;
    parliament_id: string | null;
    parlimen: string;
    id_dun: string;
    dun: string;
    tarikh_pili: string;
    id_syarikat_air: string;
    flag_migrasi: string;
    id_bandar: string;
    bandar: string;
    city_id_uuid: string;
    saiz_main_paip: string;
    latitud_original: string;
    longitud_original: string;
    no_pili_asal: string;
}


export async function readCSVAndInsertToDb(
    filePath: string,
    payload: {
        state_id: string,
        listExcludeStationCode: string[],
    },
) {
    const workbook = new ExcelJS.Workbook();

    console.log("Reading csv...");
    await workbook.csv.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
        throw new Error('Worksheet not found');
    }

    const KL_STATE_ID = '55c38deb-aae3-44c5-bfac-0bb919effec4';
    const SELANGOR_STATE_ID = 'b74645e5-3ad2-4dd9-ba72-3b7eb8f16643';
    const PUTRAJAYA_STATE_ID = '09a53d0c-6993-4cfc-a9f0-3da42395ef59';

    let listDistrict: DistrictType[] = [];
    let listParliament: ParliamentType[] = [];
    let listStation: StationType[] = [];

    switch (payload.state_id) {
        case KL_STATE_ID: {
            listDistrict = await readCSVFile<DistrictType>("C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/location/kl/districts.csv");
            listParliament = await readCSVFile<ParliamentType>("C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/location/kl/parliaments.csv");
            listStation = await readCSVFile<StationType>("C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/location/kl/stations.csv");
            break;
        }
        case SELANGOR_STATE_ID: {
            listDistrict = await readCSVFile<DistrictType>("C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/location/selangor/districts.csv");
            listParliament = await readCSVFile<ParliamentType>("C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/location/selangor/parliaments.csv");
            listStation = await readCSVFile<StationType>("C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/location/selangor/stations.csv");
            break;
        }
        case PUTRAJAYA_STATE_ID: {
            // listDistrict = await readCSVFile<DistrictType>("C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/location/selangor/districts.csv");
            // listParliament = await readCSVFile<ParliamentType>("C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/location/selangor/parliaments.csv");
            // listStation = await readCSVFile<StationType>("C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/location/selangor/stations.csv");
            break;
        }
    }

    let headers: any = [];
    let processedRows = 0;
    let insertedRows = 0;
    let skippedRows = 0;

    // Process rows one by one
    for await (const row of worksheet.getRows(1, worksheet.rowCount) || []) {
        const rowNumber = row.number;

        if (rowNumber === 1) {
            // First row as headers
            row.eachCell((cell, colNumber) => {
                headers[colNumber] = cell.value;
            });
            continue;
        }

        // Data rows
        const rowData: any = {};
        row.eachCell((cell, colNumber) => {
            const header = headers[colNumber];
            if (header) {
                rowData[header] = cell.value;
            }
        });

        // Only process row if it has data
        if (Object.keys(rowData).length === 0) {
            continue;
        }

        const i = rowData;

        //* Get district
        const district = listDistrict.find(item => {
            if (!i.daerah || typeof i.daerah !== 'string') {
                return false;
            }
            const itemWords = item.name.toLowerCase().split(' ');
            const daerahWords = i.daerah.toLowerCase().split(' ');
            const matchingWords = itemWords.filter(word =>
                daerahWords.includes(word)
            );
            return matchingWords.length >= 1;
        });

        //* Get parliament
        const parliament = listParliament.find(item => {
            if (!i.parlimen || typeof i.parlimen !== 'string') {
                return false;
            }
            const itemWords = item.name.toLowerCase().split(' ');
            const parliamentWords = i.parlimen.toLowerCase().split(' ');
            const matchingWords = itemWords.filter(word =>
                parliamentWords.includes(word)
            );
            return matchingWords.length >= 1;
        });

        //* Get station
        // Check if station_code exists first
        if (!i.station_code || typeof i.station_code !== 'string') {
            skippedRows++;
            console.log(`Skipped row ${rowNumber}: Missing or invalid station_code`);
            continue;
        }

        const station = listStation
            .filter(item => {
                // Check if item.station_code exists before using it
                if (!item.station_code || typeof item.station_code !== 'string') {
                    return false;
                }
                return !payload.listExcludeStationCode.includes(item.station_code);
            })
            .find(item => {
                // Check again before calling includes
                if (!item.station_code || typeof item.station_code !== 'string') {
                    return false;
                }
                return item.station_code.includes(i.station_code);
            });

        const district_id = district?.id ?? null;
        const parliament_id = parliament?.id ?? null;
        const station_id = station?.id ?? null;
        const station_code = station?.station_code ?? null;

        if (!station_id || !station_code) {
            skippedRows++;
            console.log(`Skipped row ${rowNumber}: Station not found for code ${i.station_code}`);
            continue;
        }

        const modifiedNoPili = `${station_code}-${i.zon}-${i.no_pili.toString().padStart(3, '0')}`;
        const ZONE_ID = getZoneId(i?.zon)?.id?.toString() ?? null;
        const SYSTEM_ADMIN_ID = '249';

        await insertFirehydrant({
            no_pili: modifiedNoPili,
            code_pili: station_code,
            address: i.alamat,
            latitude: i.latitud,
            longitude: i.longitud,
            station_id: station_id,
            state_id: payload.state_id,
            parliament_id,
            zone_id: ZONE_ID,
            status_id: i?.id_status_pili?.toString(),
            ownership_id: i?.id_pemilikan_pili?.toString(),
            fhtype_id: i?.id_jenis_pili?.toString(),
            created_by: SYSTEM_ADMIN_ID,
            source_creation: "Add",
            district_id,
        });

        insertedRows++;
        processedRows++;

        // Log progress every 1000 rows
        if (processedRows % 1000 === 0) {
            console.log(`Processed ${processedRows} rows (Inserted: ${insertedRows}, Skipped: ${skippedRows})...`);
        }
    }

    console.log(`✓ Completed: ${processedRows} total rows processed`);
    console.log(`  - Inserted: ${insertedRows}`);
    console.log(`  - Skipped: ${skippedRows}`);
}

export async function readCSVAndInsertToDbTwo(
    filePath: string,
    csvErrorOutputPath: string
) {
    try {
        const workbook = new ExcelJS.Workbook();

        console.log("Reading csv...");
        await workbook.csv.readFile(filePath);

        const worksheet = workbook.getWorksheet(1);

        if (!worksheet) {
            throw new Error('Worksheet not found');
        }

        let headers: any = [];
        let processedRows = 0;
        let insertedRows = 0;
        let skippedRows = 0;
        let listSkippedRows: string[] = [];

        // Process rows one by one
        for await (const row of worksheet.getRows(1, worksheet.rowCount) || []) {
            const rowNumber = row.number;

            if (rowNumber === 1) {
                // First row as headers
                row.eachCell((cell, colNumber) => {
                    headers[colNumber] = cell.value;
                });
                continue;
            }

            // Data rows
            const rowData: any = {};
            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber];
                if (header) {
                    rowData[header] = cell.value;
                }
            });

            // Only process row if it has data
            if (Object.keys(rowData).length === 0) {
                continue;
            }

            const i: SPPBFhTwoType = rowData as any;

            const district_id = i.district_id ?? null;
            const parliament_id = i.parliament_id ?? null;
            const station_id = i.external_station_id ?? null;
            const station_code = i.station_code ?? null;
            const state_id = i.state_id;

            if(!state_id){
                skippedRows++;
                const reason = `[${rowNumber}][id_pili - ${i.id_pili}]: Skipped row ${rowNumber}: State id is not present`;
                listSkippedRows.push(reason);
                continue;
            }

            if (!station_id || !station_code) {
                skippedRows++;
                const reason = `[${rowNumber}][id_pili - ${i.id_pili}]: Skipped row ${rowNumber}: Station not found for code ${i.station_code}`;
                listSkippedRows.push(reason);
                continue;
            }

            const modifiedNoPili = `${station_code}-${i.zon}-${i.no_pili.toString().padStart(3, '0')}`;
            const ZONE_ID = getZoneId(i?.zon)?.id?.toString() ?? null;
            const SYSTEM_ADMIN_ID = '249';

            try {
                await insertFirehydrantWithTransaction({
                    no_pili: modifiedNoPili,
                    code_pili: station_code,
                    address: i.alamat,
                    latitude: i.latitud as number,
                    longitude: i.longitud as number,
                    station_id: station_id,
                    state_id,
                    parliament_id,
                    zone_id: ZONE_ID,
                    status_id: i?.id_status_pili?.toString(),
                    ownership_id: i?.id_pemilikan_pili?.toString(),
                    fhtype_id: i?.id_jenis_pili?.toString(),
                    created_by: SYSTEM_ADMIN_ID,
                    source_creation: "Add",
                    district_id,
                });

                insertedRows++;
            } catch (error: any) {
                // Check if it's a duplicate key error (PostgreSQL error code 23505)
                if (error.code === '23505') {
                    skippedRows++;
                    const reason = `[${row}][id_pili - ${i.id_pili}]: Skipped row ${rowNumber}: Duplicate no_pili ${modifiedNoPili}`;
                    listSkippedRows.push(reason);
                } else {
                    // For other errors, log and skip
                    skippedRows++;
                    const reason = `[${row}][id_pili - ${i.id_pili}]: Error on row ${rowNumber}: ${error.message}`;
                    listSkippedRows.push(reason);
                }
            }

            processedRows++;

            // Log progress every 1000 rows
            if (processedRows % 1000 === 0) {
                console.log(`Processed ${processedRows} rows (Inserted: ${insertedRows}, Skipped: ${skippedRows})...`);
            }
        }

        console.log(`✓ Completed: ${processedRows} total rows processed`);
        console.log(`  - Inserted: ${insertedRows}`);
        console.log(`  - Skipped: ${skippedRows}`);
        generateCSV(listSkippedRows, {
            header: "Error",
            outputPath: csvErrorOutputPath,
        })
    } catch (error) {
        console.error(error);
    }
}




function getZoneId(alphabet: string | null) {
    if (!alphabet) {
        return null
    }
    // Convert A-Z to 1-26
    const id = alphabet.toUpperCase().charCodeAt(0) - 64;

    return {
        id: id,
        code: alphabet
    };
}




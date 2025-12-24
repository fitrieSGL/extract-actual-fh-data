import { DistrictType, ParliamentType, StationType } from 'types/csv';
import { insertFirehydrant } from '../db/db';
import { readCSVFile } from '../services/extractExcel';
import * as ExcelJS from 'exceljs';

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


export async function readExcelAndInsertToDb() {
    const workbook = new ExcelJS.Workbook();
    const path = 'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/result/bbp-p7.csv';

    // Use csv.readFile instead of xlsx.readFile
    await workbook.csv.readFile(path);

    // Get the first worksheet (CSV files create one worksheet)
    const worksheet = workbook.getWorksheet(1);

    const data: {
        no_pili: string,
        pili_awam_ph?: number,
        pili_awam_gh?: number,
        pili_swasta_ph?: number,
        pili_swasta_gh?: number,
        alamat: string,
        nama_teman_pili?: string,
        ic_teman_pili?: string,
        tarikh_daftar_teman_pili?: string,
        latitude: number,
        longitude: number
    }[] = [];
    let headers: any = [];

    worksheet?.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
            // First row as headers
            row.eachCell((cell, colNumber) => {
                headers[colNumber] = cell.value;
            });
        } else {
            // Data rows
            const rowData: any = {};
            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber];
                if (header) {
                    rowData[header] = cell.value;
                }
            });

            // Only add row if it has data
            if (Object.keys(rowData).length > 0) {
                data.push(rowData);
            }
        }
    });

    console.log("Data: ", data[0]);

    // for (let i of data) {
    //     let fhTypeId: string = "";
    //     let fhOwnershipId: string = "";
    //     if(i.pili_awam_ph){
    //         fhTypeId = '1';
    //         fhOwnershipId = '1';
    //     }
    //     if(i.pili_awam_gh){
    //         fhTypeId = '2';
    //         fhOwnershipId = '1';
    //     }
    //     if(i.pili_swasta_ph){
    //         fhTypeId = '1';
    //         fhOwnershipId = '2';
    //     }
    //     if(i.pili_swasta_gh){
    //         fhTypeId = '2';
    //         fhOwnershipId = '2';
    //     }


    //     await insertFirehydrant({
    //         no_pili: i.no_pili,
    //         code_pili: 'PJY',
    //         address: i.alamat,
    //         latitude: i.latitude,
    //         longitude: i.longitude,
    //         station_id: '14e54cbf-55e5-4931-b0db-0bc1035ba3e6',
    //         status_id: '1',
    //         ownership_id: fhOwnershipId,
    //         fhtype_id: fhTypeId,
    //         created_by: '249'
    //     });
    // }

    return data;
}


export async function readCSVAndInsertToDb(
    filePath: string,
    payload: {
        state_id: string,
        listExcludeStationCode: string[],
    },
) {
    const workbook = new ExcelJS.Workbook();

    // Use csv.readFile instead of xlsx.readFile
    console.log("Reading csv...");
    await workbook.csv.readFile(filePath);

    // Get the first worksheet (CSV files create one worksheet)
    const worksheet = workbook.getWorksheet(1);

    const data: SPPBFhType[] = [];
    let headers: any = [];

    worksheet?.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
            // First row as headers
            row.eachCell((cell, colNumber) => {
                headers[colNumber] = cell.value;
            });
        } else {
            // Data rows
            const rowData: any = {};
            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber];
                if (header) {
                    rowData[header] = cell.value;
                }
            });

            // Only add row if it has data
            if (Object.keys(rowData).length > 0) {
                data.push(rowData);
            }
        }
    });

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



    for (let i of data) {
        //* Get district
        const district = listDistrict.find(item => {
            // console.log('daerah value:', i.daerah, 'type:', typeof i.daerah);
            if (!i.daerah || typeof i.daerah !== 'string') {
                return false;
            }
            const itemWords = item.name.toLowerCase().split(' ');
            const daerahWords = i.daerah.toLowerCase().split(' ');
            // Count matching words
            const matchingWords = itemWords.filter(word =>
                daerahWords.includes(word)
            );
            // Return true if at least 1 or 2 words match
            return matchingWords.length >= 1; // Change to >= 2 if you want at least 2 matches
        });

        //* Get parliament
        const parliament = listParliament.find(item => {
            if (!i.parlimen || typeof i.parlimen !== 'string') {
                return false;
            }
            const itemWords = item.name.toLowerCase().split(' ');
            const parliamentWords = i.parlimen.toLowerCase().split(' ');
            // Count matching words
            const matchingWords = itemWords.filter(word =>
                parliamentWords.includes(word)
            );
            // Return true if at least 1 or 2 words match
            return matchingWords.length >= 1; // Change to >= 2 if you want at least 2 matches
        });

        //* Get station
        const station = listStation
            .filter(item => {
                if (!i.station_code || typeof i.station_code !== 'string') {
                    return false;
                }
                return !payload.listExcludeStationCode.includes(item.station_code);
            })
            .find(item => {
                return item.station_code.includes(i.station_code);
            });

        // console.log('District: ', district?.id ?? null);
        // console.log('Parliament: ', parliament?.id ?? null);
        // console.log('Station: ', station?.id ?? null);

        const district_id = district?.id ?? null;
        const parliament_id = parliament?.id ?? null;
        const station_id = station?.id ?? null;
        const station_code = station?.station_code ?? null;
        const modifiedNoPili = `${station_code}-${i.zon}-${i.no_pili.toString().padStart(3, '0')}`;
        const ZONE_ID = getZoneId(i.zon)?.id?.toString() ?? null;
        const SYSTEM_ADMIN_ID = '249';

        if (!station_id || !station_code) {
            // throw new Error("station_id or station_code is null!");
            continue;
        }

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
            //TODO: add installation_date, maybe
            district_id,
        });
    }

    return data;
}

function getZoneId(alphabet: string) {
    // Convert A-Z to 1-26
    const id = alphabet.toUpperCase().charCodeAt(0) - 64;

    return {
        id: id,
        code: alphabet
    };
}




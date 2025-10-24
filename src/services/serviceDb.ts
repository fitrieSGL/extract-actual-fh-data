import { insertFirehydrant } from '../db/db';
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
        station_id: string,
        parliament_id: string,

    }
) {
    const workbook = new ExcelJS.Workbook();

    // Use csv.readFile instead of xlsx.readFile
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

    // console.log("Data: ", data);

    for (let i of data) {
        // const modifiedNoPili = `${i.station_code}-${i.zon}-${i.no_pili.toString().padStart(3, '0')}`;
        const modifiedNoPili = `BJG-${i.zon}-${i.no_pili.toString().padStart(3, '0')}`;
        const ZONE_ID = getZoneId(i.zon)?.id?.toString() ?? null;
        const SYSTEM_ADMIN_ID = '249';

        await insertFirehydrant({
            no_pili: modifiedNoPili,
            // code_pili: i.station_code,
            code_pili: "BJG",
            address: i.alamat,
            latitude: i.latitud,
            longitude: i.longitud,
            station_id: payload.station_id,
            state_id: payload.state_id,
            parliament_id: payload.parliament_id,
            zone_id: ZONE_ID,
            status_id: i.id_status_pili.toString(),
            ownership_id: i.id_pemilikan_pili.toString(),
            fhtype_id: i.id_jenis_pili.toString(),
            created_by: SYSTEM_ADMIN_ID,
            source_creation: "Add",
            //TODO: add installation_date, maybe
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
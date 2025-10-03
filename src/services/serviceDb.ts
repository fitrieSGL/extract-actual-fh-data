import { insertFirehydrant } from '../db/db';
import * as ExcelJS from 'exceljs';


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
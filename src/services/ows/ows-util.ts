import { writeCsv } from "../../services/utils/csvService";
import * as ExcelJS from 'exceljs';
import fs from "fs/promises";


const mappingOWSKey = {
    address: "Alamat", //! Required
    latitude: "Latitud", //! Required
    longitude: "Longitud", //! Required
    status_id: "ID Status", //! Required
    capacity_id: "ID Kapasiti", //! Required
    type_id: "ID Jenis", //! Required
    station_id: "ID Balai", //! Required
    state_id: "ID Negeri", //! Required
    district_id: "ID Daerah",
    parliament_id: "ID Parlimen",
    dun_id: "ID DUN",

    //location
}

export async function generateTemplateImportOwsCSV() {
    const listDataForCSV = [
        {
            [mappingOWSKey.address]: "Air Terjun test",
            [mappingOWSKey.latitude]: 3.076546,
            [mappingOWSKey.longitude]: 101.520264,
            [mappingOWSKey.status_id]: "QBe0on",
            [mappingOWSKey.capacity_id]: "zA7khz",
            [mappingOWSKey.type_id]: "6cfb69",
            [mappingOWSKey.station_id]: "AHM",
            [mappingOWSKey.state_id]: "MK",
            [mappingOWSKey.district_id]: "zoiukz",
            [mappingOWSKey.parliament_id]: "P.138",
            [mappingOWSKey.dun_id]: "N.16",


            // "created_by": 249, // Admin
            //TODO: generate in DB
            // "location": "POINT (101.678021 3.135237)" 
        }
    ];

    await writeCsv("C:/Users/Fitrie/Downloads/template-ows-import.csv", listDataForCSV);
}




export async function createOWSImportLookup(
    pathExport: string
) {
    const workbook = new ExcelJS.Workbook();
    await sheetOWSStatus(workbook);
    await sheetOWSCapacity(workbook)
    await sheetOWSType(workbook);
    await sheetBalai(workbook);
    await sheetState(workbook);
    await sheetDistrict(workbook);
    await sheetParlimen(workbook);
    await sheetDUN(workbook);

    // Save file
    await workbook.xlsx.writeFile(pathExport);
}


async function sheetBalai(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Balai");
    const raw = await fs.readFile(
        "C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-balai.json",
        "utf-8"
    );
    const listData = JSON.parse(raw);

    sheet.columns = [
        { header: "Kod", key: "station_code", width: 8 },
        { header: "Nama Balai", key: "name", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listModifiedData = listData.map((item: any) => ({
        station_code: item.station_code,
        name: item.name,
    }));

    listModifiedData.forEach((row: any) => sheet.addRow(row));

}

async function sheetState(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Negeri");
    const [
        state
    ] = await Promise.all([
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/list-state.json")
    ]);

    sheet.columns = [
        { header: "Kod", key: "state2_code", width: 8 },
        { header: "Negeri", key: "name", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listData = state.data.map(item => ({
        state2_code: item.state2_code,
        name: item.name,
    }));

    listData.forEach((row) => sheet.addRow(row));
}

async function sheetParlimen(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Parlimen");
    const raw = await fs.readFile(
        "C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-parlimen.json",
        "utf-8"
    );
    const listData = JSON.parse(raw);

    sheet.columns = [
        { header: "Kod", key: "parliament_code", width: 8 },
        { header: "Nama", key: "name", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listModifiedData = listData.map((item: any) => ({
        parliament_code: item.parliament_code,
        name: item.name,
    }));

    listModifiedData.forEach((row: any) => sheet.addRow(row));
}

async function sheetDUN(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("DUN");
    const raw = await fs.readFile(
        "C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-dun.json",
        "utf-8"
    );
    const listData = JSON.parse(raw);

    sheet.columns = [
        { header: "Kod", key: "dun_code", width: 8 },
        { header: "Nama", key: "name", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listModifiedData = listData.map((item: any) => ({
        dun_code: item.dun_code,
        name: item.name,
    }));

    listModifiedData.forEach((row: any) => sheet.addRow(row));
}

async function sheetDistrict(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Daerah");
    const raw = await fs.readFile(
        "C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-daerah.json",
        "utf-8"
    );
    const listData = JSON.parse(raw);

    sheet.columns = [
        { header: "ID", key: "secondary_id", width: 8 },
        { header: "Nama", key: "name", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listModifiedData = listData.map((item: any) => ({
        secondary_id: item.secondary_id,
        name: item.name,
    }));

    listModifiedData.forEach((row: any) => sheet.addRow(row));
}

// async function sheetZone(workbook: ExcelJS.Workbook) {
//     const sheet = workbook.addWorksheet("Zon");
//     const raw = await fs.readFile(
//         "C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/zone.json",
//         "utf-8"
//     );
//     const listData = JSON.parse(raw);

//     sheet.columns = [
//         { header: "ID", key: "id", width: 8 },
//         { header: "Nama", key: "name", width: 20 },
//     ];
//     sheet.getRow(1).font = { bold: true };

//     const listModifiedData = listData.map((item: any) => ({
//         id: item.id,
//         name: item.name,
//     }));

//     listModifiedData.forEach((row: any) => sheet.addRow(row));
// }

async function sheetOWSStatus(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Status");

    const listData: {
        id: number,
        secondary_id: string,
        name_my: string,
    }[] = [
            {
                id: 1,
                secondary_id: "QBe0on",
                name_my: "Boleh diakses",
            },
            {
                id: 2,
                secondary_id: "AubNNB",
                name_my: "Tidak boleh diakses",
            },
        ];

    sheet.columns = [
        { header: "ID", key: "secondary_id", width: 8 },
        { header: "Jenis", key: "name_my", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listModifiedData = listData.map(item => ({
        secondary_id: item.secondary_id,
        name_my: item.name_my,
    }));

    listModifiedData.forEach((row) => sheet.addRow(row));

}

async function sheetOWSCapacity(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Kapasiti");

    const listData: {
        id: number,
        secondary_id: string,
        type: string,
    }[] = [
            {
                id: 1,
                secondary_id: "zA7khz",
                type: "<20000 liter",
            },
            {
                id: 2,
                secondary_id: "Q64vaT",
                type: ">20000 liter",
            }
        ];

    sheet.columns = [
        { header: "ID", key: "secondary_id", width: 8 },
        { header: "Jenis", key: "type", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listModifiedData = listData.map(item => ({
        secondary_id: item.secondary_id,
        type: item.type,
    }));

    listModifiedData.forEach((row) => sheet.addRow(row));
}


async function sheetOWSType(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Jenis");

    const listData: {
        id: string,
        secondary_id: string,
        name_my: string,
    }[] = [
            {
                id: "6cfb6999-5c29-464d-894e-e92959f8d9e8",
                secondary_id: "6cfb69",
                name_my: "Air Terjun"
            },
            {
                id: "81dee200-6844-4608-bf86-61a5a4a24a73",
                secondary_id: "81dee2",
                name_my: "Tasik"
            },
            {
                id: "b1fd1feb-0e48-4152-8c96-fedf7a3ab0bc",
                secondary_id: "b1fd1f",
                name_my: "Sungai"
            },
            {
                id: "b76dcff1-be5d-4eb7-a445-8a7c6a1afb0c",
                secondary_id: "b76dcf",
                name_my: "Kolam"
            },
            {
                id: "bbbcf3a7-4587-463b-a79b-65fbc6fe59ad",
                secondary_id: "bbbcf3",
                name_my: "Lombong"
            },
            {
                id: "64aba470-0445-4f87-b2ad-9fa1cc46103c",
                secondary_id: "64aba4",
                name_my: "Empangan"
            },
            {
                id: "a9c9e2e1-35bc-4a82-976c-3a312efc3134",
                secondary_id: "a9c9e2",
                name_my: "Parit"
            },
            {
                id: "fe57b4b9-6b58-4b09-ac00-0762a7607b2d",
                secondary_id: "fe57b4",
                name_my: "Water Check Dam"
            },
            {
                id: "a9690b13-93cf-4a91-bda1-f16eccc3724e",
                secondary_id: "a9690b",
                name_my: "Perigi Tiub"
            },
        ];

    sheet.columns = [
        { header: "ID", key: "secondary_id", width: 8 },
        { header: "Jenis", key: "name_my", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listModifiedData = listData.map(item => ({
        secondary_id: item.secondary_id,
        name_my: item.name_my,
    }));

    listModifiedData.forEach((row) => sheet.addRow(row));

}


// async function mappingLookupWithData() {
//     //TODO: do mapping for import data
// }
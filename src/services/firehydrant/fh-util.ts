import { writeCsv } from "../../services/utils/csvService";
import * as ExcelJS from 'exceljs';
import fs from "fs/promises";

const mappingFhKey = {
    no_pili: "No Pili Bomba",
    code_pili: "Kod Pili",
    isHaveMainPipe: "Ada Paip Utama (YA / TIDAK)",
    mainPipeSize: "Saiz Paip Utama",
    distanceFromNearestStation: "Balai Bomba Terdekat (km)",
    distanceFromNearestFireHydrant: "Dari Pili Bomba Terdekat (meter)",
    distanceFromOpenWaterSources: "Dari Sumber Air Terbuka (meter)",
    waterProduction: "Pengeluaran Air (LPM)",
    staticWaterPressure: "Tekanan Air Statik (Bar)",
    currentWaterPressure: "Tekanan Air Semasa (Bar)",
    totalPopulation: "Jumlah Populasi",
    totalPremises: "Jumlah Premis",
    totalBuildingOver4floors: "Bangunan melebihi 4 tingkat",
    is_has_industry_risk: "Risiko Industri? (YA / TIDAK)",
    is_has_housing_risk: "Risiko Perumahan? (YA / TIDAK)",
    is_has_school_risk: "Risiko Sekolah? (YA / TIDAK)",
    otherRisks:"Risiko lain yang wujud",
    address: "Alamat",
    latitude: "Latitud",
    longitude: "Longitud",
    postcode: "Poskod",
    installation_date: "Tarikh Pemasangan",
    external_station_id: "ID Balai",
    state_id: "ID Negeri",
    district_id: "ID Daerah",
    parliament_id: "ID Parlimen",
    assemblymen_id: "ID DUN",
    zone_id: "ID Zon",
    fhtype_id: "ID Jenis Pili",
    ownership_id: "ID Jenis Pemilikan Pili",
    status_id: "ID Status Pili",   
}

export async function generateTemplateImportFireHydrantCSV() {
    const listDataForCSV = [
        {
            /**
             * no_pili
             * !Required
             */
            [mappingFhKey.no_pili]: "BJG-H-262",
            /**
             * code_pili
             * !Required
             */
            [mappingFhKey.code_pili]: "BJG",
            /**
             * isHaveMainPipe
             * Leave blank if null
             * YA / TIDAK
             */
            [mappingFhKey.isHaveMainPipe]: "YA",
            /**
             * mainPipeSize
             * Leave blank if null
             */
            [mappingFhKey.mainPipeSize]: 8,
            /**
             * distanceFromNearestStation
             * Leave blank if null
             */
            [mappingFhKey.distanceFromNearestStation]: 22,
            /**
             * distanceFromNearestFireHydrant
             * Leave blank if null
             */
            [mappingFhKey.distanceFromNearestStation]: 2,
            /**
             * distanceFromOpenWaterSources
             * Leave blank if null
             */
            [mappingFhKey.distanceFromOpenWaterSources]: 2,
            /**
             * waterProduction
             * Leave blank if null
             */
            [mappingFhKey.waterProduction]: 2,
            /**
             * staticWaterPressure
             * Leave blank if null
             */
            [mappingFhKey.staticWaterPressure]: 2,
            /**
             * currentWaterPressure
             * Leave blank if null
             */
            [mappingFhKey.currentWaterPressure]: 2,
            /**
             * totalPopulation
             * Leave blank if null
             */
            [mappingFhKey.totalPopulation]: 2,
            /**
             * totalPremises
             * Leave blank if null
             */
            [mappingFhKey.totalPremises]: 2,
            /**
             * totalBuildingOver4floors
             * Leave blank if null
             * YA / TIDAK
             */
            [mappingFhKey.totalBuildingOver4floors]: null,
            /**
             * is_has_industry_risk
             * !Required
             * YA / TIDAK
             */
            [mappingFhKey.is_has_industry_risk]: "YA",
            /**
             * is_has_housing_risk
             * !Required
             * YA / TIDAK
             */
            [mappingFhKey.is_has_housing_risk]: "TIDAK",
            /**
             * is_has_school_risk
             * !Required
             * YA / TIDAK
             */
            [mappingFhKey.is_has_school_risk]: "TIDAK",
            /**
             * otherRisks
             * Leave blank if null
             */
            [mappingFhKey.otherRisks]: "test",
            /**
             * address
             * !Required
             */
            [mappingFhKey.address]: "4429, Jalan Negeri Sembilan Selatan, Bukit Persekutuan, 50480 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
            /**
             * latitude
             * Leave blank if null
             */
            [mappingFhKey.latitude]: 3.135237,
            /**
             * longitude
             * Leave blank if null
             */
            [mappingFhKey.longitude]: 101.678021,
            /**
             * postcode
             * Leave blank if null
             */
            [mappingFhKey.postcode]: "50480",
            /**
             * installation_date
             * Format DD/MM/YYYY HH:MM
             * Leave blank if null
             */
            [mappingFhKey.installation_date]: "26/01/2026 13:20",
            /**
             * external_station_id
             * ! Required
             * Format Station code
             */
            [mappingFhKey.external_station_id]: "BJG",
            /**
             * state_id
             * ! Required
             * Format State code
             */
            [mappingFhKey.state_id]: "PJ",
            /**
             * district_id
             * Leave blank if null
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            [mappingFhKey.district_id]: "81466726-037a-4e92-81cf-72316eb8d446",
            /**
             * parliament_id
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            [mappingFhKey.parliament_id]: "P.001",
            /**
             * assemblymen_id
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            [mappingFhKey.assemblymen_id]: "N.01",
            /**
             * zone_id
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            [mappingFhKey.zone_id]: 1,
            /**
             * fhtype_id
             * Map out the id
             * dont use direct db id
             * Map out this id, use like 1,2,3
             */
            [mappingFhKey.fhtype_id]: "QBe0on",
            /**
             * ownership_id
             * Map out the id
             * dont use direct db id
             * Map out this id, use like 1,2,3
             */
            [mappingFhKey.ownership_id]: "zA7khz",
            /**
             * status_id
             * Map out the id
             * dont use direct db id
             * Map out this id, use like 1,2,3
             */
            [mappingFhKey.status_id]: "gbBdiu",



            
            // "created_by": 249, // Admin
            //TODO: generate in DB
            // "location": "POINT (101.678021 3.135237)" 
        }
    ];

    await writeCsv("C:/Users/Fitrie/Downloads/template-fire-hydrant-import.csv", listDataForCSV);
}




export async function createFHImportLookup(
    pathExport: string
) {
    const workbook = new ExcelJS.Workbook();
    await sheetBalai(workbook);
    await sheetState(workbook);
    await sheetDistrict(workbook);
    await sheetParlimen(workbook);
    await sheetDUN(workbook);
    await sheetZone(workbook);
    sheetFhType(workbook);
    sheetFhOwnership(workbook);
    sheetFhStatus(workbook);

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

async function sheetZone(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Zon");
    const raw = await fs.readFile(
        "C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/zone.json",
        "utf-8"
    );
    const listData = JSON.parse(raw);

    sheet.columns = [
        { header: "ID", key: "id", width: 8 },
        { header: "Nama", key: "name", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listModifiedData = listData.map((item: any) => ({
        id: item.id,
        name: item.name,
    }));

    listModifiedData.forEach((row: any) => sheet.addRow(row));
}

async function sheetFhType(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Jenis Pili");

    const listData: {
        id: number,
        secondary_id: string,
        type_my: string,
    }[] = [
            {
                id: 1,
                secondary_id: "QBe0on",
                type_my: "Pillar",
            },
            {
                id: 2,
                secondary_id: "AubNNB",
                type_my: "Ground",
            },
            {
                id: 3,
                secondary_id: "Ofi1Gk",
                type_my: "Pressurized",
            },
        ];

    sheet.columns = [
        { header: "ID", key: "secondary_id", width: 8 },
        { header: "Jenis", key: "type_my", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listModifiedData = listData.map(item => ({
        secondary_id: item.secondary_id,
        type_my: item.type_my,
    }));

    listModifiedData.forEach((row) => sheet.addRow(row));

}

async function sheetFhOwnership(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Pemilikan Pili");

    const listData: {
        id: number,
        secondary_id: string,
        type_my: string,
    }[] = [
            {
                id: 2,
                secondary_id: "zA7khz",
                type_my: "Swasta",
            },
            {
                id: 1,
                secondary_id: "Q64vaT",
                type_my: "Awam",
            }
        ];

    sheet.columns = [
        { header: "ID", key: "secondary_id", width: 8 },
        { header: "Jenis", key: "type_my", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listModifiedData = listData.map(item => ({
        secondary_id: item.secondary_id,
        type_my: item.type_my,
    }));

    listModifiedData.forEach((row) => sheet.addRow(row));
}

async function sheetDistrict(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Daerah");
    const raw = await fs.readFile(
        "C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-daerah.json",
        "utf-8"
    );
    const listData = JSON.parse(raw);

    sheet.columns = [
        { header: "ID", key: "id", width: 8 },
        { header: "Jenis", key: "name", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    const listModifiedData = listData.map((item: any) => ({
        id: item.id,
        name: item.name,
    }));

    listModifiedData.forEach((row: any) => sheet.addRow(row));
}


async function sheetFhStatus(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Status Pili");

    const listData: {
        id: number,
        secondary_id: string,
        name_my: string,
    }[] = [
            {
                id: 1,
                secondary_id: "gbBdiu",
                name_my: "Berfungsi",
            },
            {
                id: 2,
                secondary_id: "QpwEtN",
                name_my: "Terjejas",
            },
            {
                id: 3,
                secondary_id: "B33hni",
                name_my: "Tidak Berfungsi",
            },
            // {
            //     "id": 4,
            //     "name": "Installation",
            //     "name_my": "Pemasangan",
            //     "create_at": "2025-07-22T03:17:09.481Z",
            //     "hex_color": null
            // }
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


async function mappingLookupWithData(){
    //TODO: do mapping for import data
}
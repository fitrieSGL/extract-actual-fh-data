import dayjs from "dayjs";
import { insertFirehydrantWithTransaction, insertFirehydrantWithTransactionV2 } from "../../db/firehydrant/db";
import { readCsv, readExcelFile, writeCsv } from "../../services/utils/csvService";
import * as ExcelJS from 'exceljs';
import fs from "fs/promises";
import z from "zod";
import { readXlsx } from "../../services/utils/excelService";

const mappingFhKey = {
    no_pili: "No Pili Bomba", //* Required
    code_pili: "Kod Pili", //* Required
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
    is_has_industry_risk: "Risiko Industri? (YA / TIDAK)", //* Required
    is_has_housing_risk: "Risiko Perumahan? (YA / TIDAK)", //* Required
    is_has_school_risk: "Risiko Sekolah? (YA / TIDAK)", //* Required
    otherRisks: "Risiko lain yang wujud", //* Required
    address: "Alamat", //* Required
    latitude: "Latitud",
    longitude: "Longitud",
    postcode: "Poskod",
    installation_date: "Tarikh Pemasangan",
    external_station_id: "ID Balai", //* Required
    state_id: "ID Negeri", //* Required
    district_id: "ID Daerah",
    parliament_id: "ID Parlimen",
    assemblymen_id: "ID DUN",
    zone_id: "ID Zon",
    fhtype_id: "ID Jenis Pili",
    ownership_id: "ID Jenis Pemilikan Pili",
    status_id: "ID Status Pili",
}

const itemImportFHSchema = z.object({
    no_pili: z.string(),
    code_pili: z.string(),
    isHaveMainPipe: z.enum(['YA', 'TIDAK']).nullish().transform(val => val == null ? val : val === 'YA'),
    mainPipeSize: z.number().nullish(),
    distanceFromNearestStation: z.number().nullish(),
    distanceFromNearestFireHydrant: z.number().nullish(),
    distanceFromOpenWaterSources: z.number().nullish(),
    waterProduction: z.number().nullish(),
    staticWaterPressure: z.number().nullish(),
    currentWaterPressure: z.number().nullish(),
    totalPopulation: z.number().nullish(),
    totalPremises: z.number().nullish(),
    totalBuildingOver4floors: z.number().nullish().transform(val => val ?? null),
    is_has_industry_risk: z.enum(['YA', 'TIDAK']).transform(val => val == null ? val : val === 'YA'),
    is_has_housing_risk: z.enum(['YA', 'TIDAK']).transform(val => val == null ? val : val === 'YA'),
    is_has_school_risk: z.enum(['YA', 'TIDAK']).transform(val => val == null ? val : val === 'YA'),
    otherRisks: z.string(),
    address: z.string(),
    latitude: z.number().nullish(),
    longitude: z.number().nullish(),
    postcode: z.number().nullish(),
    installation_date: z.string().nullish().transform(val => {
        if (!val) return null;
        const parsed = dayjs(val, 'D/M/YYYY H:mm');
        return parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm:ss') : null;
    }),
    external_station_id: z.string(),
    state_id: z.string(),
    district_id: z.string().nullish(),
    parliament_id: z.string().nullish(),
    assemblymen_id: z.string().nullish(),
    zone_id: z.number().nullish(),
    fhtype_id: z.string().nullish(),
    ownership_id: z.string().nullish(),
    status_id: z.string().nullish(),
});
type itemImportFHType = z.infer<typeof itemImportFHSchema>;
const listItemImportFHSchema = z.array(itemImportFHSchema);

function validateListItemImportFHSchema(listData: any) {
    return listItemImportFHSchema.parse(listData);
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



// export async function generateDistrictSecondary() {
//     const raw = await fs.readFile(
//         "C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-daerah.json",
//         "utf-8"
//     );
//     const listData = JSON.parse(raw);

//     const randomLetters = (len: number) =>
//         Array.from(crypto.randomBytes(len))
//             .map(b => String.fromCharCode(97 + (b % 26)))
//             .join("");
//     const listModifiedData = listData.map((item: any) => ({
//         ...item,
//         secondary_id: randomLetters(6)
//     }));

//     await writeCsv("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/csv/senarai-daerah.csv", listModifiedData);

// }


export async function importFHExcelToDB() {
    const listData = await readXlsx('C:/Users/Fitrie/Downloads/template-fire-hydrant-import.xlsx');
    const reversedMapping = Object.fromEntries(
        Object.entries(mappingFhKey).map(([key, value]) => [value, key])
    );

    // Remap each row from Excel headers to camelCase keys
    const remappedData = listData.map(item => {
        return Object.fromEntries(
            Object.entries(item).map(([excelHeader, value]) => {
                const mappedKey = reversedMapping[excelHeader] ?? excelHeader;
                return [mappedKey, value];
            })
        );
    });

    // console.log(remappedData.slice(0, 30));

    const validatedData = validateListItemImportFHSchema(remappedData);
    const listExtractedData = await Promise.all(
        validatedData.map(async (item: itemImportFHType) => {
            return {
                ...item,
                state_id: await getState(item.state_id),
                external_station_id: await getStation(item.external_station_id),
                district_id: await getDistrict(item.district_id as any),
                parliament_id: await getParliament(item.parliament_id as any),
                assemblymen_id: await getAssemblymen(item.state_id, item.assemblymen_id as any),
                status_id: await getStatus(item.status_id as any),
                fhtype_id: await getFhType(item.fhtype_id as any),
                ownership_id: await getOwnership(item.ownership_id as any),
            }
        })
    );

    // console.log("listExtractedData: ", listExtractedData.slice(0, 10));
    // console.log("listExtractedData: ", listExtractedData.filter(item => item.assemblymen_id));
    // console.log("length: ", listExtractedData.length);

    for (const item of listExtractedData) {
        await insertFirehydrantWithTransactionV2({
            no_pili: item.no_pili,
            code_pili: item.code_pili,
            isHaveMainPipe: item.isHaveMainPipe,
            mainPipeSize: item.mainPipeSize,
            distanceFromNearestStation: item.distanceFromNearestStation,
            distanceFromNearestFireHydrant: item.distanceFromNearestFireHydrant,
            distanceFromOpenWaterSources: item.distanceFromOpenWaterSources,
            waterProduction: item.waterProduction,
            staticWaterPressure: item.staticWaterPressure,
            currentWaterPressure: item.currentWaterPressure,
            totalPopulation: item.totalPopulation,
            totalPremises: item.totalPremises,
            totalBuildingOver4floors: item.totalBuildingOver4floors,
            is_has_industry_risk: item.is_has_industry_risk,
            is_has_housing_risk: item.is_has_housing_risk,
            is_has_school_risk: item.is_has_school_risk,
            otherRisks: item.otherRisks,
            address: item.address,
            latitude: item.latitude,
            longitude: item.longitude,
            postcode: item.postcode,
            installation_date: item.installation_date,
            external_station_id: item.external_station_id!,
            state_id: item.state_id!,
            district_id: item.district_id,
            parliament_id: item.parliament_id,
            assemblymen_id: item.assemblymen_id,
            zone_id: item.zone_id,
            fhtype_id: item.fhtype_id as any,
            ownership_id: item.ownership_id as any,
            status_id: item.status_id as any,
            created_by: 249,
        });
    }
}



export async function getState(stateCode: string) {
    const stateImport = await import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-negeri.json');
    const listState = stateImport.data;

    return listState.find(item => item.state2_code === stateCode)?.id ?? null;
}

export async function getStation(stationCode: string) {
    const { default: stationList } = await import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-balai.json');
    const result = stationList.find(item => item.station_code === stationCode)?.id ?? null;
    return result;
}

export async function getDistrict(secondary_id: string) {
    const { default: districts } = await import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-daerah.json');
    return districts.find(item => item.secondary_id === secondary_id)?.id ?? null;
}

export async function getParliament(secondary_id: string) {
    const { default: parliaments } = await import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-parlimen.json');
    return parliaments.find(item => item.parliament_code === secondary_id)?.id ?? null;
}

export async function getAssemblymen(
    state_code: string,
    dun_code: string
) {
    const { default: DUNS } = await import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-dun.json');
    const state_id = await getState(state_code);

    return DUNS
        .filter(item => item.state_id === state_id)
        .find(item => item.dun_code === dun_code)?.id ?? null;
}

export async function getStatus(secondary_id: string) {
    switch (secondary_id) {
        case "gbBdiu": {
            return 1;
        }
        case "QpwEtN": {
            return 2;
        }
        case "B33hni": {
            return 3;
        }
    }
}

export async function getFhType(secondary_id: string) {
    switch (secondary_id) {
        case "QBe0on": {
            return 1;
        }
        case "AubNNB": {
            return 2;
        }
        case "Ofi1Gk": {
            return 3;
        }
    }
}

export async function getOwnership(secondary_id: string) {
    switch (secondary_id) {
        case "Q64vaT": {
            return 1;
        }
        case "zA7khz": {
            return 2;
        }
    }
}


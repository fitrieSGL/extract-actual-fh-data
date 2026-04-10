import { writeCsv } from "../../services/utils/csvService";
import * as ExcelJS from 'exceljs';

export async function generateTemplateImportFireHydrantCSV() {
    const listDataForCSV = [
        {
            /**
             * no_pili
             * !Required
             */
            ["No Pili Bomba"]: "BJG-H-262",
            /**
             * code_pili
             * !Required
             */
            ["Code Pili"]: "BJG",
            /**
             * isHaveMainPipe
             * Leave blank if null
             * YA / TIDAK
             */
            ["Ada Paip Utama (YA / TIDAK)"]: "YA",
            /**
             * mainPipeSize
             * Leave blank if null
             */
            ["Saiz Paip Utama"]: 8,
            /**
             * distanceFromNearestStation
             * Leave blank if null
             */
            ["Balai Bomba Terdekat (km)"]: 22,
            /**
             * distanceFromNearestFireHydrant
             * Leave blank if null
             */
            ["Dari Pili Bomba Terdekat (meter)"]: 2,
            /**
             * distanceFromOpenWaterSources
             * Leave blank if null
             */
            ["Dari Sumber Air Terbuka (meter)"]: 2,
            /**
             * waterProduction
             * Leave blank if null
             */
            ["Pengeluaran Air (LPM)"]: 2,
            /**
             * staticWaterPressure
             * Leave blank if null
             */
            ["Tekanan Air Statik (Bar)"]: 2,
            /**
             * currentWaterPressure
             * Leave blank if null
             */
            ["Tekanan Air Semasa (Bar)"]: 2,
            /**
             * totalPopulation
             * Leave blank if null
             */
            ["Jumlah Populasi"]: 2,
            /**
             * totalPremises
             * Leave blank if null
             */
            ["Jumlah Premis"]: 2,
            /**
             * totalBuildingOver4floors
             * Leave blank if null
             * YA / TIDAK
             */
            ["Bangunan melebihi 4 tingkat"]: null,
            /**
             * is_has_industry_risk
             * !Required
             * YA / TIDAK
             */
            ["Risiko Industri? (YA / TIDAK)"]: "YA",
            /**
             * is_has_housing_risk
             * !Required
             * YA / TIDAK
             */
            ["Risiko Perumahan? (YA / TIDAK)"]: "TIDAK",
            /**
             * is_has_school_risk
             * !Required
             * YA / TIDAK
             */
            ["Risiko Sekolah? (YA / TIDAK)"]: "TIDAK",
            /**
             * otherRisks
             * Leave blank if null
             */
            ["Risiko lain yang wujud"]: "test",
            /**
             * address
             * !Required
             */
            ["Alamat"]: "4429, Jalan Negeri Sembilan Selatan, Bukit Persekutuan, 50480 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
            /**
             * latitude
             * Leave blank if null
             */
            ["Latitud"]: 3.135237,
            /**
             * longitude
             * Leave blank if null
             */
            ["Longitud"]: 101.678021,
            /**
             * postcode
             * Leave blank if null
             */
            ["Poskod"]: "50480",
            /**
             * installation_date
             * Format DD/MM/YYYY HH:MM
             * Leave blank if null
             */
            ["Tarikh Pemasangan"]: "26/01/2026 13:20",
            /**
             * external_station_id
             * ! Required
             * Format Station code
             */
            ["ID Balai"]: "BJG",
            /**
             * state_id
             * ! Required
             * Format State code
             */
            ["ID Negeri"]: "PJ",
            /**
             * district_id
             * Leave blank if null
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            ["ID Daerah"]: null,
            /**
             * parliament_id
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            ["ID Parlimen"]: 1,
            /**
             * assemblymen_id
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            ["ID DUN"]: "",
            /**
             * zone_id
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            ["ID Zon"]: 1,
            /**
             * fhtype_id
             * Map out the id
             * dont use direct db id
             * Map out this id, use like 1,2,3
             */
            ["ID Jenis Pili"]: 1,
            /**
             * ownership_id
             * Map out the id
             * dont use direct db id
             * Map out this id, use like 1,2,3
             */
            ["ID Jenis Pemilikan Pili"]: 1,
            /**
             * status_id
             * Map out the id
             * dont use direct db id
             * Map out this id, use like 1,2,3
             */
            ["ID Status Pili"]: 1,




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
    //TODO: sheet parliament
    //TODO: sheet dun
    //TODO: sheet zone
    sheetFhType(workbook);
    sheetFhOwnership(workbook);
    sheetFhStatus(workbook);

    // Save file
    await workbook.xlsx.writeFile(pathExport);
}


async function sheetBalai(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Balai");

    const [
        johor,
        kedah,
        kelantan,
        kualaLumpur,
        labuan,
        melaka,
        negeriSembilan,
        pahang,
        perak,
        perlis,
        pulauPinang,
        putrajaya,
        sabah,
        sarawak,
        selangor,
        terengganu,
    ] = await Promise.all([
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/johor.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/kedah.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/kelantan.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/kuala-lumpur.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/labuan.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/melaka.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/negeri-sembilan.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/pahang.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/perak.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/perlis.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/pulau-pinang.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/putrajaya.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/sabah.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/sarawak.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/selangor.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/terengganu.json")
    ]);

    const allStations = [
        ...johor.data,
        ...kedah.data,
        ...kelantan.data,
        ...kualaLumpur.data,
        ...labuan.data,
        ...melaka.data,
        ...negeriSembilan.data,
        ...pahang.data,
        ...perak.data,
        ...perlis.data,
        ...pulauPinang.data,
        ...putrajaya.data,
        ...sabah.data,
        ...sarawak.data,
        ...selangor.data,
        ...terengganu.data,
    ];

    sheet.columns = [
        { header: "Kod", key: "station_code", width: 8 },
        { header: "Nama Balai", key: "name", width: 20 },
    ];

    const listData = allStations.map(item => ({
        station_code: item.station_code,
        name: item.name,
    }));

    listData.forEach((row) => sheet.addRow(row));

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

    const listData = state.data.map(item => ({
        state2_code: item.state2_code,
        name: item.name,
    }));

    listData.forEach((row) => sheet.addRow(row));
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

    const listModifiedData = listData.map(item => ({
        secondary_id: item.secondary_id,
        type_my: item.type_my,
    }));

    listModifiedData.forEach((row) => sheet.addRow(row));
}

async function sheetDistrict(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet("Daerah");

    const [
        johor,
        kedah,
        kelantan,
        melaka,
        negeriSembilan,
        pahang,
        perak,
        perlis,
        pulauPinang,
        sabah,
        sarawak,
        selangor,
        terengganu,
    ] = await Promise.all([
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/johor.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/kedah.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/kelantan.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/melaka.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/negeri-sembilan.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/pahang.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/perak.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/perlis.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/pulau-pinang.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/sabah.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/sarawak.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/selangor.json"),
        import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/district/terengganu.json")
    ]);

    const allDistricts = [
        ...johor.data,
        ...kedah.data,
        ...kelantan.data,
        ...melaka.data,
        ...negeriSembilan.data,
        ...pahang.data,
        ...perak.data,
        ...perlis.data,
        ...pulauPinang.data,
        ...sabah.data,
        ...sarawak.data,
        ...selangor.data,
        ...terengganu.data,
    ];

    sheet.columns = [
        { header: "ID", key: "id", width: 8 },
        { header: "Jenis", key: "name", width: 20 },
    ];

    const listModifiedData = allDistricts.map(item => ({
        id: item.id,
        name: item.name,
    }));

    listModifiedData.forEach((row) => sheet.addRow(row));
}
//TODO: sheet parliament
//TODO: sheet dun


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

    const listModifiedData = listData.map(item => ({
        secondary_id: item.secondary_id,
        name_my: item.name_my,
    }));

    listModifiedData.forEach((row) => sheet.addRow(row));

}
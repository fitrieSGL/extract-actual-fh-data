import { readCsv, writeCsv } from "../utils/csvService";
import z, { nullish } from "zod";
import dunsData from 'C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-dun.json';
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { insertFirehydrantWithTransactionV3 } from "../../db/firehydrant/db";
dayjs.extend(customParseFormat);


const dataCsvImportSchema = z.object({
    Parliament: z.string().nullish(),
    State: z.string(),
    ["Asset No"]: z.string(),
    // Asset Group
    DUN: z.string().nullish(),
    // Area: z.string().nullish(),
    City: z.string().nullish(),
    // Position: 
    Status: z
        .enum(["BERFUNGSI", "TERJEJAS", "TIDAK BERFUNGSI", "HILANG"])
        .transform(item => {
            if (item === "HILANG") {
                return "TIDAK BERFUNGSI";
            }
            return item;
        }),
    Location: z.string(), // ZON D
    ["Balai Name"]: z.string(),
    Section: z.enum(["AWAM", "SWASTA", "Awam", "Swasta"]),
    Type: z
        .enum(["Pillar Hydrant", "Ground Hydrant", "Pressurize Hydrant", "PILLAR HYDRANT", "GROUND HYDRANT", "PRESSURIZE HYDRANT"])
        .default("PILLAR HYDRANT")
        .transform(item => {
            return item.toUpperCase();
        }),
    Timestamp: z.string()
        .transform((val, ctx) => {
            const INVALID_DATE = "0000-00-00 00:00:00";
            // const FORMAT_DATE = 'D/M/YYYY H:mm';
            const FORMAT_DATE = ['D/M/YYYY H:mm', 'YYYY-MM-DD H:mm'];

            const normalized = val.trim().replace(/\s+/g, ' ');
            if (normalized === INVALID_DATE) {
                return null;
            }

            const parsed = dayjs(normalized, FORMAT_DATE, true); // true = strict mode

            if (!parsed.isValid()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Invalid date format, expected ${FORMAT_DATE}`,
                });
                return z.NEVER;
            }

            return parsed.toISOString(); // returns a native Date
        }),
    // Teman Pili Bomba: z.string().nullish(),	
    Latitude: z.number().nullish(),
    Longitude: z.number().nullish(),
    Address: z.string().nullish(),
});
const listDataCsvImportSchema = z.array(dataCsvImportSchema);
type DataCsvImportType = z.infer<typeof dataCsvImportSchema>;


const PATH_READ_CSV = 'C:/Users/Fitrie/Downloads/FROM BOMBA-selected/BBP LABUAN SENTRAL.csv';

export async function importFHToDBTwo() {
    try {
        const rawListData = await readCsv(PATH_READ_CSV);
        const filteredListData = rawListData.filter(item => item["Asset Group"] === "Fire Hydrant")
        // console.log(filteredListData);

        const listValidData = listDataCsvImportSchema.parse(filteredListData);
        // console.log(listValidData);

        const newListData = transformData(listValidData);
        // console.log(newListData);
        // console.log(newListData.length);

        for (const item of newListData) {
            await insertFirehydrantWithTransactionV3({
                no_pili: item.no_pili,
                code_pili: item.code_pili,
                isHaveMainPipe: undefined,
                mainPipeSize: undefined,
                distanceFromNearestStation: undefined,
                distanceFromNearestFireHydrant: undefined,
                distanceFromOpenWaterSources: undefined,
                waterProduction: undefined,
                staticWaterPressure: undefined,
                currentWaterPressure: undefined,
                totalPopulation: undefined,
                totalPremises: undefined,
                totalBuildingOver4floors: undefined,
                is_has_industry_risk: false,
                is_has_housing_risk: false,
                is_has_school_risk: false,
                otherRisks: undefined,
                address: item.address,
                latitude: item.latitude,
                longitude: item.longitude,
                postcode: undefined,
                installation_date: undefined,
                external_station_id: item.external_station_id,
                state_id: item.state_id!,
                district_id: item.district_id,
                parliament_id: item.parliament_id,
                assemblymen_id: item.assemblymen_id,
                zone_id: item.zone_id,
                fhtype_id: item.fhtype_id as any,
                ownership_id: item.ownership_id as any,
                status_id: item.status_id as any,
                created_at: item.created_at,
            });
        }

    } catch (error) {
        console.error(error);
    }
}


function transformData(
    listData: DataCsvImportType[]
) {
    return listData
        .filter(item => item.Address || item.Latitude)
        .map(item => {
            //TODO: kod balai is BLS
            const listWordRawNoPili = item["Asset No"].split("-");
            const noPili = `BLS-${listWordRawNoPili[1]}-${listWordRawNoPili[2]}`;
            // const noPili = item["Asset No"];
            const codePili = noPili.trim().split("-")[1];

            return {
                parliament_id: "39ce9e48-ebd4-4bee-a785-cdb63f32f507", //* use id
                state_id: "088204f8-fca5-4562-b3c0-21acf9d47bfe", //* use id
                assemblymen_id: getDun(item.DUN as any), //* use id
                district_id: "2350c72a-329d-489a-829f-f21371ccfb4d",
                status_id: getFhStatus(item.Status), //* use id
                zone_id: getFhZone(noPili),
                ownership_id: getFhOwnership(item.Section), //* use id
                fhtype_id: getFhType(item.Type), //* use id
                latitude: item.Latitude,
                longitude: item.Longitude,
                address: item?.Address || "-",
                external_station_id: "949977a2-d901-4563-a8cc-aa4640f9c48e",

                no_pili: noPili,
                code_pili: codePili,
                created_at: item.Timestamp,
            }
        })

}

function checkDuplicate(listData: ReturnType<typeof transformData>) {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const item of listData) {
        // normalize so "A01" and " a01 " count as the same value
        const key = String(item.no_pili).trim().toUpperCase();

        if (seen.has(key)) {
            duplicates.add(key);
        } else {
            seen.add(key);
        }
    }

    return {
        isUnique: duplicates.size === 0,
        duplicates: [...duplicates],
    };
}


function getFhType(type: string): number {
    switch (type) {
        case "PILLAR HYDRANT": {
            return 1;
        }
        case "GROUND HYDRANT": {
            return 2;
        }
        case "PRESSURIZE HYDRANT": {
            return 3;
        }
        default: {
            return 1;
        }
    }
}

function getFhOwnership(ownership: string): number {
    switch (ownership) {
        case "AWAM": {
            return 1;
        }
        case "SWASTA": {
            return 2;
        }
        default: {
            return 1;
        }
    }
}

function getFhStatus(status: string): number {
    switch (status) {
        case "BERFUNGSI": {
            return 1;
        }
        case "TERJEJAS": {
            return 3;
        }
        case "TIDAK BERFUNGSI": {
            return 3;
        }
        default: {
            return 1;
        }
    }
}


function getFhZone(noPili: string): number | undefined {
    const zone = noPili.split("-")[1];
    const zones = Array.from({ length: 26 }, (_, i) => ({
        zone: String.fromCharCode(65 + i), // 65 = "A"
        id: i + 1,
    }));

    return zones.find(item => item.zone === zone)?.id;
}


function getDun(dun: string | null): string | null {
    if (!dun) {
        return null;
    }

    return dunsData.find(item => item.name === dun)?.id || null;
}



export async function exportFhNotCorrectCsv(
    pathToExport: string
) {
    const rawListData = await readCsv(PATH_READ_CSV);
    const filteredListData = rawListData.filter(item => !item.Address && !item.Latitude);

    if (filteredListData.length === 0) {
        return;
    }

    console.log(filteredListData.length);
    writeCsv(pathToExport, filteredListData);
}
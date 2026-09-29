import z from "zod";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { readCsv, writeCsv } from "../utils/csvService";
import dunsData from 'C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-dun.json';
import { insertOwsWithTransactionV2 } from "../../db/ows/db";
dayjs.extend(customParseFormat);


const dataCsvImportSchema = z.object({
    Parliament: z.string().nullish(),
    State: z.string(),
    // ["Asset No"]: z.string(),
    // Asset Group
    DUN: z.string().nullish(),
    // Area: z.string().nullish(),
    City: z.string().nullish(),
    // Position: 
    // Status: z
    //     .enum(["BERFUNGSI", "TERJEJAS", "TIDAK BERFUNGSI", "HILANG"])
    //     .transform(item => {
    //         if (item === "HILANG") {
    //             return "TIDAK BERFUNGSI";
    //         }
    //         return item;
    //     }),
    // Location: z.string(), // ZON D
    ["Balai Name"]: z.string(),
    // Section: z.enum(["AWAM", "SWASTA", "Awam", "Swasta"]),
    Type: z.string().nullish(),
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

const PATH_READ_CSV = 'C:/Users/Fitrie/Downloads/FROM BOMBA-selected/BBP PENDANG.csv';

export async function importOws() {
    try {
        const rawListData = await readCsv
            (PATH_READ_CSV);
        const filteredListData = rawListData.filter(item => item["Asset Group"] === "Open Water Source")
        // console.log(filteredListData);

        const listValidData = listDataCsvImportSchema.parse(filteredListData);
        // console.log(listValidData);

        const newListData = transformData(listValidData);
        // console.log(newListData);
        // console.log(newListData.length);


        for (const item of newListData) {
            await insertOwsWithTransactionV2({
                parliament_id: item.parliament_id,
                state_id: item.state_id,
                dun_id: item.dun_id,
                district_id: item.district_id,
                latitude: item.latitude as any,
                longitude: item.longitude as any,
                address: item?.address || "-",
                station_id: item.station_id,
                status_id: item.status_id,
                type_id: item.type_id,

                reference_no: item.reference_no,
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
        .filter(item => item.Latitude && item.Longitude)
        .map((item, index) => {
            const reference_no = `PDG-OWS-${index.toString().padStart(3, "0")}`;
            return {
                parliament_id: "863035f0-d9d6-439b-a490-933ac0125cef",
                state_id: "a931d948-71ea-416b-bdf9-16523a1782cc",
                dun_id: getDun(item.DUN as any),
                district_id: "01f62b55-8262-4e04-889b-ce98feb4a126",
                latitude: item.Latitude,
                longitude: item.Longitude,
                address: item?.Address || "-",
                station_id: "eea21718-b21c-4b04-adaa-25c708803972",
                status_id: 1,
                type_id: getOwsType(item?.Type),

                reference_no,
                created_at: item.Timestamp,
            }
        })

}


function getDun(dun: string | null): string | null {
    if (!dun) {
        return null;
    }

    const transformDunName = capitalizeFirst(dun);
    return dunsData.find(item => item.name === transformDunName)?.id || null;
}

function capitalizeFirst(str: string) {
    const lowerCaseString = str.toLowerCase();
    return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
}


function getOwsType(openWaterType?: string | null): string | null {
    switch (openWaterType) {
        case "Tasik": {
            return "81dee200-6844-4608-bf86-61a5a4a24a73";
        }
        case "Sungai": {
            return "b1fd1feb-0e48-4152-8c96-fedf7a3ab0bc";
        }
        case "Parit": {
            return "a9c9e2e1-35bc-4a82-976c-3a312efc3134";
        }
        case "Kolam": {
            return "b76dcff1-be5d-4eb7-a445-8a7c6a1afb0c";
        }
        case "Laut": {
            return "81dee200-6844-4608-bf86-61a5a4a24a73";
        }
        case "Empangan / Kawasan Tadahan Air": {
            return "64aba470-0445-4f87-b2ad-9fa1cc46103c";
        }
        default: {
            return null;
        }
    }
}
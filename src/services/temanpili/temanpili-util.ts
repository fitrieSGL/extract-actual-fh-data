import { readCsv, readExcelFile, writeCsv } from "../../services/utils/csvService";
import { z } from "zod";
import dayjs from "dayjs";
// import { insertTemanPiliWithTransaction } from "db/temanpili/db";
import { insertTemanPiliWithTransaction } from "../../db/temanpili/db";
import { capitalizeWords, getState, getStation } from "./util/helper-id";


const mappingTemanPiliKey = {
    no_pili: "No Pili Bomba (*Required)",
    name: "Nama (*Required)",
    no_ic: "No Ic",
    email: "Emel",
    phone_no: "No. Telefon",
    address: "Alamat (*Required)",
    postcode: "Poskod",
    station_id: "ID Balai (*Required)",
    state_id: "ID Negeri (*Required)",
    district_id: "ID Daerah",
    occupation: "Pekerjaan",
    office_address: "Alaamat Pejabat",
    office_postcode: "Postkod Pejabat",
    office_state_id: "ID Negeri Pejabat",
    office_district_id: "ID Daerah Pejabat",
    gender: "Jantina (Lelaki / Perempuan / Tidak Diketahui)(*Required)",
    status: "Status (Aktif / Tidak Aktif)(*Required)",
    created_at: "Tarikh Daftar (*Required)"
};

const itemImportTemanPiliSchema = z.object({
    no_pili: z.string(),
    name: z.string(),
    no_ic: z.union([
        z.number().transform(() => null),
        z.string()
            .nullish()
            .transform((val) => val?.replace(/-/g, "") ?? null),
    ]),
    email: z.email().nullish(),
    phone_no: z.number().nullish(),
    address: z.string(),
    postcode: z.number().nullish(),
    station_id: z.string(),
    state_id: z.string(),
    district_id: z.string().nullish(),
    occupation: z.string().nullish(),
    office_address: z.string().nullish(),
    office_postcode: z.string().nullish(),
    office_state_id: z.string().nullish(),
    office_district_id: z.string().nullish(),
    gender: z.string()
        .transform((val) => val.trim().toLowerCase())
        .pipe(z.enum(['lelaki', 'perempuan', 'tidak diketahui']))
        .transform((val) => {
            const map: Record<string, string> = {
                'lelaki': 'a17c4e19-35e5-4ca1-9d4c-7513bca1af26',
                'perempuan': '836378d9-8a6e-4642-9e10-92c73ae8260e',
                'tidak diketahui': 'ff6f1c90-ce81-4754-8458-14e2efe031b7',
            };
            return map[val];
        }),
    status: z.string()
        .transform((val) => val.trim().toLowerCase())
        .pipe(z.enum(['aktif', 'tidak aktif']))
        .transform((val) => {
            const map: Record<string, string> = {
                'aktif': '484701f0-4d73-4a08-a11d-54ffcee87f75',
                'tidak aktif': '4734bc60-7339-4d18-8326-25d78d389a4d',
            };
            return map[val];
        }),
    created_at: z.string().nullish().transform(val => {
        if (!val) return null;

        const withTime = dayjs(val, 'D/M/YYYY H:mm');
        if (withTime.isValid()) return withTime.format('YYYY-MM-DD HH:mm:ss');

        const dateOnly = dayjs(val, 'D/M/YYYY');
        return dateOnly.isValid() ? dateOnly.format('YYYY-MM-DD 00:00:00') : null;
    }),
});
const listItemImportTemanPiliSchema = z.array(itemImportTemanPiliSchema);

function validateListItemImportTemanPiliSchema(listData: any) {
    return listItemImportTemanPiliSchema.parse(listData);
}

type TemanPiliItem = z.infer<typeof itemImportTemanPiliSchema>





export async function generateTemplateImportTemanPiliCSV() {
    const listDataForCSV = [
        {
            [mappingTemanPiliKey.no_pili]: "BJG-H-262",
            [mappingTemanPiliKey.name]: "Ahmad bin Abdullah",
            [mappingTemanPiliKey.no_ic]: "901231-14-5678",
            [mappingTemanPiliKey.email]: "ahmad@email.com",
            [mappingTemanPiliKey.phone_no]: "0123456789",
            [mappingTemanPiliKey.address]: "No 12, Jalan Mawar, Taman Bunga",
            [mappingTemanPiliKey.postcode]: "43000",
            [mappingTemanPiliKey.station_id]: "IKP",
            [mappingTemanPiliKey.state_id]: "JH",
            [mappingTemanPiliKey.district_id]: "",
            [mappingTemanPiliKey.occupation]: "",
            [mappingTemanPiliKey.office_address]: "",
            [mappingTemanPiliKey.office_postcode]: "",
            [mappingTemanPiliKey.office_state_id]: "",
            [mappingTemanPiliKey.office_district_id]: "",
            [mappingTemanPiliKey.gender]: "Lelaki",
            [mappingTemanPiliKey.status]: "Aktif",
        }
    ];

    await writeCsv("C:/Users/Fitrie/Downloads/template-teman-pili-import.csv", listDataForCSV);
}


export async function importTemanPiliToDB() {
    // const listData = await readCsv('C:/Users/Fitrie/Downloads/teman-pili-import- BBP CBY.csv');
    const listData = await readCsv('C:/Users/Fitrie/Downloads/template-teman-pili-import.Kuala.Selangor.csv');
    const reversedMapping = Object.fromEntries(
        Object.entries(mappingTemanPiliKey).map(([key, value]) => [value, key])
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


    const validatedData = validateListItemImportTemanPiliSchema(remappedData);
    const listExtractedData = await Promise.all(
        validatedData.map(async (item) => {
            return {
                ...item,
                state_id: await getState(item.state_id),
                station_id: await getStation(item.station_id),
            }
        })
    );

    const [listUnique, listDuplicate] = getDuplicateTemanPili(listExtractedData as any);
    console.log("listUnique: ", listUnique);
    // console.log("listDuplicate: ", listDuplicate);
    // console.log(listExtractedData);

    // for (const item of listUnique) {
    //     await insertTemanPiliWithTransaction({
    //         station_id: item.station_id,
    //         no_pili: item.no_pili,
    //         name: item.name,
    //         no_ic: item.no_ic as any,
    //         email: item.email as any,
    //         phone_no: item.phone_no as any,
    //         address: item.address,
    //         postcode: item.postcode as any,
    //         state_id: item.state_id as string,
    //         district_id: item.district_id as any,
    //         occupation: item.occupation as any,
    //         office_address: item.office_address as any,
    //         office_postcode: item.office_postcode as any,
    //         office_state_id: item.office_state_id as any,
    //         office_district_id: item.office_district_id as any,
    //         gender: item.gender,
    //         status: item.status,
    //         created_at: item.created_at as any,
    //     });
    // }
}

export function getDuplicateTemanPili(
    listExtractedData: TemanPiliItem[]
): [
        TemanPiliItem[],
        TemanPiliItem[]
    ] {
    const seenForUnique = new Set<string>();
    const listUnique: TemanPiliItem[] = [];

    const seen = new Set<string>();
    const duplicateNames = new Set<string>();
    const listDuplicate: TemanPiliItem[] = [];

    for (const item of listExtractedData) {
        // Build listUnique: take the first object for each name
        if (!seenForUnique.has(item.name)) {
            seenForUnique.add(item.name);
            listUnique.push(item);
        }

        // Build listDuplicate: take the second occurrence of each duplicated name
        if (seen.has(item.name) && !duplicateNames.has(item.name)) {
            duplicateNames.add(item.name);
            listDuplicate.push(item);
        }
        seen.add(item.name);
    }

    return [listUnique, listDuplicate];
}




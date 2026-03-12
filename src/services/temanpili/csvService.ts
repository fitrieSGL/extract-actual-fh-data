import * as path from "path";
import { readCsv, writeCsv } from "./../utils/csvService";
import { insertTemanPiliWithTransaction } from "./../../db/temanpili/db";
import dayjs from "dayjs";



interface SPPBTemanPiliType {
    no_pili: string,
    name: string
    no_ic: string
    email: string
    phone_no: string
    address: string
    postcode: string
    state_id: string
    district_id: string
    occupation: string
    office_address: string
    office_postcode: string
    office_state_id: string
    office_district_id: string
    image_url: string
    created_at: string
    gender: string
    membership_no: string
    status: string
}

export async function readCSVSPPBTemanPili() {
    const filePath = path.join(__dirname, '../../csv/new-teman-pili-data/TP-SL.csv');
    const listData: SPPBTemanPiliType[] = await readCsv(filePath);

    // const listDataSlice = listData.slice(0, 10);

    for (let i of listData) {
        const modifyCreatedAt = (i.created_at === "0000-00-00") ? dayjs().format('YYYY-MM-DD HH:mm:ss') : i.created_at;

        const station_id = await getStationIdByStationCode(i.no_pili);
        const no_ic = String(i.no_ic).includes('-')
            ? String(i.no_ic).replaceAll('-', '')
            : i.no_ic;
        const modifyData = {
            ...i,
            no_ic,
            station_id,
            created_at: modifyCreatedAt,
        }
        await insertTemanPiliWithTransaction(modifyData as any);
    }

}

async function getStationIdByStationCode(no_pili: string | null) {
    if (!no_pili) {
        return null;
    }

    const station_code = no_pili.split("-")[0];

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

    const stationData = allStations.find(item => item.station_code === station_code);
    return stationData?.id;
}


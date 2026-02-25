import * as path from "path";
import { readCsv, writeCsv } from "./../utils/csvService";
import { insertOwsWithTransaction } from "./../../db/ows/db";


interface SPSAOwsType {
    Negeri?: string,
    Nombor_Pili?: string,
    Kumpulan_Pili?: string,
    Daerah?: string,
    Status_Pili?: string,
    Lokasi?: string,
    Nama_Balai?: string,
    ["Awam / Swasta"]?: string,
    Jenis_Pili?: string,
    Latitud?: number,
    Longitud?: number,
    Alamat?: string,
}

interface FHISOwsType {
    reference_no: string | null,
    created_by: number | null
    type_id: string | null,
    latitude: number | null,
    longitude: number | null,
    status_id: number | null,
    address: string | null,
    station_id: string | null,
    state_id: string | null,
    district_id: string | null,
}

//TODO: ows_type_id
//TODO: state_id
//TODO: station_id
//TODO: district_id


export async function readCsvOwsAndConvertToFhisDBOwsCsv() {
    const filePath = path.join(__dirname, '../../csv/ows/Open Water Source SPSA.csv');
    const listData: SPSAOwsType[] = await readCsv(filePath);

    const listDataConvert: FHISOwsType[] = await Promise.all(
        listData.map(async item => {
            const type_id = getOwsType(item.Jenis_Pili) ?? null;
            const state_id = await getStateId(item.Negeri) ?? null;
            const station_id = await getStationId(item.Nama_Balai) ?? null;
            const district_id = await getDistrict(item.Daerah) ?? null;

            return {
                reference_no: item.Nombor_Pili ?? null,
                created_by: 249,
                type_id,
                latitude: item.Latitud ?? null,
                longitude: item.Longitud ?? null,
                status_id: 1,
                address: item.Alamat ?? null,
                station_id,
                state_id,
                district_id
            }
        })
    );

    // console.log(listDataConvert);
    const filePathExport = path.join(__dirname, '../../csv/ows/exported-ows-data.csv')
    await writeCsv(filePathExport, listDataConvert);

}


export async function insertDataOwsCSVToDB(filePath: string) {
    const listData: FHISOwsType[] = await readCsv(filePath);

    console.log("------------------------------Begin Inserting Data OWS------------------------------");
    for (let i of listData) {
        const data: FHISOwsType = {
            ...i,
            latitude: (typeof i.latitude !== "number") ? null : i.latitude,
            longitude: (typeof i.longitude !== "number") ? null : i.longitude
        }
        await insertOwsWithTransaction(data);
    }
    console.log("------------------------------Finish Inserting Data OWS------------------------------");

}





async function getStateId(name?: string) {
    const rawListState = await import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/list-state.json");
    const stateData = rawListState.data.find(item => item.name.toLowerCase() === name?.toLowerCase());
    return stateData?.id;
}

async function getStationId(name?: string) {
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

    const stationData = allStations.find(item => item.name.toLowerCase() === name?.toLowerCase());
    return stationData?.id;
}


async function getDistrict(name?: string) {
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

    const districtData = allDistricts.find(item => item.name.toLowerCase() === name?.toLowerCase());
    return districtData?.id;
}


function getOwsType(type?: string) {
    const listType = [
        { id: "6cfb6999-5c29-464d-894e-e92959f8d9e8", name: "Air Terjun" },
        { id: "81dee200-6844-4608-bf86-61a5a4a24a73", name: "Tasik" },
        { id: "b1fd1feb-0e48-4152-8c96-fedf7a3ab0bc", name: "Sungai" },
        { id: "b76dcff1-be5d-4eb7-a445-8a7c6a1afb0c", name: "Kolam" },
        { id: "bbbcf3a7-4587-463b-a79b-65fbc6fe59ad", name: "Lombong" },
        { id: "64aba470-0445-4f87-b2ad-9fa1cc46103c", name: "Empangan" },
        { id: "a9c9e2e1-35bc-4a82-976c-3a312efc3134", name: "Parit" },
        { id: "fe57b4b9-6b58-4b09-ac00-0762a7607b2d", name: "Water Check Dam" },
        { id: "a9690b13-93cf-4a91-bda1-f16eccc3724e", name: "Perigi Tiub" },
    ];

    if (!type) return undefined;

    const typeData = listType.find(item => {
        const itemWords = item.name.toLowerCase().split(' ');
        const typeWords = type.toLowerCase().split(' ');

        // Check if any word from type matches any word from item.name
        return typeWords.some(typeWord =>
            itemWords.some(itemWord => itemWord === typeWord)
        );
    });

    return typeData?.id;
}


// //List Negeri spsa
// 'JOHOR',
//   'KEDAH',
//   'KELANTAN',
//   'MELAKA',
//   'NEGERI SEMBILAN',
//   'PAHANG',
//   'PERAK',
//   'PERLIS',
//   'PULAU PINANG',
//   'SABAH',
//   'SARAWAK',
//   'SELANGOR',
//   'TERENGGANU',
//   'WILAYAH PERSEKUTUAN KUALA LUMPUR',
//   'WILAYAH PERSEKUTUAN LABUAN',
//   'WILAYAH PERSEKUTUAN PUTRAJAYA',
//   'Terengganu',
//   undefined,
//   'Johor'



// //List ows type spsa
//   'Sungai',
//   'Empangan / Kawasan Tadahan Air',
//   'Lombong',
//   'Tali Air',
//   'Kolam',
//   'Laut',
//   'Tasik',
//   'Parit',
//   'Tubewell',
//   undefined,
//   'Air Terjun',
//   'Air Perigi',
//   'Kumbahan',
//   'Lagoon',
//   'AIR Parit'



// // List column ows fhis
// id
// reference_no
// capacity_id
// created_by
// updated_by
// type_id
// created_at
// updated_at
// deletedAt
// location
// latitude
// longitude
// status_id
// address
// image_url
// station_id
// status_remark
// dun_id
// state_id
// district_id
// parliament_id
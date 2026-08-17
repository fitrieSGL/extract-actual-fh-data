import statesData from 'C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-negeri.json';
import stationsData from 'C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-balai.json';
import dayjs from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// dayjs.extend(customParseFormat);

export async function getState(stateCode: string) {
    const listState = statesData.data;
    return listState.find(item => item.state2_code === stateCode)?.id ?? null;
}

export async function getStation(stationCode: string) {
    const result = stationsData.find(item => item.station_code === stationCode)?.id ?? null;
    return result;
}

export function capitalizeWords(text: string) {
    return text.replace(/\b\w/g, char => char.toUpperCase());
}

export function correctTheDate(rawDate: string | number) {
    let stringDate = String(rawDate).trim();

    // Strip a leading apostrophe if it's literally in the string
    if (stringDate.startsWith("'")) {
        stringDate = stringDate.slice(1);
    }

    // If leading zero got dropped (e.g. parsed as a number), pad it back
    stringDate = stringDate.padStart(8, '0');

    if (!/^\d{8}$/.test(stringDate)) {
        throw new Error(`Invalid raw date format: ${rawDate}`);
    }

    // "14052017" // date is like this from raw
    const day = stringDate.slice(0, 2);   // "14"
    const month = stringDate.slice(2, 4); // "05"
    const year = stringDate.slice(4);     // "2017"

    return `${day}/${month}/${year}`
}
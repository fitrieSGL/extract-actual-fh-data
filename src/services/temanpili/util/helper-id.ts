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

export function toTimestamptz(input: string, offset: string = "+08:00"): string {
    const m = input
        .trim()
        .match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) throw new Error(`Unrecognised format: ${input}`);

    const [, dd, mm, yyyy, hh, min, ss = "00"] = m;

    const pad = (n: string | number): string => String(n).padStart(2, "0");
    return `${yyyy}-${pad(mm)}-${pad(dd)}T${pad(hh)}:${min}:${ss}${offset}`;
}

// toTimestamptz("26/11/2025 12:15"); // "2025-11-26T12:15:00+08:00"
// toTimestamptz("26/11/2025 13:15"); // "2025-11-26T13:15:00+08:00"
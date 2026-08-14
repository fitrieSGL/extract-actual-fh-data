import statesData from 'C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-negeri.json';
import stationsData from 'C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-balai.json';

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
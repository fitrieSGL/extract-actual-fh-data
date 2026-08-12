import statesData from 'C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-negeri.json';
import stationsData from 'C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-balai.json';
import districtsData from 'C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-daerah.json';
import parliamentsData from 'C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-parlimen.json';
import dunsData from 'C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/json/senarai-dun.json';

export async function getState(stateCode: string) {
    const listState = statesData.data;
    return listState.find(item => item.state2_code === stateCode)?.id ?? null;
}

export async function getStation(stationCode: string) {
    const result = stationsData.find(item => item.station_code === stationCode)?.id ?? null;
    return result;
}

export async function getDistrict(secondary_id: string) {
    return districtsData.find(item => item.secondary_id === secondary_id)?.id ?? null;
}

export async function getParliament(secondary_id: string) {
    return parliamentsData.find(item => item.parliament_code === secondary_id)?.id ?? null;
}

export async function getAssemblymen(
    state_code: string,
    dun_code: string
) {
    const state_id = await getState(state_code);

    return dunsData
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
export interface DistrictType {
    id: string,
    state_id: string,
    name: string
}

export interface ParliamentType {
    id: string;
    state_id: string;
    name: string;
    parliament_code: string;
}

export interface StationType {
    id: string;
    station_code: string;
    station_category: string;
    name: string;
    registration_code: string;
    address1: string;
    address2: string;
    postcode: number;
    state_id: string;
    phone_number: string;
    fax_number: string;
    email: string;
    latitude: number;
    longitude: number;
    deleted: boolean;
    created_at: string; // or Date if you plan to parse it
    updated_at: string; // or Date if you plan to parse it
}
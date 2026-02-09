import * as path from "path";
import { readCsv } from "./../utils/csvService";


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



export async function readCsvOws() {
    const filePath = path.join(__dirname, '../../csv/ows/Open Water Source SPSA.csv');
    const listData: SPSAOwsType[] = await readCsv(filePath);

    console.log('Data:', listData);
}
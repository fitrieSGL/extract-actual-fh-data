import { writeCsv } from "../../services/utils/csvService";

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
    status: "Status (Aktif / Tidak Aktif)(*Required)"
};

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
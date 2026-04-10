import { writeCsv } from "../../services/utils/csvService";

export async function generateTemplateImportFireHydrantCSV() {
    const listDataForCSV = [
        {
            /**
             * no_pili
             * !Required
             */
            ["No Pili Bomba"]: "BJG-H-262",
            /**
             * code_pili
             * !Required
             */
            ["Code Pili"]: "BJG",
            /**
             * isHaveMainPipe
             * Leave blank if null
             * YA / TIDAK
             */
            ["Ada Paip Utama"]: "YA", 
            /**
             * mainPipeSize
             * Leave blank if null
             */
            ["Saiz Paip Utama"]: 8,
            /**
             * distanceFromNearestStation
             * Leave blank if null
             */
            ["Balai Bomba Terdekat (km)"]: 22, 
            /**
             * distanceFromNearestFireHydrant
             * Leave blank if null
             */
            ["Dari Pili Bomba Terdekat (meter)"]: 2,
            /**
             * distanceFromOpenWaterSources
             * Leave blank if null
             */
            ["Dari Sumber Air Terbuka (meter)"]: 2,
            /**
             * waterProduction
             * Leave blank if null
             */
            ["Pengeluaran Air (LPM)"]: 2,
            /**
             * staticWaterPressure
             * Leave blank if null
             */
            ["Tekanan Air Statik (Bar)"]: 2,
            /**
             * currentWaterPressure
             * Leave blank if null
             */
            ["Tekanan Air Semasa (Bar)"]: 2,
            /**
             * totalPopulation
             * Leave blank if null
             */
            ["Jumlah Populasi"]: 2,
            /**
             * totalPremises
             * Leave blank if null
             */
            ["Jumlah Premis"]: 2,
            /**
             * totalBuildingOver4floors
             * Leave blank if null
             * YA / TIDAK
             */
            ["Bangunan melebihi 4 tingkat"]: null,
            /**
             * is_has_industry_risk
             * !Required
             * YA / TIDAK
             */
            ["Risiko Industri?"]: "YA",
            /**
             * is_has_housing_risk
             * !Required
             * YA / TIDAK
             */
            ["Risiko Perumahan?"]: "TIDAK",
            /**
             * is_has_school_risk
             * !Required
             * YA / TIDAK
             */
            ["Risiko Sekolah?"]: "TIDAK",
            /**
             * otherRisks
             * Leave blank if null
             */
            ["Risiko lain yang wujud"]: "test",
            /**
             * address
             * !Required
             */
            ["Alamat"]: "4429, Jalan Negeri Sembilan Selatan, Bukit Persekutuan, 50480 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
            /**
             * latitude
             * Leave blank if null
             */
            ["Latitud"]: 3.135237,
            /**
             * longitude
             * Leave blank if null
             */
            ["Longitud"]: 101.678021,
            /**
             * postcode
             * Leave blank if null
             */
            ["Poskod"]: "50480",
            /**
             * installation_date
             * Format DD/MM/YYYY HH:MM
             * Leave blank if null
             */
            ["Tarikh Pemasangan"]: "26/01/2026 13:20",
            /**
             * external_station_id
             * ! Required
             * Format Station code
             */
            ["ID Balai"]: "BJG",
            /**
             * state_id
             * ! Required
             * Format State code
             */
            ["ID Negeri"]: "PJ",
            /**
             * district_id
             * Leave blank if null
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            ["ID Daerah"]: null, 
            /**
             * parliament_id
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            ["ID Parlimen"]: 1, 
            /**
             * assemblymen_id
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            ["ID DUN"]: "",
            /**
             * zone_id
             * Map out this id, dont use direct db id,use like 1,2,3
             */
            ["ID Zon"]: 1,
            /**
             * fhtype_id
             * Map out the id
             * dont use direct db id
             * Map out this id, use like 1,2,3
             */
            ["ID Jenis Pili"]: 1,
            /**
             * ownership_id
             * Map out the id
             * dont use direct db id
             * Map out this id, use like 1,2,3
             */
            ["ID Jenis Pemilikan Pili"]: 1,
            /**
             * status_id
             * Map out the id
             * dont use direct db id
             * Map out this id, use like 1,2,3
             */
            ["ID Status Pili"]: 1,




            // "created_by": 249, // Admin
            //TODO: generate in DB
            // "location": "POINT (101.678021 3.135237)" 
        }
    ];

    await writeCsv("C:/Users/Fitrie/Downloads/template-fire-hydrant-import.csv", listDataForCSV);
}
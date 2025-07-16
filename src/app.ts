import * as ExcelJS from 'exceljs';

interface FHDataType {
  id_pili: number;
  hydrant_id_uuid: string;
  station_id_uuid: string;
  station_id: number;
  station_code: string;
  zon: string;
  no_pili: string;
  pili_num_combine: {
    result: string;
    sharedFormula: string;
    error?: string,
  };
  alamat: string;
  penanda_kawasan: string;
  id_kedudukan: number;
  kedudukan: string;
  lokasi: string;
  latitud: number;
  longitud: number;
  id_negeri: number;
  state_id_uuid: string;
  negeri: string;
  id_daerah: number;
  daerah: string;
  id_pemilikan_pili: number;
  pemilikan_pili: string;
  id_status_pili: number;
  status_pili: string;
  diameter_pengeluaran: number;
  id_jenis_pili: number;
  jenis_pili: string;
  id_parlimen: number;
  parlimen: string;
  tarikh_pili: string;
  id_syarikat_air: number;
  flag_migrasi: string;
  id_bandar: number;
  bandar: string;
  city_id_uuid: string;
  latitud_original: string;
  longitud_original: string;
  no_pili_asal: number;
}

interface ListModifiedDataType {
  id_pili: number,
  pili_num_combine: string
}

readfile();

async function readfile() {
  const workbook = new ExcelJS.Workbook();
  const path = 'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/excel-file/SPPB - PJ.xlsx'
  await workbook.xlsx.readFile(path);

  const worksheet = workbook.getWorksheet('Pili');

  const data: FHDataType[] = [];
  let headers: any = [];

  worksheet?.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      // First row as headers
      row.eachCell((cell, colNumber) => {
        headers[colNumber] = cell.value;
      });
    } else {
      // Data rows
      const rowData: any = {};
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber];
        if (header) {
          rowData[header] = cell.value;
        }
      });

      // Only add row if it has data
      if (Object.keys(rowData).length > 0) {
        data.push(rowData);
      }
    }
  });

  let listModifiedData: ListModifiedDataType[] = [];

  listModifiedData = data
    .filter((item) => !Boolean(item.pili_num_combine.error))
    .map((item) => ({
      id_pili: item.id_pili,
      pili_num_combine: item.pili_num_combine.result
    }))

  console.log(data);
  // await exportToCsv(listModifiedData);


}

async function exportToCsv(
  listModifiedData: ListModifiedDataType[]
) {
  // Create a new workbook for the export
  const exportWorkbook = new ExcelJS.Workbook();
  const exportWorksheet = exportWorkbook.addWorksheet('Modified Data');

  // Add headers
  exportWorksheet.columns = [
    { header: 'ID Pili', key: 'id_pili', width: 15 },
    { header: 'Pili Num Combine', key: 'pili_num_combine', width: 30 }
  ];

  // Add data rows
  listModifiedData.forEach(item => {
    exportWorksheet.addRow({
      id_pili: item.id_pili,
      pili_num_combine: item.pili_num_combine
    });
  });

  // Save as CSV file
  const csvPath = 'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/excel-file/extracted-sppb-pj.csv';
  await exportWorkbook.csv.writeFile(csvPath);
}


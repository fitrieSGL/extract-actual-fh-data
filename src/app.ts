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
  no_pili: string,
  latitude: number,
  longitude: number,
}


// readfileSpbb();
// transformDataListNoPili_1()




//TODO:
async function readfileSpbb() {
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
    .map((item) => ({
      no_pili: item.pili_num_combine.result,
      latitude: item.latitud,
      longitude: item.longitud,
    }))
    .filter((item: any) => !Boolean(item.no_pili?.error))

  // console.log(data);
  await exportToCsvSppb(listModifiedData);


}

async function exportToCsvSppb(
  listModifiedData: ListModifiedDataType[]
) {
  // Create a new workbook for the export
  const exportWorkbook = new ExcelJS.Workbook();
  const exportWorksheet = exportWorkbook.addWorksheet('Modified Data');

  // Add headers
  exportWorksheet.columns = [
    { header: 'no_pili', key: 'no_pili', width: 30 },
    { header: 'latitude', key: 'latitude', width: 30 },
    { header: 'longitude', key: 'longitude', width: 30 }
  ];

  // Add data rows
  listModifiedData.forEach(item => {
    exportWorksheet.addRow({
      no_pili: item.no_pili,
      latitude: item.latitude,
      longitude: item.longitude
    });
  });

  // Save as CSV file
  const csvPath = 'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/excel-file/extracted-sppb-pj.csv';
  await exportWorkbook.csv.writeFile(csvPath);
}




// async function transformDataListNoPili_1() {
//   const workbook = new ExcelJS.Workbook();
//   await workbook.csv.readFile('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/raw-list-no-pili-1.csv');

//   const worksheet = workbook.getWorksheet(1);

//   const listData: any = [];
//   let headers: any = [];

//   worksheet?.eachRow((row: any, rowNumber) => {
//     if (rowNumber === 1) {
//       // Store headers
//       headers = row.values.slice(1); // slice(1) to remove undefined first element
//     } else {
//       // Process data rows
//       const rowData: any = {};
//       const values = row.values.slice(1); // slice(1) to remove undefined first element

//       headers.forEach((header: any, index: number) => {
//         rowData[header] = values[index];
//       });

//       listData.push(rowData);
//     }
//   });

//   // console.log(listData);

//   const modifiedListData = listData
//   .map((item: any) => {
//     return item.no_pili.trim();
//   })
//   .map((item: any) => {
//     const listItem = item.split(" ");
//     return `PJY-${listItem[0]}-${listItem[1]}`
//   });

//   // console.log(modifiedListData);


//   //* Export CSV modified data
//   // Create a new workbook for the export
//   const exportWorkbook = new ExcelJS.Workbook();
//   const exportWorksheet = exportWorkbook.addWorksheet('Modified Data');

//   // Add headers
//   exportWorksheet.columns = [
//     { header: 'no_pili', key: 'no_pili', width: 15 },
//   ];

//   // Add data rows
//   modifiedListData.forEach((item: any) => {
//     exportWorksheet.addRow({
//       no_pili: item,
//     });
//   });

//   // Save as CSV file
//   const csvPath = 'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/excel-file/rawdata/list-no-pili-1.csv';
//   await exportWorkbook.csv.writeFile(csvPath);

// }

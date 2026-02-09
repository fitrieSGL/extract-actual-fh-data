import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { stringify } from 'csv-stringify';

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
  dun: string | null;
}


// export async function readfileSpbbExcelAndConvertToCSV(
//   filePath: string,
//   fileOutputPath: string,
//   worksheetName: string
// ) {
//   const workbook = new ExcelJS.Workbook();
//   await workbook.xlsx.readFile(filePath);

//   const worksheet = workbook.getWorksheet(worksheetName);

//   const data: FHDataType[] = [];
//   let headers: any = [];

//   worksheet?.eachRow((row, rowNumber) => {
//     if (rowNumber === 1) {
//       // First row as headers
//       row.eachCell((cell, colNumber) => {
//         headers[colNumber] = cell.value;
//       });
//     } else {
//       // Data rows
//       const rowData: any = {};
//       row.eachCell((cell, colNumber) => {
//         const header = headers[colNumber];
//         if (header) {
//           rowData[header] = cell.value;
//         }
//       });

//       // Only add row if it has data
//       if (Object.keys(rowData).length > 0) {
//         data.push(rowData);
//       }
//     }
//   });

//   // const modifiedListData = data.filter(item => (item.station_code === 'JHT'));
//   // const modifiedListData = data.filter(item => (item.dun === 'Kota Anggerik') && (item.station_id !== 11));
//   // console.log(modifiedListData);

//   await exportResultToCSV(data, fileOutputPath);
// }

export async function readfileSpbbExcelAndConvertToCSV(
  filePath: string,
  fileOutputPath: string,
  worksheetName: string
) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(worksheetName);

  if (!worksheet) {
    throw new Error(`Worksheet "${worksheetName}" not found`);
  }

  // Create write stream
  const writeStream = fs.createWriteStream(fileOutputPath);
  const stringifier = stringify({ header: true });
  stringifier.pipe(writeStream);

  let headers: any = [];
  let processedRows = 0;

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      // First row as headers
      row.eachCell((cell, colNumber) => {
        headers[colNumber] = cell.value;
      });
    } else {
      // Data rows - create rowData with all headers initialized to null
      const rowData: any = {};

      // Initialize all headers with null
      headers.forEach((header: any, index: number) => {
        if (header) {
          rowData[header] = null;
        }
      });

      // Then fill in actual values
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber];
        if (header) {
          rowData[header] = cell.value;
        }
      });

      // Write row (will include nulls for empty cells)
      stringifier.write(rowData);
      processedRows++;

      // Optional: log progress every 10,000 rows
      if (processedRows % 10000 === 0) {
        console.log(`Processed ${processedRows} rows...`);
      }
    }
  });

  // Close the stream
  stringifier.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log(`✓ Completed: ${processedRows} rows written to ${fileOutputPath}`);
      resolve(processedRows);
    });
    writeStream.on('error', reject);
  });
}



// async function readfileSpbb() {
//   const workbook = new ExcelJS.Workbook();
//   const path = 'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/excel-file/SPPB - PJ.xlsx'
//   await workbook.xlsx.readFile(path);

//   const worksheet = workbook.getWorksheet('Pili');

//   const data: FHDataType[] = [];
//   let headers: any = [];

//   worksheet?.eachRow((row, rowNumber) => {
//     if (rowNumber === 1) {
//       // First row as headers
//       row.eachCell((cell, colNumber) => {
//         headers[colNumber] = cell.value;
//       });
//     } else {
//       // Data rows
//       const rowData: any = {};
//       row.eachCell((cell, colNumber) => {
//         const header = headers[colNumber];
//         if (header) {
//           rowData[header] = cell.value;
//         }
//       });

//       // Only add row if it has data
//       if (Object.keys(rowData).length > 0) {
//         data.push(rowData);
//       }
//     }
//   });


//   // let listModifiedData_1: any[] = [];
//   // const listPili_1 = await readCSVListNoPili('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/extracted/bbp-p14.csv');

//   // console.log(listModifiedData_1.length, listPili_1.length);
//   // await exportResultToCSV(listModifiedData_1, 'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/excel-file/result/result-list-pili-2.csv');
// }



async function exportResultToCSV(listData: any, exportPath: string) {
  // Create a new workbook for the export
  const exportWorkbook = new ExcelJS.Workbook();
  const exportWorksheet = exportWorkbook.addWorksheet('Modified Data');

  const headers = Object.keys(listData[0]);
  exportWorksheet.addRow(headers);

  // Add data rows
  listData.forEach((item: any) => {
    // exportWorksheet.addRow(item);
    const row = headers.map(header => item[header]);
    exportWorksheet.addRow(row);
  });

  // Save as CSV file
  await exportWorkbook.csv.writeFile(exportPath);
}



async function transformDataRaw() {
  const listDataAll = await readCSVListNoPili('C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/excel-file/extracted-sppb-pj.csv');
  // console.log(listDataAll);

  const listData = await readCSVListNoPili('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/extracted/bbp-p7.csv');
  const modifiedListData = listData.map(item => {
    const matchingItem = listDataAll.find(itemInside => itemInside.no_pili === item.no_pili);
    if (matchingItem) {
      return {
        ...item,
        latitude: matchingItem.latitude,
        longitude: matchingItem.longitude,
      };
    }
    return item;
  });

  // console.log("modifiedListData: ", modifiedListData);
  // await exportResultToCSV(modifiedListData, 'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/result/bbp-p7.csv')


}



async function readCSVListNoPili(
  path: string
): Promise<any[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.csv.readFile(path);

  const worksheet = workbook.getWorksheet(1);

  const listData: any = [];
  let headers: any = [];

  worksheet?.eachRow((row: any, rowNumber) => {
    if (rowNumber === 1) {
      // Store headers
      headers = row.values.slice(1); // slice(1) to remove undefined first element
    } else {
      // Process data rows
      const rowData: any = {};
      const values = row.values.slice(1); // slice(1) to remove undefined first element

      headers.forEach((header: any, index: number) => {
        rowData[header] = values[index];
      });

      listData.push(rowData);
    }
  });

  return listData;

}




export async function readCSVFile<T>(filePath: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.csv.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);

  const data: T[] = [];
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

  return data;
}
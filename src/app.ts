import { readExcelAndInsertToDb, readCSVAndInsertToDb } from './services/serviceDb';
import { readfileSpbbExcelAndConvertToCSV } from './services/extractExcel';
import { getCompoundData, insertFirehydrant } from './db/db';
import * as ExcelJS from 'exceljs';



interface ListModifiedDataType {
  no_pili: string,
  latitude: number,
  longitude: number,
}

//* Run here
readCSVAndInsertToDb(
  'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/pili-selangor.csv',
  {
    state_id: 'b74645e5-3ad2-4dd9-ba72-3b7eb8f16643',
    listExcludeStationCode: ['CBY', 'BJG', 'BGI'],
  }
);

// readfileSpbbExcelAndConvertToCSV(
//   'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/excel-file/SPPB - SL.xlsx',
//   'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/pili-selangor.csv',
//   'Pili'
// );











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







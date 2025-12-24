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
// getCompoundData();
// readExcelAndInsertToDb();
readCSVAndInsertToDb(
  'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/pili-kl.csv',
  {
    state_id: '55c38deb-aae3-44c5-bfac-0bb919effec4',
    listExcludeStationCode: ['JHT', 'TDI', 'KLC'],
  }
);

// readfileSpbbExcelAndConvertToCSV(
//   'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/excel-file/SPPB - KL.xlsx',
//   'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/pili-kl.csv',
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







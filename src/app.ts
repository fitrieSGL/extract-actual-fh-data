import { insertDataOwsCSVToDB, readCsvOwsAndConvertToFhisDBOwsCsv } from './services/ows/csvService';
import { readCSVAndInsertToDb, readCSVAndInsertToDbTwo } from './services/firehydrant/serviceDb';
import { updateCSVListFhOnWater, csvToJSONFile } from './services/utils/csvService';
// import { readCSVSPPBTemanPili } from './services/temanpili/csvService';
import { generateTemplateImportFireHydrantCSV, createFHImportLookup, importFHToDB } from './services/firehydrant/fh-util';
import { createOWSImportLookup, generateTemplateImportOwsCSV } from './services/ows/ows-util';
import { formatSQLFirehydrantTemanPili } from './services/utils/format-sql';
// import { generateTemplateImportTemanPiliCSV, importTemanPiliToDB } from './services/temanpili/temanpili-util';


//* Run here
// readCSVAndInsertToDb(
//   'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/pili-selangor.csv',
//   {
//     state_id: 'b74645e5-3ad2-4dd9-ba72-3b7eb8f16643',
//     listExcludeStationCode: ['CBY', 'BJG', 'BGI'],
//   }
// );

// readCSVAndInsertToDbTwo(
//   'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/new-fh-data/PK.csv',
//   'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/error/PK.csv'
// );

// readfileSpbbExcelAndConvertToCSV(
//   'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/excel-file/SPPB - JH.xlsx',
//   'C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/pili-johor.csv',
//   'Pili'
// );


// readCsvOws();
// readCsvOwsAndConvertToFhisDBOwsCsv();
// insertDataOwsCSVToDB("C:/Users/Fitrie/Desktop/etc-FHIS/extract-actual-data/src/csv/ows/exported-ows-data.csv");


// updateCSVListFhOnWater()


// readCSVSPPBTemanPili()

// csvToJSONFile("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/DB/csv/senarai-daerah.csv");


// generateTemplateImportFireHydrantCSV();
// createFHImportLookup("C:/Users/Fitrie/Downloads/fh-import-lookup.xlsx");

// generateTemplateImportOwsCSV();
// createOWSImportLookup("C:/Users/Fitrie/Downloads/ows-import-lookup.xlsx");


// formatSQLFirehydrantTemanPili();
// generateTemplateImportTemanPiliCSV()


// importTemanPiliToDB()
// importFHToDB();
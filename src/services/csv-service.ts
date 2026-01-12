import * as ExcelJS from 'exceljs';
import { writeFileSync } from 'fs';
/**
 * Generates a CSV file from an array of strings
 * @param data - Array of strings representing rows
 * @param filename - Output filename (without extension)
 * @param options - Optional configuration
 * @returns Buffer containing the CSV data
 */

export async function generateCSV(
  data: string[],
  options?: {
    header?: string;
    delimiter?: string;
    outputPath?: string; // Where to save the file
  }
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  if (data.length === 0) {
    throw new Error('Data array cannot be empty');
  }

  worksheet.columns = [{
    header: options?.header || 'Value',
    key: 'value',
    width: 20
  }];

  data.forEach(item => {
    worksheet.addRow({ value: item });
  });

  const buffer = await workbook.csv.writeBuffer({
    formatterOptions: {
      delimiter: options?.delimiter || ','
    }
  }) as any;

  // Auto-save if outputPath is provided
  if (options?.outputPath) {
    // const filepath = join(options.outputPath, `${filename}.csv`);
    writeFileSync(options.outputPath, buffer);
  }

  return buffer as Buffer;
}

// Usage with auto-save:
// await generateCSV(data, 'fruits', {
//   outputPath: './output' // Will save to ./output/fruits.csv
// });


// Example usage:
// const data = ['apple', 'banana', 'orange', 'grape'];
//
// const csvBuffer = await generateCSV(data, 'fruits', {
//   header: 'Fruit Name'
// });
//
// // Save to file (Node.js)
// import { writeFileSync } from 'fs';
// writeFileSync('fruits.csv', csvBuffer);
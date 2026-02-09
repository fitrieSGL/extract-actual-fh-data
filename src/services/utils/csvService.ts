import * as ExcelJS from 'exceljs';


export async function readCsv(
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


export async function writeCsv(
    path: string,
    data: any[]
): Promise<void> {
    if (!data || data.length === 0) {
        throw new Error('No data to write to CSV');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Get headers from first object keys
    const headers = Object.keys(data[0]);

    // Add header row
    worksheet.addRow(headers);

    // Add data rows
    data.forEach((item) => {
        const row = headers.map(header => item[header]);
        worksheet.addRow(row);
    });

    // Write to file
    await workbook.csv.writeFile(path);
}
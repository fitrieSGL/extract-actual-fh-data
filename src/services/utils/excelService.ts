import * as ExcelJS from 'exceljs';

export async function readXlsx(
    path: string
): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);

    const worksheet = workbook.getWorksheet(1);

    const listData: any = [];
    let headers: any = [];

    worksheet?.eachRow((row: any, rowNumber) => {
        if (rowNumber === 1) {
            headers = row.values.slice(1);
        } else {
            const rowData: any = {};
            const values = row.values.slice(1);

            headers.forEach((header: any, index: number) => {
                rowData[header] = values[index];
            });

            listData.push(rowData);
        }
    });

    return listData;
}
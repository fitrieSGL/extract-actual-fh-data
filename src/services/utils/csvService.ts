import * as ExcelJS from 'exceljs';
import fs from "fs/promises";
import path from "path";



export async function updateCSVListFhOnWater() {
    const path = 'C:/Users/Fitrie/Desktop/etc-FHIS/others/fh-on-water.csv';
    const listData = await readCsv(path);

    const listState = await import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/list-state.json');

    const rawListStation = await Promise.all([
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/johor.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/kedah.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/kelantan.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/kuala-lumpur.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/labuan.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/melaka.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/negeri-sembilan.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/pahang.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/perak.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/perlis.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/pulau-pinang.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/putrajaya.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/sabah.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/sarawak.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/selangor.json'),
        import('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/postman/station/terengganu.json'),
    ]);


    const listStation = rawListStation.flatMap(item => item.data);


    const listTransformedData = listData.map(item => {
        const station_name = listStation.find(itemInside => itemInside.id === item.external_station_id)?.name;
        const state_name = listState.data.find(itemInside => itemInside.id === item.state_id)?.name;

        return {
            ...item,
            state_name,
            station_name,
        }
    });

    const pathTransformData = 'C:/Users/Fitrie/Desktop/etc-FHIS/others/transformed-fh-on-water.csv';
    await writeCsv(pathTransformData, listTransformedData);
}


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

export async function csvToJSONFile(
    filePath: string
): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    await workbook.csv.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    const rows: Record<string, string>[] = [];
    let headers: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
        const values = (row.values as ExcelJS.CellValue[]).slice(1); // remove index 0 (ExcelJS pads it)

        if (rowNumber === 1) {
            headers = values.map((v) => String(v ?? ""));
        } else {
            const obj: Record<string, string> = {};
            headers.forEach((header, i) => {
                obj[header] = String(values[i] ?? "");
            });
            rows.push(obj);
        }
    });

    const outputPath = path.join(
        path.dirname(filePath),
        `${path.basename(filePath, path.extname(filePath))}.json`
    );

    await fs.writeFile(outputPath, JSON.stringify(rows, null, 2), "utf-8");
}


export async function readExcelFile(
    filePath: string,
    sheetName: string
): Promise<Record<string, unknown>[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
        throw new Error(`Sheet "${sheetName}" not found`);
    }

    const rows: Record<string, unknown>[] = [];
    let headers: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
        const values = (row.values as ExcelJS.CellValue[]).slice(1);

        if (rowNumber === 1) {
            headers = values.map((v) => String(v ?? ''));
        } else {
            const rowObj: Record<string, unknown> = {};
            headers.forEach((header, index) => {
                rowObj[header] = values[index] ?? null;
            });
            rows.push(rowObj);
        }
    });

    return rows;
}
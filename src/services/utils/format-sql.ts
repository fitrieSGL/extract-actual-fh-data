import fs from "fs/promises";
import path from "path";

export async function formatSQLFirehydrantTemanPili() {
    const rawData = await import("C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/others/firehydrant_temanpili.json");
    const listData = rawData.data;

    const listFormattedData = listData.map((item, index) => {
        const isLast = index === listData.length - 1;
        return `('${item.membership_no}', '${item.no_pili}')${isLast ? '' : ','}`;
    });

    const sql = `
        INSERT INTO fire_hydrant_teman_pili (temanpili_id, firehydrant_id)
        SELECT tpb.id, fh.id
        FROM (VALUES
            ${listFormattedData.join('\n        ')}
        ) AS data(membership_no, no_pili)
        JOIN teman_pili_bomba tpb ON tpb.membership_no = data.membership_no
        JOIN fire_hydrant fh ON fh.no_pili = data.no_pili;
    `;


    await fs.writeFile('C:/Users/Fitrie/Desktop/etc-FHIS/actual-data-fhis/others/test.txt', sql, 'utf-8');
}


export async function formatSQLDeleteFireHydrant() {
    const rawData = await import("C:/Users/Fitrie/Downloads/fh-to-delete.json");
    const listData = rawData.default;

    const values = listData
        .map((item) => `'${item.no_pili}'`)
        .join(',\n        ');

    const sql = `DELETE FROM fire_hydrant\nWHERE no_pili IN (\n        ${values}\n);\n`;

    await fs.writeFile(
        'C:/Users/Fitrie/Downloads/fh-to-delete.txt',
        sql,
        'utf-8'
    );
}
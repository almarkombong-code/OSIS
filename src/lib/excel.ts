
import * as XLSX from 'xlsx';

type ExcelSheet = {
    sheetName: string;
    data: any[];
}

/**
 * Exports an array of objects to an Excel file with multiple sheets.
 * @param sheets An array of sheet objects, each with a sheetName and data.
 * @param fileName The name of the file to be created (without extension).
 */
export const exportToExcel = (sheets: ExcelSheet[], fileName: string) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Append each sheet to the workbook
  sheets.forEach(sheet => {
      const ws = XLSX.utils.json_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
  });

  // Write the workbook and trigger a download
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};


/**
 * Reads an Excel file and converts its content to a JSON array.
 * @param file The Excel file to read.
 * @returns A promise that resolves with an array of objects.
 */
export const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = event.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                resolve(json);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
};

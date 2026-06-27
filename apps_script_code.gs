const SHEET_NAME = 'Stats';

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return json_({ error: 'Лист не найден: ' + SHEET_NAME });

    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return json_({ rows: [] });

    const headers = values[0].map(String);
    const rows = values.slice(1)
      .filter(row => row.some(cell => cell !== '' && cell !== null))
      .map(row => {
        const obj = {};
        headers.forEach((h, i) => obj[h] = row[i]);
        return obj;
      });

    return json_({ rows, updatedAt: new Date().toISOString() });
  } catch (err) {
    return json_({ error: String(err) });
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

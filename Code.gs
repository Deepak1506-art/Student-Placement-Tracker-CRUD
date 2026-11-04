// 1. Replace this with the ID from your Google Sheet URL.
const SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
const SHEET_NAME = "Students";

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "read";
  return handleRequest(action, {});
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return handleRequest(data.action, data);
  } catch (error) {
    return jsonResponse({ success: false, message: error.message });
  }
}

function handleRequest(action, data) {
  try {
    const sheet = getSheet();
    switch (action) {
      case "create": {
        const id = new Date().getTime().toString();
        sheet.appendRow([id, data.name, data.email, data.domain, data.status, new Date().toLocaleString()]);
        return jsonResponse({ success: true, message: "Student created successfully" });
      }
      case "read": {
        const values = sheet.getDataRange().getValues();
        if (values.length <= 1) return jsonResponse({ success: true, data: [] });
        const students = values.slice(1).map(row => ({
          id: row[0], name: row[1], email: row[2], domain: row[3],
          status: row[4], createdAt: row[5]
        }));
        return jsonResponse({ success: true, data: students });
      }
      case "update": {
        const row = findRowById(sheet, data.id);
        if (row === -1) throw new Error("Student record not found");
        sheet.getRange(row, 2, 1, 4).setValues([[data.name, data.email, data.domain, data.status]]);
        return jsonResponse({ success: true, message: "Student updated successfully" });
      }
      case "delete": {
        const row = findRowById(sheet, data.id);
        if (row === -1) throw new Error("Student record not found");
        sheet.deleteRow(row);
        return jsonResponse({ success: true, message: "Student deleted successfully" });
      }
      default: throw new Error("Invalid action");
    }
  } catch (error) {
    return jsonResponse({ success: false, message: error.message });
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet tab "Students" not found. Create or rename the first tab.');
  return sheet;
}

function findRowById(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const index = ids.findIndex(value => String(value) === String(id));
  return index === -1 ? -1 : index + 2;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

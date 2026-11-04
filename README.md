# SPSU Student Placement Tracker — Day 9 CRUD War Arena

A browser-based CRUD application built with HTML, CSS, JavaScript, Google Sheets and Google Apps Script.

## Project structure
- `index.html` — application interface
- `style.css` — responsive styling
- `script.js` — frontend CRUD operations and API communication
- `Code.gs` — Google Apps Script backend (paste into Apps Script editor)

## Setup (required to connect live Google Sheets)

1. Create a Google Sheet and rename its first tab to **Students**.
2. Add these exact headers in row 1:
   `ID | Name | Email | Domain | Status | Created At`
3. In the Sheet, open **Extensions → Apps Script**.
4. Replace the starter code in Apps Script with the complete contents of `Code.gs`.
5. Copy the Spreadsheet ID from the Sheet URL (the text between `/d/` and `/edit`) and replace `PASTE_YOUR_SPREADSHEET_ID_HERE` in `Code.gs`.
6. Click **Deploy → New deployment → Web app**.
7. Set **Execute as: Me**. Set access to the option your instructor/classroom permits (for a public classroom demo, this is commonly **Anyone**). Click Deploy and authorize the script.
8. Copy the Web App URL ending in `/exec`.
9. Open `script.js` and replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.
10. Save all files and open `index.html` in a browser. For reliable hosting, publish the folder with GitHub Pages or another static host.

## Test the four CRUD operations
- **Create:** add a student and submit. Confirm a new row appears in Google Sheets.
- **Read:** refresh records and confirm the table displays the sheet rows.
- **Update:** click Edit, change a field and save. Confirm the existing row changes.
- **Delete:** click Delete and confirm. Confirm the row is removed from the sheet.

## Architecture
Browser UI → JavaScript `fetch()` → Google Apps Script Web App → Google Sheets → JSON response → browser UI.

## Submission checklist
- [ ] Google Sheet with the exact six headers
- [ ] Apps Script deployed and authorized
- [ ] Web App URL entered in `script.js`
- [ ] Create, Read, Update and Delete each tested
- [ ] Desktop/mobile UI checked
- [ ] Screenshots or short demo video captured
- [ ] Project pushed to GitHub

**Important:** The code bundle is prepared, but live Google Sheets functionality cannot be activated until you complete the account-specific Sheet ID and Apps Script deployment steps above.

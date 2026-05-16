// UVP Patient Survey — Apps Script backend
// Deploy as: Extensions → Apps Script → Deploy → New deployment
//   Type: Web app | Execute as: Me | Access: Anyone
// Copy the /exec URL into ENDPOINT in UVP_Patient_Survey.html

const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE'; // from the Sheet URL: /d/<ID>/edit
const TAB = 'Responses';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB);
    sh.appendRow([
      body.timestamp,
      body.date,
      body.provider,
      body.q1,
      body.q2,
      body.q3,
      body.q4,
      body.q5,
      body.nps,
      body.npsCategory,
      body.commentPositive  || '',
      body.commentNegative  || '',
      body.contactName      || '',
      body.contactPhone     || '',
      body.contactEmail     || '',
      body.contactPreference|| '',
      body.wantsFollowup ? 'Yes' : 'No',
      body.userAgent        || '',
      body.source           || '',
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Run this once manually in the Apps Script editor to create the header row.
function setupSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(TAB);
  if (!sh) {
    sh = ss.getSheets()[0];
    sh.setName(TAB);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow([
      'Timestamp', 'Date', 'Provider',
      'Q1 - Understood health', 'Q2 - Concerns taken seriously',
      'Q3 - Knew what to watch for', 'Q4 - True partner', 'Q5 - Spoke to child',
      'NPS Score', 'NPS Category',
      'Comment - What went well', 'Comment - What could improve',
      'Contact Name', 'Contact Phone', 'Contact Email', 'Contact Preference',
      'Wants Followup', 'User Agent', 'Source',
    ]);
    sh.setFrozenRows(1);
  }
}

// Smoke-test: run this in the Apps Script editor to verify a row appears in the Sheet.
function testDoPost() {
  const result = doPost({
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        date: '2026-05-16',
        provider: 'Test Provider',
        q1: 'Yes, definitely',
        q2: 'Yes, definitely',
        q3: 'Yes, definitely',
        q4: 'Yes, definitely',
        q5: 'Yes, definitely',
        nps: 10,
        npsCategory: 'Promoter',
        commentPositive: 'Great test',
        commentNegative: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        contactPreference: '',
        wantsFollowup: false,
        userAgent: 'test',
        source: 'script-editor',
      }),
    },
  });
  Logger.log(result.getContent());
}

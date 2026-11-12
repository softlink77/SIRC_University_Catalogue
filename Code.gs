
const CONFIG = {
  SPREADSHEET_NAME: 'SIRC University Catalogue Submissions',
  DRIVE_FOLDER_NAME: 'SIRC University Catalogue Attachments',
  SHEET_NAME: 'University Entries'
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('University Catalogue Entry | SIRC IIT Kharagpur')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function submitCatalogue(data) {
  try {
    if (!data || !data.university || !data.country || !data.memberName || !data.memberEmail) {
      throw new Error('Please complete all required fields.');
    }
    if (!data.sources || !data.sources.length || !data.sources[0]) {
      throw new Error('Please add at least one source URL.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const ss = getOrCreateSpreadsheet_();
      const sheet = getOrCreateSheet_(ss);
      let attachmentUrl = '';

      if (data.attachment && data.attachment.data) {
        const folder = getOrCreateFolder_();
        const bytes = Utilities.base64Decode(data.attachment.data);
        const blob = Utilities.newBlob(bytes, data.attachment.mimeType || 'application/octet-stream',
          sanitizeFileName_(data.attachment.name || 'supporting-file'));
        const file = folder.createFile(blob);
        attachmentUrl = file.getUrl();
      }

      const headers = getHeaders_();
      const row = headers.map(key => {
        if (key === 'submittedAt') return new Date();
        if (key === 'attachmentUrl') return attachmentUrl;
        const value = data[key];
        return Array.isArray(value) ? value.join('\n') : (value || '');
      });
      sheet.appendRow(row);
      return {ok: true, message: 'Submission saved', spreadsheetUrl: ss.getUrl()};
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
    return {ok: false, message: err && err.message ? err.message : 'Unable to save submission.'};
  }
}

function getHeaders_() {
  return [
    'submittedAt','memberName','memberEmail','university','country','city','universityType',
    'website','admissionsUrl','qsRank','qsYear','subjectRank','otherRank','degreeLevels',
    'language','courses','academicNotes','gateway','deadlines','englishTest','otherTests',
    'eligibility','tuition','livingCost','applicationFee','feeYear','scholarships',
    'acceptanceRate','acceptanceYear','opportunities','sources','extraNotes','attachmentUrl'
  ];
}

function getOrCreateSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SPREADSHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) {}
  }
  const ss = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
  props.setProperty('SPREADSHEET_ID', ss.getId());
  return ss;
}

function getOrCreateSheet_(ss) {
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.getSheets()[0].setName(CONFIG.SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(getHeaders_());
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, getHeaders_().length).setFontWeight('bold').setBackground('#eaf0f5');
    sheet.autoResizeColumns(1, getHeaders_().length);
  }
  return sheet;
}

function getOrCreateFolder_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('DRIVE_FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) {}
  }
  const folder = DriveApp.createFolder(CONFIG.DRIVE_FOLDER_NAME);
  props.setProperty('DRIVE_FOLDER_ID', folder.getId());
  return folder;
}

function sanitizeFileName_(name) {
  return String(name).replace(/[\\/:*?"<>|]/g, '_').slice(0, 150);
}

/**
 * Google Apps Script Backend for Aurora Jobs Tracker
 * Handles 14-column GET and POST endpoints for real-time two-way synchronization
 * with the React web application (including Job Description & Cover Letter).
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (payload.action === 'syncAll' && Array.isArray(payload.applications)) {
      // Ensure 14-column header row is present
      var headers = [
        'ID',
        'Job Title',
        'Company',
        'Salary (PHP)',
        'Status',
        'Job URL',
        'Platform',
        'Date Applied',
        'Follow Up Date',
        'Resume Used',
        'Notes',
        'Last Updated',
        'Job Description',
        'Cover Letter'
      ];
      sheet.getRange(1, 1, 1, 14).setValues([headers]);

      // Clear all existing data rows starting from row 2
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 14).clearContent();
      }
      
      // Transform incoming application objects into 14-column 2D row array
      var rows = payload.applications.map(function(app) {
        return [
          app.id || '',
          app.jobTitle || '',
          app.company || '',
          app.salaryPhp ? '₱' + app.salaryPhp : (app.salaryDisplay || ''),
          app.status || '',
          app.jobUrl || '',
          app.platform || '',
          app.dateApplied || '',
          app.followUpDate || '',
          app.resumeUsed || '',
          app.notes || '',
          app.lastUpdated || new Date().toISOString(),
          app.jobDescription || '',
          app.coverLetter || ''
        ];
      });
      
      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, 14).setValues(rows);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'success', 
      count: payload.applications ? payload.applications.length : 0 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var rows = data.slice(1);
  
  var result = rows.map(function(row) {
    return {
      id: row[0],
      jobTitle: row[1],
      company: row[2],
      salaryDisplay: row[3],
      status: row[4],
      jobUrl: row[5],
      platform: row[6],
      dateApplied: row[7],
      followUpDate: row[8],
      resumeUsed: row[9],
      notes: row[10],
      lastUpdated: row[11],
      jobDescription: row[12] || '',
      coverLetter: row[13] || ''
    };
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

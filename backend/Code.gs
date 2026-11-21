/**
 * Google Apps Script Backend for Aurora Jobs Tracker
 * Handles 14-column GET and POST endpoints for real-time two-way synchronization
 * with the React web application (including Job Description & Cover Letter).
 *
 * Works both when container-bound inside a Google Sheet AND when deployed
 * as a standalone Apps Script project (via SPREADSHEET_ID fallback).
 */

var SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';

function getTargetSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return ss.getSheets()[0];
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var rawData = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var payload = JSON.parse(rawData);
    var sheet = getTargetSheet_();
    
    if (payload.action === 'syncAll' && Array.isArray(payload.applications)) {
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

      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 14).clearContent();
      }
      
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
  try {
    var sheet = getTargetSheet_();
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return ContentService.createTextOutput('[]')
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Use getDisplayValues() so dates (YYYY-MM-DD) and PHP currency strings do not timezone-shift
    var data = sheet.getRange(2, 1, lastRow - 1, 14).getDisplayValues();
    
    var result = data
      .filter(function(row) {
        return row[1] || row[2];
      })
      .map(function(row) {
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
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

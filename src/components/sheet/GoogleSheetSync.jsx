import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  Download, 
  RefreshCw, 
  Check, 
  Copy, 
  Code, 
  CheckCircle2, 
  Sparkles,
  CloudDownload,
  CloudUpload,
  Smartphone,
  Lock
} from 'lucide-react';
import { exportToCsv } from '../../services/googleSheetService';
import { 
  getPrivateConfig, 
  savePrivateConfig, 
  exportSetupCode, 
  importSetupCode 
} from '../../services/profileConfigService';

const APPS_SCRIPT_CODE = `/**
 * Google Apps Script Backend for Aurora Jobs Tracker
 * Handles 14-column real-time two-way sync (doGet + doPost)
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
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
}`;

export default function GoogleSheetSync({ 
  applications, 
  onSyncNow, 
  onPullFromSheet,
  isSyncing, 
  isPulling,
  syncStatusMessage,
  privateConfig: externalConfig,
  onSavePrivateConfig
}) {
  const activeConfig = externalConfig || getPrivateConfig();
  const [sheetUrlInput, setSheetUrlInput] = useState(activeConfig.sheetUrl || '');
  const [gasUrlInput, setGasUrlInput] = useState(activeConfig.gasWebhookUrl || '');
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isSavedSettings, setIsSavedSettings] = useState(false);

  // Desktop -> iPhone Quick Transfer state
  const [generatedTransferCode, setGeneratedTransferCode] = useState('');
  const [isCopiedTransfer, setIsCopiedTransfer] = useState(false);
  const [importCodeInput, setImportCodeInput] = useState('');
  const [importFeedback, setImportFeedback] = useState(null);

  useEffect(() => {
    setSheetUrlInput(activeConfig.sheetUrl || '');
    setGasUrlInput(activeConfig.gasWebhookUrl || '');
  }, [activeConfig.sheetUrl, activeConfig.gasWebhookUrl]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const partial = {
      sheetUrl: sheetUrlInput,
      gasWebhookUrl: gasUrlInput
    };
    if (onSavePrivateConfig) {
      onSavePrivateConfig(partial);
    } else {
      savePrivateConfig(partial);
    }
    setIsSavedSettings(true);
    setTimeout(() => setIsSavedSettings(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setIsCopiedCode(true);
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  const handleGenerateTransferCode = () => {
    const code = exportSetupCode();
    setGeneratedTransferCode(code);
    navigator.clipboard.writeText(code);
    setIsCopiedTransfer(true);
    setTimeout(() => setIsCopiedTransfer(false), 2500);
  };

  const handleImportTransferCode = (e) => {
    e.preventDefault();
    const res = importSetupCode(importCodeInput);
    setImportFeedback(res);
    if (res.success && res.config) {
      if (onSavePrivateConfig) {
        onSavePrivateConfig(res.config);
      }
      setImportCodeInput('');
      if (res.config.gasWebhookUrl && onPullFromSheet) {
        onPullFromSheet();
      }
    }
  };

  const isWebhookConnected = Boolean(activeConfig.gasWebhookUrl);

  return (
    <div className="space-y-6">
      
      {/* Header Info & Two-Way Controls */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/25 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-white">Two-Way Google Sheet Backend</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  isWebhookConnected
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}>
                  {isWebhookConnected ? 'Cloud Auto-Sync Active' : 'Local Cache Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                14-Column Sync (incl. Job Description &amp; Cover Letter) &middot; Desktop &harr; iPhone Continuity
              </p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {activeConfig.sheetUrl && (
              <a
                href={activeConfig.sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 shadow-md transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Open Google Sheet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => exportToCsv(applications)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV Backup</span>
            </button>
          </div>
        </div>

        {/* Sync Status & Pull/Push Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              {syncStatusMessage || `${applications.length} applications stored locally. ${
                isWebhookConnected
                  ? 'Changes auto-sync to Google Sheet.'
                  : 'Paste your Sheet & Apps Script URLs below to enable Desktop ↔ iPhone cloud sync.'
              }`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onPullFromSheet}
              disabled={isPulling || isSyncing}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-200 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/35 transition-all disabled:opacity-50"
            >
              <CloudDownload className={`w-3.5 h-3.5 ${isPulling ? 'animate-bounce' : ''}`} />
              <span>{isPulling ? 'Pulling...' : 'Pull from Sheet'}</span>
            </button>

            <button
              type="button"
              onClick={onSyncNow}
              disabled={isSyncing || isPulling}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all disabled:opacity-50"
            >
              <CloudUpload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-pulse' : ''}`} />
              <span>{isSyncing ? 'Pushing...' : 'Push to Sheet'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop -> iPhone Quick Transfer Card */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Desktop &rarr; iPhone Quick Transfer</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Because this repo is public on GitHub, your Sheet URL, Apps Script Webhook, Drive Resume link, and contact details live only in your browser. Generate a setup code on Desktop and paste it once on iPhone Safari.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateTransferCode}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 shadow-md flex-shrink-0"
          >
            {isCopiedTransfer ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{isCopiedTransfer ? 'Copied Setup Code!' : 'Generate & Copy Setup Code'}</span>
          </button>
        </div>

        {generatedTransferCode && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/25 text-[11px] font-mono text-emerald-300 break-all max-h-24 overflow-y-auto">
            {generatedTransferCode}
          </div>
        )}

        <form onSubmit={handleImportTransferCode} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={importCodeInput}
            onChange={(e) => setImportCodeInput(e.target.value)}
            placeholder="On another device (e.g. iPhone): paste AURORA-CFG:... setup code here"
            className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-purple-200 bg-purple-500/25 hover:bg-purple-500/35 border border-purple-400/40 transition-all"
          >
            Import Setup Code
          </button>
        </form>

        {importFeedback && (
          <p className={`text-xs font-semibold ${importFeedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
            {importFeedback.message}
          </p>
        )}
      </div>

      {/* Grid: Private Sheet URLs & Apps Script Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Private Sheet URL + Webhook URL Config */}
        <div className="glass-panel rounded-3xl p-6 border border-purple-500/20 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Private Google Sheet &amp; Webhook Setup</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Saved strictly in your browser&apos;s localStorage so your personal Google Sheet ID and Web App endpoint stay private on public GitHub.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Google Sheet URL (Optional Quick Link)
              </label>
              <input
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                value={sheetUrlInput}
                onChange={(e) => setSheetUrlInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Google Apps Script Web App URL (Required for Auto-Sync)
              </label>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={gasUrlInput}
                onChange={(e) => setGasUrlInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 transition-all shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{isSavedSettings ? 'Sheet Settings Saved!' : 'Save Sheet Settings'}</span>
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2 text-slate-400">
            <div className="font-bold text-slate-300">How to deploy in 60 seconds:</div>
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Open your Google Sheet (link provided in chat).</li>
              <li>Click <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Paste the 14-column code on the right and click <strong>Save</strong>.</li>
              <li>Click <strong>Deploy &gt; New deployment</strong>.</li>
              <li>Select <em>Web app</em>, execute as <em>Me</em>, who has access: <em>Anyone</em>.</li>
              <li>Copy the Web app URL, paste it above, and click <strong>Save Sheet Settings</strong>!</li>
            </ol>
          </div>
        </div>

        {/* Right: Code.gs copy panel */}
        <div className="glass-panel rounded-3xl p-6 border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Code className="w-4 h-4 text-purple-400" />
              <span>Apps Script Code (Code.gs)</span>
            </h3>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all"
            >
              {isCopiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopiedCode ? 'Copied!' : 'Copy Code.gs'}</span>
            </button>
          </div>

          <div className="relative rounded-2xl bg-[#090510] border border-slate-800 p-3.5 overflow-hidden">
            <pre className="text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-[380px] leading-relaxed">
              {APPS_SCRIPT_CODE}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
}

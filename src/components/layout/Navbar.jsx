import React from 'react';
import { 
  Briefcase, 
  Search, 
  FileText, 
  FileSpreadsheet, 
  Plus, 
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenNewModal, 
  applications = [],
  onSyncNow,
  isSyncing,
  sheetUrl = '',
  isWebhookConnected = false
}) {

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/15 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-purple-600 p-[1.5px] shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <div className="w-full h-full bg-[#0d0718] rounded-[10px] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-300 bg-clip-text text-transparent whitespace-nowrap">
                  Aurora<span className="text-emerald-400">Jobs</span>
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5 mr-1" /> Jesse Aaron
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block whitespace-nowrap">
                Remote Tracker &middot; ₱40k–₱70k PHP
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 rounded-xl bg-slate-900/60 border border-purple-500/15 flex-shrink-0">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'tracker'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span>Job Tracker</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] bg-slate-800 text-slate-300">
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Search className="w-4 h-4 flex-shrink-0" />
              <span>Remote Search</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'resume'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>Resume Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('sheet')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'sheet'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />
              <span>Google Sheet</span>
            </button>
          </nav>

          {/* Quick Actions & Sheet Link */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Direct Google Sheet Button */}
            {sheetUrl ? (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400/90 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all whitespace-nowrap"
                title="Open Google Sheet Backend"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>View Sheet</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('sheet')}
                className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 transition-all whitespace-nowrap"
                title="Configure Google Sheet URL"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Setup Sheet</span>
              </button>
            )}

            {/* Sync Button */}
            <button
              type="button"
              onClick={onSyncNow}
              disabled={isSyncing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-purple-500/20 transition-all flex items-center space-x-1.5 whitespace-nowrap"
              title="Sync with Google Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'Syncing...' : (isWebhookConnected ? 'Synced' : 'Local')}
              </span>
            </button>

            {/* Add Application Button */}
            <button
              onClick={onOpenNewModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 shadow-md shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Job</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

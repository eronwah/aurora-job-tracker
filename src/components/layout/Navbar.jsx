import React from 'react';
import { 
  Briefcase, 
  Search, 
  FileText, 
  Plus, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenNewModal, 
  applications = [],
  onSyncNow,
  isSyncing
}) {
  return (
    <header className="sticky top-0 z-40 w-full safe-top glass-panel border-b border-zinc-700/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-yellow-400 via-zinc-200 to-zinc-500 p-[1.5px] shadow-lg shadow-yellow-400/15 flex-shrink-0">
              <div className="w-full h-full bg-[#111317] rounded-[10px] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent whitespace-nowrap">
                  Aurora<span className="text-yellow-400">Jobs</span>
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800/90 text-zinc-200 border border-zinc-600/60 whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5 mr-1 text-yellow-400" /> Jesse Aaron
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block whitespace-nowrap">
                Remote Tracker &middot; ₱40k–₱70k PHP
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (3 Clean Core Tabs) */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 rounded-xl bg-zinc-900/80 border border-zinc-700/60 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'tracker'
                  ? 'bg-yellow-400/15 text-yellow-300 border border-yellow-400/35 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span>Job Tracker</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] bg-zinc-800 text-zinc-200 border border-zinc-700">
                {applications.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'search'
                  ? 'bg-yellow-400/15 text-yellow-300 border border-yellow-400/35 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              <Search className="w-4 h-4 flex-shrink-0" />
              <span>Remote Search</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-yellow-400 text-zinc-950 font-extrabold">
                Live
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('resume')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'resume'
                  ? 'bg-yellow-400/15 text-yellow-300 border border-yellow-400/35 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>Resume Hub</span>
            </button>
          </nav>

          {/* Right Quick Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Silent Sheet Sync Button */}
            <button
              type="button"
              onClick={onSyncNow}
              disabled={isSyncing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-900/85 hover:bg-zinc-800 border border-zinc-700/80 transition-all flex items-center space-x-1.5 whitespace-nowrap"
              title="Sync directly with Google Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-yellow-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'Syncing...' : 'Sync Sheet'}
              </span>
            </button>

            {/* Add Application Primary Yellow CTA */}
            <button
              type="button"
              onClick={onOpenNewModal}
              className="flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-zinc-950 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:from-yellow-300 hover:to-amber-200 shadow-md shadow-yellow-400/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
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

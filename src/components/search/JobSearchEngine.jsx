import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Filter, 
  Briefcase, 
  ShieldCheck, 
  RefreshCw, 
  WifiOff
} from 'lucide-react';
import { searchRemoteJobs } from '../../services/jobSearchService';
import JobListingCard from './JobListingCard';

export default function JobSearchEngine({ onAddToTracker, existingApplications = [] }) {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [sources, setSources] = useState({ remotive: 0, jobicy: 0, arbeitnow: 0 });
  const [searchError, setSearchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'All Remote Roles' },
    { id: 'operations', label: 'Operations & Admin' },
    { id: 'google', label: 'Google Workspace / Sheets' },
    { id: 'database', label: 'Database & Automation' },
    { id: 'qa', label: 'QA & Customer Support' }
  ];

  const runSearch = async (overrideCategory = selectedCategory, overrideKeyword = keyword) => {
    setIsLoading(true);
    setSearchError(null);
    try {
      const res = await searchRemoteJobs({
        keyword: overrideKeyword,
        category: overrideCategory
      });
      setJobs(res.jobs || []);
      setSources(res.sources || { remotive: 0, jobicy: 0, arbeitnow: 0 });
      setSearchError(res.error || null);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("Could not reach live remote job boards right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    runSearch(selectedCategory, keyword);
  };

  // Perform initial live search on mount
  useEffect(() => {
    runSearch('all', '');
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Search Header Banner with Liquid Aurora glow */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-emerald-500/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-emerald-500/10 via-purple-500/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Live Remote Feeds &middot; AI Boards Excluded</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Live Remote Jobs for <span className="text-emerald-400">Jesse Aaron</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Real-time jobs queried from human-reviewed boards (Remotive, Jobicy, Arbeitnow) ranked by your Google Workspace, Operations, Database, and QA match score (Target: <strong className="text-emerald-300 font-semibold">₱40,000 - ₱70,000 PHP</strong>).
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Desired Salary Target</span>
              <span className="text-sm font-extrabold text-emerald-400">₱40,000 - ₱70,000 / mo</span>
            </div>
          </div>

          {/* Search Bar Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 mt-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search live remote roles (e.g. Operations, Support, Admin, Data, QA)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-xs sm:text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              <RefreshCw className={`w-4 h-4 text-slate-950 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Searching Live...' : 'Search Remote Jobs'}</span>
            </button>
          </form>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  runSearch(cat.id, keyword);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Live Source Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px]">
            <span className="text-slate-400 font-semibold">Live Sources:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-medium">
              Remotive ({sources.remotive})
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 font-medium">
              Jobicy ({sources.jobicy})
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/25 font-medium">
              Arbeitnow ({sources.arbeitnow})
            </span>
          </div>

        </div>
      </div>

      {/* Safety & Compliance Badge */}
      <div className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-purple-300 text-xs">
        <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
        <span>
          <strong>AI Safety Filter Active:</strong> Automated AI-bot job boards (LazyApply, LoopCV, Sonara, AutoJob) are excluded. Every listing is fetched live and strictly remote, with a ready-to-paste human cover letter.
        </span>
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            {jobs.length} Live Remote Opportunities Found
          </h3>
          <span className="text-xs text-slate-400">
            Sorted by <strong className="text-emerald-400">Skill Match Score</strong>
          </span>
        </div>

        {isLoading ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-emerald-500/20">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-200">
              Querying live remote job boards (Remotive, Jobicy, Arbeitnow) &amp; tailoring cover letters...
            </p>
          </div>
        ) : searchError && jobs.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-amber-500/25 space-y-3">
            <WifiOff className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-200">{searchError}</p>
            <button
              type="button"
              onClick={() => runSearch(selectedCategory, keyword)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Live Search</span>
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No live remote jobs matched those filters.</p>
            <p className="text-xs text-slate-500">Try clearing the keyword or switching back to &ldquo;All Remote Roles&rdquo;.</p>
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                setSelectedCategory('all');
                runSearch('all', '');
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25"
            >
              <span>Reset &amp; Reload Live Jobs</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const isAlreadyInTracker = existingApplications.some(
                app => app.jobTitle.toLowerCase() === job.title.toLowerCase() ||
                       (app.jobUrl && app.jobUrl === job.jobUrl)
              );

              return (
                <JobListingCard
                  key={job.id}
                  job={job}
                  onAddToTracker={onAddToTracker}
                  isAlreadyInTracker={isAlreadyInTracker}
                />
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

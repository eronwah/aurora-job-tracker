import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Filter, 
  Briefcase, 
  ShieldCheck, 
  RefreshCw, 
  WifiOff,
  Globe2
} from 'lucide-react';
import { 
  searchRemoteJobs, 
  SKILL_SEARCH_PRESETS 
} from '../../services/jobSearchService';
import JobListingCard from './JobListingCard';

export default function JobSearchEngine({ 
  onAddToTracker, 
  existingApplications = []
}) {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [sources, setSources] = useState({ remoteok: 0, remotive: 0, jobicy: 0, arbeitnow: 0 });
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
      setSources(res.sources || { remoteok: 0, remotive: 0, jobicy: 0, arbeitnow: 0 });
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

  const handleSelectPreset = (presetQuery) => {
    setKeyword(presetQuery);
    runSearch(selectedCategory, presetQuery);
  };

  useEffect(() => {
    runSearch('all', '');
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Search Header Banner in Graphite Gray, Brushed Silver & Yellow */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-zinc-700/70 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-yellow-400/10 via-zinc-300/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/15 text-yellow-300 border border-yellow-400/35 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Strictly Remote &middot; Clear Platform Source Tags</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Live Remote Jobs for <span className="text-yellow-400">Jesse Aaron</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                Real-time remote listings ranked by your skills and <strong className="text-yellow-300 font-semibold">₱40,000 - ₱70,000 / mo</strong> target. Every job card clearly shows the exact website/platform where it was found, plus a ready-to-paste human cover letter.
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 text-left sm:text-right">
              <span className="text-[11px] text-zinc-400 block font-medium">Desired Salary Target</span>
              <span className="text-sm font-extrabold text-yellow-400">₱40,000 - ₱70,000 / mo</span>
            </div>
          </div>

          {/* Search Bar Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 mt-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-yellow-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search job title or skill (e.g. Operations, Support, Admin, Data, QA)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-xs sm:text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl font-bold text-zinc-950 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:from-yellow-300 hover:to-amber-200 shadow-lg shadow-yellow-400/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              <RefreshCw className={`w-4 h-4 text-zinc-950 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Searching Live...' : 'Search Remote Jobs'}</span>
            </button>
          </form>

          {/* 1-Click Skill Presets */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-[11px] font-semibold text-zinc-400 mr-1">
              Quick Keywords:
            </span>
            {SKILL_SEARCH_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.query)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all border ${
                  keyword.toLowerCase() === preset.query.toLowerCase()
                    ? 'bg-yellow-400/20 text-yellow-200 border-yellow-400/45'
                    : 'bg-zinc-900/70 text-zinc-300 hover:text-white border-zinc-700/80 hover:border-zinc-500'
                }`}
              >
                {preset.label}
              </button>
            ))}
            {keyword && (
              <button
                type="button"
                onClick={() => {
                  setKeyword('');
                  runSearch(selectedCategory, '');
                }}
                className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-zinc-400 hover:text-yellow-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Chips & Source Counts */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
            <span className="text-xs font-semibold text-zinc-400 mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1 text-yellow-400" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  runSearch(cat.id, keyword);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/45 shadow-sm'
                    : 'bg-zinc-900/75 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Live Platform Source Counts */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px]">
            <span className="text-zinc-400 font-semibold flex items-center space-x-1">
              <Globe2 className="w-3.5 h-3.5 text-yellow-400" />
              <span>Platforms Found:</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-600/80 font-semibold">
              RemoteOK ({sources.remoteok})
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-600/80 font-semibold">
              Remotive ({sources.remotive})
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-600/80 font-semibold">
              Jobicy ({sources.jobicy})
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-600/80 font-semibold">
              Arbeitnow ({sources.arbeitnow})
            </span>
          </div>
        </div>
      </div>

      {/* AI Job Website Exclusion Shield */}
      <div className="flex items-start sm:items-center space-x-2.5 px-4 py-3 rounded-2xl bg-zinc-900/75 border border-zinc-700/70 text-zinc-300 text-xs leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5 sm:mt-0" />
        <span>
          <strong className="text-zinc-100">AI Job Websites Excluded:</strong> AI-operated job websites and auto-apply portals are blocked by domain. Legitimate roles involving AI tools or workflow automation that match your resume are still included.
        </span>
      </div>

      {/* Live Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
            {jobs.length} Live Remote Opportunities Found
          </h3>
          <span className="text-xs text-zinc-400">
            Sorted by <strong className="text-yellow-400">Skill Match Score</strong>
          </span>
        </div>

        {isLoading ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-zinc-700/70">
            <RefreshCw className="w-8 h-8 text-yellow-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-200">
              Searching RemoteOK, Remotive, Jobicy &amp; Arbeitnow and tailoring human cover letters...
            </p>
          </div>
        ) : searchError && jobs.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 text-center border border-yellow-400/30 space-y-3">
            <WifiOff className="w-10 h-10 text-yellow-400 mx-auto" />
            <p className="text-sm font-semibold text-zinc-200">{searchError}</p>
            <button
              type="button"
              onClick={() => runSearch(selectedCategory, keyword)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Live Search</span>
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 text-center border border-zinc-800 space-y-3">
            <Briefcase className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-200">No live remote jobs matched those filters right now.</p>
            <p className="text-xs text-zinc-400">Try clearing the keyword or switching back to &ldquo;All Remote Roles&rdquo;.</p>
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                setSelectedCategory('all');
                runSearch('all', '');
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-yellow-300 bg-yellow-400/15 border border-yellow-400/35 hover:bg-yellow-400/25"
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

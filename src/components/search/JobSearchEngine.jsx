import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Filter, 
  Briefcase, 
  ShieldCheck, 
  RefreshCw, 
  WifiOff,
  ExternalLink,
  Plus,
  Globe2
} from 'lucide-react';
import { 
  searchRemoteJobs, 
  buildMajorPlatformSearches, 
  SKILL_SEARCH_PRESETS 
} from '../../services/jobSearchService';
import JobListingCard from './JobListingCard';

export default function JobSearchEngine({ 
  onAddToTracker, 
  existingApplications = [],
  onQuickLogFromPlatform
}) {
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

  const majorPlatforms = useMemo(() => buildMajorPlatformSearches(keyword), [keyword]);

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
      setSearchError("Could not reach live remote feeds right now, but major platform links above still work.");
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
                <span>Major Human Platforms &middot; Strictly Remote</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Remote Job Search for <span className="text-emerald-400">Jesse Aaron</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Search trusted platforms like <strong className="text-white">LinkedIn, Indeed, Upwork, OnlineJobs.ph, and JobStreet PH</strong> pre-filtered to Remote roles matched to your skills and <strong className="text-emerald-300 font-semibold">₱40,000 - ₱70,000 / mo</strong> target.
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-left sm:text-right">
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
                placeholder="Enter role or skill (updates LinkedIn, Indeed, Upwork & live feeds)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-xs sm:text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              <RefreshCw className={`w-4 h-4 text-slate-950 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Searching...' : 'Search Remote Jobs'}</span>
            </button>
          </form>

          {/* 1-Click Skill Presets from Resume */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">
              Resume Presets:
            </span>
            {SKILL_SEARCH_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.query)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all border ${
                  keyword.toLowerCase() === preset.query.toLowerCase()
                    ? 'bg-purple-500/25 text-purple-200 border-purple-400/50'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white border-slate-800 hover:border-purple-500/30'
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
                className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-emerald-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transparency & AI Website Exclusion Banner */}
      <div className="flex items-start sm:items-center space-x-2.5 px-4 py-3 rounded-2xl bg-purple-950/35 border border-purple-500/25 text-purple-200 text-xs leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
        <span>
          <strong>AI Job Websites Excluded:</strong> Searches strictly focus on major established human job platforms (LinkedIn, Indeed, Upwork, OnlineJobs.ph, JobStreet, WeWorkRemotely) and verified non-AI live feeds. Legitimate roles involving AI tools or automation that match your resume are still included!
        </span>
      </div>

      {/* SECTION 1 (Primary Focus): Major Human Job Platforms */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center space-x-2">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Major Remote Job Platforms
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Pre-filtered for <strong className="text-emerald-300">&ldquo;{keyword.trim() || 'Operations Administrator Google Sheets'}&rdquo;</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {majorPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="glass-panel glass-panel-hover rounded-2xl p-4 border border-purple-500/20 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-white">{platform.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                    {platform.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {platform.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 transition-all shadow-sm"
                >
                  <span>Search {platform.platformValue}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {onQuickLogFromPlatform && (
                  <button
                    type="button"
                    onClick={() => onQuickLogFromPlatform(platform.platformValue)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-purple-200 bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/30 transition-all whitespace-nowrap"
                    title={`Log a job you found on ${platform.platformValue}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Track</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Verified Live Non-AI Remote Feed */}
      <div className="space-y-4 pt-2">
        <div className="glass-panel rounded-2xl p-4 border border-purple-500/20 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Verified Live Non-AI Remote Feed ({jobs.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Direct listings fetched live with automatic skill match scoring and ready-to-paste human cover letters.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
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

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Feed Category:
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
        </div>

        {isLoading ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-emerald-500/20">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-200">
              Querying verified non-AI remote boards &amp; tailoring human cover letters...
            </p>
          </div>
        ) : searchError && jobs.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 text-center border border-amber-500/25 space-y-3">
            <WifiOff className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-200">{searchError}</p>
            <button
              type="button"
              onClick={() => runSearch(selectedCategory, keyword)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Live Feed</span>
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 text-center border border-slate-800 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No live feed items matched that specific keyword right now.</p>
            <p className="text-xs text-slate-400">
              Try launching your search on <strong>LinkedIn</strong>, <strong>Indeed</strong>, <strong>Upwork</strong>, or <strong>OnlineJobs.ph</strong> above, or reset the feed filter below.
            </p>
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                setSelectedCategory('all');
                runSearch('all', '');
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25"
            >
              <span>Reset &amp; Reload Live Feed</span>
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

import React, { useState } from 'react';
import { PIPELINE_STAGES } from '../../data/defaultApplications';
import { formatPhp } from '../../utils/currency';
import {
  ExternalLink,
  Pencil,
  Trash2,
  Search,
  Mail,
  FileText,
  Sparkles,
  Plus,
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';

export default function TableView({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
  onSelectJob,
  onQuickAdd,
  onClearAll
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // recent | salary | match | followUp

  const filtered = applications
    .filter(app => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (app.jobTitle && app.jobTitle.toLowerCase().includes(q)) ||
        (app.company && app.company.toLowerCase().includes(q)) ||
        (app.platform && app.platform.toLowerCase().includes(q)) ||
        (app.notes && app.notes.toLowerCase().includes(q)) ||
        (app.jobDescription && app.jobDescription.toLowerCase().includes(q));

      const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'salary') {
        return (b.salaryPhp || 0) - (a.salaryPhp || 0);
      }
      if (sortBy === 'match') {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      if (sortBy === 'followUp') {
        const dateA = a.followUpDate ? new Date(a.followUpDate).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.followUpDate ? new Date(b.followUpDate).getTime() : Number.MAX_SAFE_INTEGER;
        return dateA - dateB;
      }
      // Default: Newest Updated
      const updA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
      const updB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      return updB - updA;
    });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
  };

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-purple-500/20 space-y-5">
      {/* Stage Filter Pills (Horizontally scrollable on iPhone 17 Pro Max, wrapped on Desktop) */}
      <div className="overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        <div className="flex sm:flex-wrap items-center gap-2 min-w-max sm:min-w-0">
          <button
            type="button"
            onClick={() => setSelectedStatus('all')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedStatus === 'all'
                ? 'bg-gradient-to-r from-emerald-500/25 to-purple-600/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>All</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedStatus === 'all'
                  ? 'bg-emerald-400 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {applications.length}
            </span>
          </button>

          {PIPELINE_STAGES.map(stage => {
            const count = applications.filter(a => a.status === stage.id).length;
            const isActive = selectedStatus === stage.id;
            return (
              <button
                type="button"
                key={stage.id}
                onClick={() => setSelectedStatus(stage.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/25 to-purple-600/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{stage.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title, company, platform, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex items-center flex-1 sm:flex-initial">
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto pl-8 pr-3 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
              aria-label="Sort applications"
            >
              <option value="recent">Sort: Newest Updated</option>
              <option value="salary">Sort: Highest Salary (PHP)</option>
              <option value="match">Sort: Highest Match Score</option>
              <option value="followUp">Sort: Next Follow-Up</option>
            </select>
          </div>

          {onClearAll && applications.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-300 bg-slate-900/70 hover:bg-rose-500/15 border border-slate-800 hover:border-rose-500/30 transition-all whitespace-nowrap"
              title="Clear all tracked applications (e.g. remove sample data)"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 space-y-3">
          <p className="text-sm font-semibold text-slate-300">
            No applications found matching your current filter.
          </p>
          <div className="flex items-center justify-center gap-2.5">
            {(searchTerm || selectedStatus !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
            {onQuickAdd && (
              <button
                type="button"
                onClick={() => onQuickAdd(selectedStatus === 'all' ? 'applied' : selectedStatus)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Job</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* DESKTOP VIEW: Clean Full-Width Pure Table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800/90 bg-slate-950/35">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/85 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-3">Job Title &amp; Company</th>
                  <th className="py-3.5 px-3">Salary (PHP)</th>
                  <th className="py-3.5 px-3">Stage</th>
                  <th className="py-3.5 px-3">Platform</th>
                  <th className="py-3.5 px-3 hidden lg:table-cell">Applied / Follow-Up</th>
                  <th className="py-3.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filtered.map((app) => {
                  const stage = PIPELINE_STAGES.find(s => s.id === app.status) || PIPELINE_STAGES[0];
                  return (
                    <tr
                      key={app.id}
                      onClick={() => onSelectJob && onSelectJob(app, 'details')}
                      className="hover:bg-emerald-500/5 transition-colors cursor-pointer group"
                    >
                      {/* Job Title, Company & Hint */}
                      <td className="py-3.5 px-3 max-w-[260px]">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                            {app.jobTitle}
                          </span>
                          {app.matchScore && (
                            <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{app.matchScore}%</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1.5 mt-0.5 text-xs text-slate-400 truncate">
                          <span className="font-medium text-slate-300 truncate">{app.company}</span>
                          <span className="text-slate-600">&bull;</span>
                          <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-400/80 group-hover:text-emerald-300 flex-shrink-0">
                            <FileText className="w-3 h-3" />
                            <span>Details &amp; letter</span>
                          </span>
                        </div>
                      </td>

                      {/* Salary */}
                      <td className="py-3.5 px-3 font-bold text-emerald-400 whitespace-nowrap">
                        {app.salaryPhp ? `${formatPhp(app.salaryPhp)} / mo` : (app.salaryDisplay || '—')}
                      </td>

                      {/* Stage Dropdown */}
                      <td
                        className="py-3.5 px-3 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={app.status}
                          onChange={(e) => onStatusChange(app.id, e.target.value)}
                          className={`text-xs font-semibold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer ${stage.badge}`}
                          aria-label={`Change status for ${app.jobTitle}`}
                        >
                          {PIPELINE_STAGES.map(s => (
                            <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Platform */}
                      <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800/90 text-[11px] font-medium border border-slate-700">
                          {app.platform || 'Direct'}
                        </span>
                      </td>

                      {/* Applied & Follow-up */}
                      <td className="py-3.5 px-3 hidden lg:table-cell text-xs whitespace-nowrap">
                        <div className="text-slate-300">{app.dateApplied || '—'}</div>
                        {app.followUpDate && (
                          <div className="text-[11px] text-amber-400 font-medium mt-0.5">
                            Follow-up: {app.followUpDate}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-3 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            type="button"
                            onClick={() => onSelectJob && onSelectJob(app, 'coverLetter')}
                            className="inline-flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 text-[11px] font-semibold transition-all"
                            title="Open Cover Letter"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">Letter</span>
                          </button>

                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-all"
                              title="Open Job Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => onEdit(app)}
                            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-purple-500/20 text-slate-400 hover:text-purple-300 transition-all"
                            title="Edit Application"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(app.id)}
                            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all"
                            title="Delete Application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW (iPhone 17 Pro Max): Compact Tappable Table-Rows without Horizontal Scroll */}
          <div className="md:hidden rounded-2xl border border-slate-800/90 bg-slate-950/40 divide-y divide-slate-800/70 overflow-hidden">
            {filtered.map((app) => {
              const stage = PIPELINE_STAGES.find(s => s.id === app.status) || PIPELINE_STAGES[0];
              return (
                <div
                  key={app.id}
                  onClick={() => onSelectJob && onSelectJob(app, 'details')}
                  className="p-4 active:bg-emerald-500/10 transition-colors cursor-pointer space-y-2.5"
                >
                  {/* Top Line: Title + PHP Salary */}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white leading-snug flex-1">
                      {app.jobTitle}
                    </h4>
                    <span className="text-xs font-extrabold text-emerald-400 whitespace-nowrap bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                      {app.salaryPhp ? `${formatPhp(app.salaryPhp)}` : (app.salaryDisplay || '—')}
                    </span>
                  </div>

                  {/* Second Line: Company + Platform + Match */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span className="font-semibold text-slate-200">{app.company}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                      {app.platform || 'Direct'}
                    </span>
                    {app.matchScore && (
                      <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{app.matchScore}%</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Action Row */}
                  <div
                    className="flex items-center justify-between gap-2 pt-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={app.status}
                      onChange={(e) => onStatusChange(app.id, e.target.value)}
                      className={`text-[11px] font-semibold py-1 px-2 rounded-lg border focus:outline-none max-w-[140px] ${stage.badge}`}
                      aria-label={`Change status for ${app.jobTitle}`}
                    >
                      {PIPELINE_STAGES.map(s => (
                        <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                          {s.label}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectJob && onSelectJob(app, 'coverLetter')}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-500/35 text-[11px] font-semibold"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Cover Letter</span>
                      </button>

                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                          title="Open Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => onEdit(app)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

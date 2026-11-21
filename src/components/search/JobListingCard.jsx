import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Banknote, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  Check, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  Mail,
  Copy
} from 'lucide-react';
import { countWords } from '../../utils/coverLetterGenerator';

export default function JobListingCard({ job, onAddToTracker, isAlreadyInTracker }) {
  const [activeDrawer, setActiveDrawer] = useState(null); // null | 'match' | 'coverLetter'
  const [justAdded, setJustAdded] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [customCoverLetter, setCustomCoverLetter] = useState(job.coverLetter || '');

  useEffect(() => {
    setCustomCoverLetter(job.coverLetter || '');
  }, [job.id, job.coverLetter]);

  const toggleDrawer = (drawerName) => {
    setActiveDrawer((prev) => (prev === drawerName ? null : drawerName));
  };

  const handleAdd = () => {
    onAddToTracker({
      ...job,
      coverLetter: customCoverLetter
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(customCoverLetter);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-purple-500/20 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        
        {/* Left side: Role, Company, Badges */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {job.platform}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{job.location}</span>
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              <span>Verified Non-AI</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
            {job.title}
          </h3>

          <div className="flex items-center space-x-2 text-xs text-slate-300 mt-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">{job.company}</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-400">{job.datePosted || 'Recent'}</span>
          </div>
        </div>

        {/* Right side: Match score badge & Salary */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/35 text-emerald-300 font-bold text-xs sm:text-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{job.matchScore}% Match</span>
          </div>

          <div className="flex items-center space-x-1 text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <Banknote className="w-3.5 h-3.5" />
            <span>{job.salaryDisplay || '₱45,000 - ₱70,000 / mo'}</span>
          </div>
        </div>

      </div>

      {/* Description Snippet */}
      <p className="text-xs sm:text-sm text-slate-300 mt-3.5 line-clamp-3 leading-relaxed">
        {job.description}
      </p>

      {/* Expandable Match Analysis */}
      {activeDrawer === 'match' && (
        <div className="mt-4 pt-3.5 border-t border-slate-800 text-xs space-y-2.5 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80">
          <div>
            <span className="font-bold text-slate-200">Matched Skills with Jesse&apos;s Profile:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {(job.matchedSkills || []).map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {job.matchHighlights && job.matchHighlights.length > 0 && (
            <div>
              <span className="font-bold text-slate-200">Why this fits your resume:</span>
              <ul className="list-disc list-inside mt-1 space-y-1 text-slate-400 text-[11px]">
                {job.matchHighlights.map((hl, i) => (
                  <li key={i}>{hl}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Expandable Ready-to-Paste Cover Letter Drawer */}
      {activeDrawer === 'coverLetter' && (
        <div className="mt-4 pt-3.5 border-t border-emerald-500/20 text-xs space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-purple-500/20">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">Ready-to-Paste Cover Letter</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Natural human tone
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {countWords(customCoverLetter)} words &middot; Editable before copying
            </span>
          </div>

          <textarea
            rows="8"
            value={customCoverLetter}
            onChange={(e) => setCustomCoverLetter(e.target.value)}
            className="w-full p-3.5 rounded-xl glass-input text-xs sm:text-sm leading-relaxed text-slate-100 resize-y"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">
              Any edits made here will automatically save if you click &ldquo;Add to Tracker&rdquo;.
            </span>
            <button
              type="button"
              onClick={handleCopyCoverLetter}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-md shadow-emerald-500/20 transition-all"
            >
              {copiedCoverLetter ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Cover Letter!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Cover Letter</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80">
        
        {/* Left toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => toggleDrawer('match')}
            className={`text-xs font-semibold flex items-center space-x-1 transition-colors ${
              activeDrawer === 'match' ? 'text-emerald-300' : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <span>{activeDrawer === 'match' ? 'Hide Match Details' : 'View Match Details'}</span>
            {activeDrawer === 'match' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => toggleDrawer('coverLetter')}
            className={`text-xs font-semibold flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              activeDrawer === 'coverLetter'
                ? 'bg-purple-500/20 text-purple-200 border-purple-400/40'
                : 'bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{activeDrawer === 'coverLetter' ? 'Hide Cover Letter' : 'Cover Letter'}</span>
          </button>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center space-x-2">
          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <span>View Listing</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={isAlreadyInTracker || justAdded}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isAlreadyInTracker
                ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 shadow-md shadow-emerald-500/20 hover:scale-[1.02]'
            }`}
          >
            {isAlreadyInTracker ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>In Tracker</span>
              </>
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add to Tracker</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}

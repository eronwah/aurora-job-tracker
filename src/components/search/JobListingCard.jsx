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
  Copy,
  Globe2
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
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-zinc-700/70 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        
        {/* Left side: Prominent Source Platform Badge, Role, Company */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Prominent Website / Platform Source Badge */}
            <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/45 shadow-sm">
              <Globe2 className="w-3 h-3 text-yellow-400" />
              <span>Platform: {job.platform}</span>
            </span>

            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-zinc-400" />
              <span>{job.location}</span>
            </span>

            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-900/90 text-zinc-300 border border-zinc-700/80 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-yellow-400" />
              <span>Verified Non-AI Site</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">
            {job.title}
          </h3>

          <div className="flex items-center space-x-2 text-xs text-zinc-300 mt-1">
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-semibold">{job.company}</span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-zinc-400">{job.datePosted || 'Recent'}</span>
          </div>
        </div>

        {/* Right side: Match score badge & Salary */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-yellow-400/15 border border-yellow-400/35 text-yellow-300 font-bold text-xs sm:text-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>{job.matchScore}% Match</span>
          </div>

          <div className="flex items-center space-x-1 text-xs sm:text-sm font-bold text-zinc-100 bg-zinc-800/90 px-2.5 py-1 rounded-lg border border-zinc-700">
            <Banknote className="w-3.5 h-3.5 text-yellow-400" />
            <span>{job.salaryDisplay || '₱40,000 - ₱70,000 / mo'}</span>
          </div>
        </div>

      </div>

      {/* Description Snippet */}
      <p className="text-xs sm:text-sm text-zinc-300 mt-3.5 line-clamp-3 leading-relaxed">
        {job.description}
      </p>

      {/* Expandable Match Analysis */}
      {activeDrawer === 'match' && (
        <div className="mt-4 pt-3.5 border-t border-zinc-800 text-xs space-y-2.5 bg-zinc-900/75 p-3.5 rounded-xl border border-zinc-800">
          <div>
            <span className="font-bold text-zinc-100">Matched Skills with Jesse&apos;s Profile:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {(job.matchedSkills || []).map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-yellow-400/15 text-yellow-300 border border-yellow-400/30 text-[11px] font-medium"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {job.matchHighlights && job.matchHighlights.length > 0 && (
            <div>
              <span className="font-bold text-zinc-100">Why this fits your resume:</span>
              <ul className="list-disc list-inside mt-1 space-y-1 text-zinc-400 text-[11px]">
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
        <div className="mt-4 pt-3.5 border-t border-zinc-700/70 text-xs space-y-3 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-700/70">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-white">Ready-to-Paste Cover Letter</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-200 border border-zinc-600">
                Natural human tone
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">
              {countWords(customCoverLetter)} words &middot; Editable before copying
            </span>
          </div>

          <textarea
            rows="8"
            value={customCoverLetter}
            onChange={(e) => setCustomCoverLetter(e.target.value)}
            className="w-full p-3.5 rounded-xl glass-input text-xs sm:text-sm leading-relaxed text-zinc-100 resize-y"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-zinc-400">
              Any edits made here will automatically save when you click &ldquo;Add to Tracker&rdquo;.
            </span>
            <button
              type="button"
              onClick={handleCopyCoverLetter}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 hover:to-amber-200 shadow-md shadow-yellow-400/20 transition-all"
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
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-zinc-800">
        
        {/* Left toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => toggleDrawer('match')}
            className={`text-xs font-semibold flex items-center space-x-1 transition-colors ${
              activeDrawer === 'match' ? 'text-yellow-300' : 'text-zinc-400 hover:text-zinc-100'
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
                ? 'bg-yellow-400/20 text-yellow-200 border-yellow-400/45'
                : 'bg-zinc-800/90 text-zinc-200 border-zinc-700 hover:border-yellow-400/40'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-yellow-400" />
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
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700 transition-all"
            >
              <span>View on {job.platform}</span>
              <ExternalLink className="w-3 h-3 text-yellow-400" />
            </a>
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={isAlreadyInTracker || justAdded}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isAlreadyInTracker
                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed'
                : justAdded
                ? 'bg-yellow-400 text-zinc-950 shadow-md'
                : 'bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 hover:to-amber-200 text-zinc-950 shadow-md shadow-yellow-400/20 hover:scale-[1.02]'
            }`}
          >
            {isAlreadyInTracker ? (
              <>
                <Check className="w-3.5 h-3.5 text-yellow-400" />
                <span>In Tracker</span>
              </>
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-zinc-950" />
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

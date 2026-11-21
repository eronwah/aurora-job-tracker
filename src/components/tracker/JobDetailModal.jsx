import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Mail,
  ExternalLink,
  Pencil,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Building2,
  MapPin,
  Banknote,
  Calendar,
  Clock,
  RefreshCw,
  Save,
  Globe2
} from 'lucide-react';
import { PIPELINE_STAGES } from '../../data/defaultApplications';
import { formatPhp } from '../../utils/currency';
import { generateHumanCoverLetter, countWords } from '../../utils/coverLetterGenerator';

export default function JobDetailModal({
  application,
  isOpen,
  initialTab = 'details',
  onClose,
  onUpdateApplication,
  onEditFull,
  onStatusChange,
  onDelete
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [draftDescription, setDraftDescription] = useState('');
  const [draftCoverLetter, setDraftCoverLetter] = useState('');
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab || 'details');
  }, [initialTab, application?.id, isOpen]);

  useEffect(() => {
    if (application) {
      setDraftDescription(application.jobDescription || '');
      setDraftCoverLetter(
        application.coverLetter ||
          generateHumanCoverLetter({
            jobTitle: application.jobTitle,
            company: application.company,
            description: application.jobDescription || '',
            platform: application.platform || ''
          })
      );
      setIsEditingDescription(false);
    }
  }, [application]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !application) return null;

  const currentStage = PIPELINE_STAGES.find(s => s.id === application.status) || PIPELINE_STAGES[0];
  const hasUnsavedCoverLetter = draftCoverLetter !== (application.coverLetter || '');

  const handleSaveDescription = () => {
    onUpdateApplication({
      ...application,
      jobDescription: draftDescription,
      lastUpdated: new Date().toISOString()
    });
    setIsEditingDescription(false);
  };

  const handleSaveCoverLetter = () => {
    onUpdateApplication({
      ...application,
      coverLetter: draftCoverLetter,
      lastUpdated: new Date().toISOString()
    });
  };

  const handleRegenerateCoverLetter = () => {
    const fresh = generateHumanCoverLetter({
      jobTitle: application.jobTitle,
      company: application.company,
      description: draftDescription || application.jobDescription || '',
      platform: application.platform || ''
    });
    setDraftCoverLetter(fresh);
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(draftCoverLetter);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pt-[max(0.75rem,env(safe-area-inset-top))] bg-black/80 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-detail-modal-title"
    >
      <div
        className="relative w-full sm:max-w-3xl glass-panel rounded-t-3xl sm:rounded-3xl border border-zinc-600/60 shadow-2xl shadow-black/70 max-h-[calc(100dvh-env(safe-area-inset-top)-0.75rem)] sm:max-h-[90dvh] flex flex-col overflow-hidden bg-[#14161a]/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-zinc-800 flex-shrink-0">
          <div className="sm:hidden w-12 h-1 rounded-full bg-zinc-700 mx-auto mb-3" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/45">
                  <Globe2 className="w-3 h-3 text-yellow-400" />
                  <span>Platform: {application.platform || 'Direct'}</span>
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  <span>{application.location || '100% Remote'}</span>
                </span>
                {application.matchScore && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-yellow-300 border border-zinc-600 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span>{application.matchScore}% Match</span>
                  </span>
                )}
              </div>

              <h3
                id="job-detail-modal-title"
                className="text-lg sm:text-xl font-extrabold text-white leading-snug"
              >
                {application.jobTitle}
              </h3>

              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <div className="flex items-center space-x-1.5 text-xs sm:text-sm text-zinc-300 font-semibold">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  <span>{application.company}</span>
                </div>

                {/* Inline Stage Dropdown */}
                <select
                  value={application.status}
                  onChange={(e) => onStatusChange(application.id, e.target.value)}
                  className={`text-xs font-semibold py-1 px-2.5 rounded-lg border focus:outline-none cursor-pointer ${currentStage.badge}`}
                  aria-label="Change pipeline stage"
                >
                  {PIPELINE_STAGES.map(s => (
                    <option key={s.id} value={s.id} className="bg-zinc-900 text-zinc-200">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="mt-4 grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-700/80">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'details'
                  ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/45 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Job Details &amp; Description</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('coverLetter')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'coverLetter'
                  ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/45 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Cover Letter</span>
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {activeTab === 'details' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/30">
                  <div className="flex items-center space-x-1 text-[11px] text-zinc-400 font-semibold">
                    <Banknote className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Salary (PHP)</span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-extrabold text-yellow-300">
                    {application.salaryPhp
                      ? `${formatPhp(application.salaryPhp)} / mo`
                      : application.salaryDisplay || '—'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900/75 border border-zinc-800">
                  <div className="flex items-center space-x-1 text-[11px] text-zinc-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Applied Date</span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-bold text-zinc-100">
                    {application.dateApplied || '—'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900/75 border border-zinc-800">
                  <div className="flex items-center space-x-1 text-[11px] text-zinc-400 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Follow-Up</span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-bold text-amber-300">
                    {application.followUpDate || '—'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900/75 border border-zinc-800">
                  <div className="flex items-center space-x-1 text-[11px] text-zinc-400 font-semibold">
                    <FileText className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Resume Used</span>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-zinc-200 truncate" title={application.resumeUsed}>
                    {application.resumeUsed || 'Jesse_Aaron_Cuartero_Resume.pdf'}
                  </div>
                </div>
              </div>

              {/* Job Description Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/75 border border-zinc-700/70 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-yellow-300">
                    Job Description
                  </h4>
                  {!isEditingDescription && (
                    <button
                      type="button"
                      onClick={() => setIsEditingDescription(true)}
                      className="flex items-center space-x-1 text-xs font-semibold text-zinc-400 hover:text-yellow-300 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>{application.jobDescription ? 'Edit Description' : 'Paste Job Description'}</span>
                    </button>
                  )}
                </div>

                {isEditingDescription ? (
                  <div className="space-y-2.5">
                    <textarea
                      rows="8"
                      value={draftDescription}
                      onChange={(e) => setDraftDescription(e.target.value)}
                      placeholder="Paste or type the full job description here..."
                      className="w-full p-3.5 rounded-xl glass-input text-xs sm:text-sm leading-relaxed resize-y"
                    />
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDraftDescription(application.jobDescription || '');
                          setIsEditingDescription(false);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveDescription}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-950 bg-yellow-400 hover:bg-yellow-300"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Description</span>
                      </button>
                    </div>
                  </div>
                ) : application.jobDescription ? (
                  <div className="text-xs sm:text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
                    {application.jobDescription}
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-2 border border-dashed border-zinc-800 rounded-xl">
                    <p className="text-xs text-zinc-400">No job description saved for this listing yet.</p>
                    <button
                      type="button"
                      onClick={() => setIsEditingDescription(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-yellow-300 bg-yellow-400/15 border border-yellow-400/35 hover:bg-yellow-400/25"
                    >
                      Paste Job Description
                    </button>
                  </div>
                )}
              </div>

              {/* Notes Box */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                  Notes &amp; Application Context
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {application.notes || 'No personal notes added yet. Click "Edit Full Info" below to add interview notes or recruiter contacts.'}
                </p>
              </div>
            </>
          )}

          {activeTab === 'coverLetter' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Ready-to-Paste Cover Letter</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-200 border border-zinc-600">
                    Natural &amp; Non-Aggressive
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-medium">
                  {countWords(draftCoverLetter)} words
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Tailored to Jesse&apos;s real experience (Google Workspace, Apps Script, SOPs, Customer Ops &amp; QA) with a relaxed, human tone. Feel free to edit directly below before copying.
              </p>

              <textarea
                rows="11"
                value={draftCoverLetter}
                onChange={(e) => setDraftCoverLetter(e.target.value)}
                className="w-full p-4 rounded-2xl glass-input text-xs sm:text-sm leading-relaxed text-zinc-100 resize-y"
                aria-label="Editable cover letter"
              />

              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRegenerateCoverLetter}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Regenerate Draft</span>
                  </button>

                  {hasUnsavedCoverLetter && (
                    <button
                      type="button"
                      onClick={handleSaveCoverLetter}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-yellow-200 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/40 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Edits</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCopyCoverLetter}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-zinc-950 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:from-yellow-300 hover:to-amber-200 shadow-lg shadow-yellow-400/20 transition-all"
                >
                  {copiedCoverLetter ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Cover Letter</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-zinc-800 bg-[#101216]/95 flex flex-wrap items-center justify-between gap-2.5 safe-bottom flex-shrink-0">
          <div>
            {application.jobUrl ? (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-yellow-300 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/35 transition-all"
              >
                <span>Open Job Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-xs text-zinc-500">No job link attached</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditFull(application);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all"
            >
              <Pencil className="w-3.5 h-3.5 text-yellow-400" />
              <span>Edit Full Info</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(application.id)}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 bg-zinc-800 hover:bg-rose-500/20 border border-zinc-700 transition-all"
              title="Delete Application"
              aria-label="Delete application"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

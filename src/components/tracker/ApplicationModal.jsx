import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import { PIPELINE_STAGES } from '../../data/defaultApplications';
import { formatPhp } from '../../utils/currency';
import { generateHumanCoverLetter } from '../../utils/coverLetterGenerator';

export default function ApplicationModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = null, 
  defaultStage = 'applied',
  defaultPlatform = 'LinkedIn'
}) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    salaryPhp: 55000,
    salaryDisplay: '₱55,000 / mo',
    status: defaultStage,
    jobUrl: '',
    platform: defaultPlatform,
    dateApplied: new Date().toISOString().slice(0, 10),
    followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    resumeUsed: 'Jesse_Aaron_Cuartero_Resume.pdf',
    notes: '',
    jobDescription: '',
    coverLetter: '',
    location: '100% Remote'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        salaryPhp: initialData.salaryPhp || 55000,
        salaryDisplay: initialData.salaryDisplay || `${formatPhp(initialData.salaryPhp || 55000)} / mo`,
        jobDescription: initialData.jobDescription || '',
        coverLetter: initialData.coverLetter || ''
      });
    } else {
      setFormData({
        jobTitle: '',
        company: '',
        salaryPhp: 55000,
        salaryDisplay: '₱55,000 / mo',
        status: defaultStage,
        jobUrl: '',
        platform: defaultPlatform || 'LinkedIn',
        dateApplied: new Date().toISOString().slice(0, 10),
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        resumeUsed: 'Jesse_Aaron_Cuartero_Resume.pdf',
        notes: '',
        jobDescription: '',
        coverLetter: '',
        location: '100% Remote'
      });
    }
  }, [initialData, defaultStage, defaultPlatform, isOpen]);

  if (!isOpen) return null;

  const handleAutoGenerateCoverLetter = () => {
    const generated = generateHumanCoverLetter({
      jobTitle: formData.jobTitle || 'Operations Specialist',
      company: formData.company || 'Hiring',
      description: formData.jobDescription,
      platform: formData.platform
    });
    setFormData(prev => ({ ...prev, coverLetter: generated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.company) return;

    const finalCoverLetter =
      formData.coverLetter && formData.coverLetter.trim()
        ? formData.coverLetter
        : generateHumanCoverLetter({
            jobTitle: formData.jobTitle,
            company: formData.company,
            description: formData.jobDescription,
            platform: formData.platform
          });

    onSave({
      ...formData,
      coverLetter: finalCoverLetter,
      id: initialData ? initialData.id : `APP-${Date.now().toString().slice(-4)}`,
      lastUpdated: new Date().toISOString()
    });
    onClose();
  };

  const handleSalaryPreset = (amount) => {
    setFormData(prev => ({
      ...prev,
      salaryPhp: amount,
      salaryDisplay: `${formatPhp(amount)} / mo`
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pt-[max(0.75rem,env(safe-area-inset-top))] bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 border border-zinc-600/60 shadow-2xl shadow-black/70 max-h-[calc(100dvh-env(safe-area-inset-top)-0.75rem)] sm:max-h-[90dvh] overflow-y-auto safe-bottom bg-[#14161a]/95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-white">
              {initialData ? 'Edit Job Application' : 'Add New Job Application'}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Automatically syncs to your connected Google Sheet.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs sm:text-sm">
          
          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">
              Job Title <span className="text-yellow-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Remote Operations & Google Workspace Admin"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">
                Company Name <span className="text-yellow-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Remote Co."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Platform / Website</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Upwork">Upwork</option>
                <option value="OnlineJobs.ph">OnlineJobs.ph</option>
                <option value="JobStreet PH">JobStreet PH</option>
                <option value="RemoteOK">RemoteOK</option>
                <option value="Remotive">Remotive</option>
                <option value="Jobicy">Jobicy</option>
                <option value="Arbeitnow">Arbeitnow</option>
                <option value="WeWorkRemotely">WeWorkRemotely</option>
                <option value="Company Direct">Company Direct</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-zinc-300">
                Salary in PHP (Monthly Target)
              </label>
              <span className="text-yellow-400 font-bold">{formatPhp(formData.salaryPhp)} / mo</span>
            </div>

            <input
              type="number"
              step="1000"
              value={formData.salaryPhp}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 0;
                setFormData({
                  ...formData,
                  salaryPhp: val,
                  salaryDisplay: `${formatPhp(val)} / mo`
                });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input mb-2"
            />

            <div className="flex flex-wrap gap-1.5">
              {[45000, 50000, 55000, 60000, 65000, 70000].map(amount => (
                <button
                  type="button"
                  key={amount}
                  onClick={() => handleSalaryPreset(amount)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    formData.salaryPhp === amount
                      ? 'bg-yellow-400 text-zinc-950 font-bold'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {formatPhp(amount)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Pipeline Stage</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              >
                {PIPELINE_STAGES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Resume Attached</label>
              <input
                type="text"
                value={formData.resumeUsed}
                onChange={(e) => setFormData({ ...formData, resumeUsed: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">Job Posting URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.jobUrl}
              onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Date Applied</label>
              <input
                type="date"
                value={formData.dateApplied}
                onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Next Follow-Up</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">Job Description</label>
            <textarea
              rows="4"
              placeholder="Paste the full job description here so you can read it later inside the tracker modal..."
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input resize-y"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <label className="font-semibold text-zinc-300">Cover Letter (Ready to Paste)</label>
              <button
                type="button"
                onClick={handleAutoGenerateCoverLetter}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-300 border border-yellow-400/35 transition-all"
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>Auto-Generate Human Cover Letter</span>
              </button>
            </div>
            <textarea
              rows="5"
              placeholder="Leave blank to auto-generate a natural, warm cover letter on save, or click Auto-Generate above..."
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input resize-y"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">Notes &amp; Context</label>
            <textarea
              rows="2"
              placeholder="e.g. Highlighted Google Workspace automation experience."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl glass-input resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-zinc-950 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 hover:to-amber-200 shadow-lg shadow-yellow-400/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Save Changes' : 'Create Application'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

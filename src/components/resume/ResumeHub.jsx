import React, { useState, useEffect } from 'react';
import { resumeData } from '../../data/resumeData';
import { extractDriveFileId, getPrivateConfig, savePrivateConfig } from '../../services/profileConfigService';
import { 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  Mail,
  MapPin,
  Calculator,
  Lock,
  Pencil,
  Save
} from 'lucide-react';
import { calculateMatchScore } from '../../utils/matchScore';

export default function ResumeHub({ privateConfig: externalConfig, onSavePrivateConfig }) {
  const [localConfig, setLocalConfig] = useState(() => externalConfig || getPrivateConfig());
  const [isEditingPrivate, setIsEditingPrivate] = useState(false);
  const [draftPrivate, setDraftPrivate] = useState(() => externalConfig || getPrivateConfig());
  const [savedNotice, setSavedNotice] = useState(false);

  const [copiedKey, setCopiedKey] = useState(null);
  const [jobTextToTest, setJobTextToTest] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [showEmbeddedPdf, setShowEmbeddedPdf] = useState(false);

  useEffect(() => {
    if (externalConfig) {
      setLocalConfig(externalConfig);
      setDraftPrivate(externalConfig);
    }
  }, [externalConfig]);

  const activeConfig = externalConfig || localConfig;
  const driveFileId = extractDriveFileId(activeConfig.driveResumeUrl);

  const copyToClipboard = (text, key) => {
    if (!text) {
      setIsEditingPrivate(true);
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSavePrivate = (e) => {
    e.preventDefault();
    const updated = onSavePrivateConfig
      ? onSavePrivateConfig(draftPrivate)
      : savePrivateConfig(draftPrivate);
    setLocalConfig(updated);
    setIsEditingPrivate(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleTestMatch = (e) => {
    e.preventDefault();
    if (!jobTextToTest.trim()) return;
    const res = calculateMatchScore("Custom Job", jobTextToTest);
    setTestResult(res);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Profile Header Card in Graphite Gray, Brushed Silver & Yellow */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-zinc-700/70 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-yellow-400 via-zinc-200 to-zinc-500 p-[2px] shadow-xl shadow-yellow-400/15 flex-shrink-0">
              <div className="w-full h-full bg-[#111317] rounded-[14px] flex items-center justify-center font-extrabold text-2xl text-yellow-400">
                JC
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {resumeData.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-800 text-zinc-200 border border-zinc-600 inline-flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-yellow-400" />
                  <span>Privacy-Safe Local Profile</span>
                </span>
              </div>
              <p className="text-sm font-semibold text-yellow-400 mt-0.5">
                {resumeData.title}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-2">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{activeConfig.location || resumeData.location}</span>
                </span>
                {activeConfig.email && (
                  <>
                    <span>&bull;</span>
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{activeConfig.email}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {activeConfig.driveResumeUrl ? (
              <>
                <a
                  href={activeConfig.driveResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-zinc-950 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 hover:to-amber-200 shadow-lg shadow-yellow-400/20 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Resume on Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {driveFileId && (
                  <button
                    type="button"
                    onClick={() => setShowEmbeddedPdf(!showEmbeddedPdf)}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all"
                  >
                    <span>{showEmbeddedPdf ? 'Hide PDF Preview' : 'Show PDF Preview'}</span>
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingPrivate(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-zinc-950 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 hover:to-amber-200 shadow-lg shadow-yellow-400/20 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Link Your Google Drive Resume</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsEditingPrivate(!isEditingPrivate)}
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                isEditingPrivate
                  ? 'bg-yellow-400/20 text-yellow-200 border-yellow-400/45'
                  : 'bg-zinc-900/80 text-zinc-300 hover:text-white border-zinc-700'
              }`}
            >
              <Pencil className="w-3.5 h-3.5 text-yellow-400" />
              <span>{isEditingPrivate ? 'Close Private Settings' : 'Edit Private Contact & Drive Link'}</span>
            </button>
          </div>

        </div>

        {savedNotice && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-yellow-400/15 border border-yellow-400/35 text-xs font-semibold text-yellow-300 flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Private contact details and Google Drive resume link saved locally in this browser.</span>
          </div>
        )}

        {/* Private Settings Panel */}
        {isEditingPrivate && (
          <form onSubmit={handleSavePrivate} className="mt-6 pt-6 border-t border-zinc-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Lock className="w-4 h-4 text-yellow-400" />
                <span>Private Contact &amp; Google Drive Link (Browser-Only)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Stored strictly in your browser&apos;s localStorage so your personal details stay private on a public GitHub repo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={draftPrivate.email}
                  onChange={(e) => setDraftPrivate({ ...draftPrivate, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="09XX XXX XXXX"
                  value={draftPrivate.phone}
                  onChange={(e) => setDraftPrivate({ ...draftPrivate, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={draftPrivate.linkedin}
                  onChange={(e) => setDraftPrivate({ ...draftPrivate, linkedin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Display Location</label>
                <input
                  type="text"
                  placeholder="Philippines (Remote)"
                  value={draftPrivate.location}
                  onChange={(e) => setDraftPrivate({ ...draftPrivate, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-zinc-300 mb-1">Google Drive Resume Link</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  value={draftPrivate.driveResumeUrl}
                  onChange={(e) => setDraftPrivate({ ...draftPrivate, driveResumeUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditingPrivate(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Locally</span>
              </button>
            </div>
          </form>
        )}

        {/* Embedded PDF Viewer */}
        {showEmbeddedPdf && driveFileId && (
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-300">
                Google Drive Resume Document Preview
              </span>
              <a
                href={activeConfig.driveResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-yellow-400 hover:underline flex items-center space-x-1"
              >
                <span>Full screen on Google Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-950">
              <iframe
                src={`https://drive.google.com/file/d/${driveFileId}/preview`}
                className="w-full h-full border-0"
                title="Google Drive Resume Preview"
                allow="autoplay"
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid: Skills Breakdown & Application Copy Kit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-panel rounded-3xl p-6 border border-zinc-700/70">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Professional Summary</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {resumeData.professionalSummary}
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-zinc-700/70 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
              <span>Core Competencies &amp; Tools</span>
            </h3>

            <div>
              <span className="text-xs font-bold text-yellow-400">Technical &amp; Systems:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {resumeData.skills.technical.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-yellow-400/10 text-yellow-200 border border-yellow-400/25"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-zinc-300">Operations &amp; Procedures:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {resumeData.skills.operations.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-zinc-800/90 text-zinc-200 border border-zinc-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-zinc-700/70">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-yellow-400" />
              <span>Professional Experience</span>
            </h3>

            <div className="space-y-6">
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-zinc-700">
                  <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-yellow-400 ring-4 ring-yellow-400/20" />
                  
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {exp.role}
                    </h4>
                    <span className="text-xs font-semibold text-yellow-300 bg-yellow-400/15 px-2 py-0.5 rounded-md border border-yellow-400/25">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-zinc-300 mt-0.5">
                    {exp.company} &middot; <span className="text-zinc-400">{exp.location}</span>
                  </p>

                  <ul className="list-disc list-inside mt-2.5 space-y-1.5 text-xs text-zinc-300 leading-relaxed">
                    {exp.highlights.map((item, hIdx) => (
                      <li key={hIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-zinc-700/70">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-yellow-400" />
              <span>Education</span>
            </h3>
            <div className="text-xs sm:text-sm">
              <div className="font-bold text-white">{resumeData.education.degree}</div>
              <div className="text-yellow-400 font-semibold">{resumeData.education.school} ({resumeData.education.period})</div>
              <p className="text-zinc-400 text-xs mt-1">Coursework: {resumeData.education.coursework}</p>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          
          <div className="glass-panel rounded-3xl p-6 border border-zinc-700/70 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1-Click Application Kit
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              Click to quickly copy your info while filling out job applications. Private contact fields stay strictly in your browser.
            </p>

            {[
              { key: 'email', label: 'Email', value: activeConfig.email },
              { key: 'phone', label: 'Phone', value: activeConfig.phone },
              { key: 'linkedin', label: 'LinkedIn URL', value: activeConfig.linkedin },
              { key: 'driveUrl', label: 'Google Drive Resume Link', value: activeConfig.driveResumeUrl }
            ].map((field) => (
              <div
                key={field.key}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800"
              >
                <div className="truncate mr-2">
                  <span className="text-[10px] text-zinc-400 block font-semibold">{field.label}</span>
                  {field.value ? (
                    <span className="text-xs text-zinc-200 font-mono truncate block">
                      {field.value}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingPrivate(true)}
                      className="text-xs text-yellow-400 hover:underline font-medium"
                    >
                      Set in Private Contact &rarr;
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(field.value, field.key)}
                  className="p-2 rounded-lg bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-300 transition-all flex-shrink-0"
                  title={`Copy ${field.label}`}
                >
                  {copiedKey === field.key ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-semibold">Quick Intro / Elevator Pitch</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(resumeData.applicationKit.pitch, 'pitch')}
                  className="p-1.5 rounded-lg bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-300 transition-all"
                  title="Copy Pitch"
                >
                  {copiedKey === 'pitch' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-zinc-300 line-clamp-3 italic">
                &ldquo;{resumeData.applicationKit.pitch}&rdquo;
              </p>
            </div>

          </div>

          <div className="glass-panel rounded-3xl p-6 border border-zinc-700/70 space-y-4">
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Resume Match Calculator
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              Paste any job post description below to instantly check how well Jesse&apos;s resume matches.
            </p>

            <form onSubmit={handleTestMatch} className="space-y-3">
              <textarea
                rows="4"
                placeholder="Paste job description requirements here..."
                value={jobTextToTest}
                onChange={(e) => setJobTextToTest(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-xs resize-none"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs text-zinc-950 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 transition-all shadow-md"
              >
                Calculate Match Score
              </button>
            </form>

            {testResult && (
              <div className="p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">Calculated Match:</span>
                  <span className="text-lg font-black text-yellow-400">{testResult.score}%</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-zinc-300">Skills Detected:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {testResult.matchedSkills.map((s, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

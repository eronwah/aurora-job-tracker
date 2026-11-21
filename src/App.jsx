import React, { useState, useEffect, useRef } from 'react';
import BackgroundMesh from './components/layout/BackgroundMesh';
import Navbar from './components/layout/Navbar';
import MobileNav from './components/layout/MobileNav';
import TableView from './components/tracker/TableView';
import ApplicationModal from './components/tracker/ApplicationModal';
import JobDetailModal from './components/tracker/JobDetailModal';
import JobSearchEngine from './components/search/JobSearchEngine';
import ResumeHub from './components/resume/ResumeHub';
import GoogleSheetSync from './components/sheet/GoogleSheetSync';
import { 
  getStoredApplications, 
  saveStoredApplications, 
  syncToGoogleSheet,
  fetchFromGoogleSheet,
  clearAllApplications
} from './services/googleSheetService';
import { getPrivateConfig, savePrivateConfig } from './services/profileConfigService';
import { formatPhp } from './utils/currency';
import { generateHumanCoverLetter } from './utils/coverLetterGenerator';
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function App() {
  const [applications, setApplications] = useState([]);
  const [privateConfig, setPrivateConfig] = useState(() => getPrivateConfig());
  const [activeTab, setActiveTab] = useState('tracker'); // tracker | search | resume | sheet
  
  // Create/Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [defaultStageForNew, setDefaultStageForNew] = useState('applied');

  // Job Detail & Cover Letter Modal state
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [detailInitialTab, setDetailInitialTab] = useState('details'); // details | coverLetter

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Track whether applications state was mutated by user interaction (for debounced auto-push)
  const hasUserMutatedRef = useRef(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load applications on initial mount + auto-pull from Google Sheet if configured
  useEffect(() => {
    const loaded = getStoredApplications();
    setApplications(loaded);

    const cfg = getPrivateConfig();
    if (cfg.gasWebhookUrl) {
      setIsPulling(true);
      fetchFromGoogleSheet()
        .then((res) => {
          if (res.success && Array.isArray(res.applications)) {
            setApplications(res.applications);
            setSyncStatusMessage(res.message);
          } else if (res.message) {
            setSyncStatusMessage(res.message);
          }
        })
        .finally(() => setIsPulling(false));
    }
  }, []);

  // Debounced auto-push to Google Sheet after user mutations when webhook is configured
  useEffect(() => {
    if (!hasUserMutatedRef.current || !privateConfig.gasWebhookUrl) return;
    const timer = setTimeout(async () => {
      setIsSyncing(true);
      try {
        const res = await syncToGoogleSheet(applications);
        setSyncStatusMessage(res.message);
      } finally {
        setIsSyncing(false);
        hasUserMutatedRef.current = false;
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [applications, privateConfig.gasWebhookUrl]);

  // Save to localStorage whenever applications change via user actions
  const updateApplications = (newApps) => {
    hasUserMutatedRef.current = true;
    setApplications(newApps);
    saveStoredApplications(newApps);
  };

  const handleSavePrivateConfig = (partial) => {
    const next = savePrivateConfig(partial);
    setPrivateConfig(next);
    return next;
  };

  // Add or Edit Application
  const handleSaveApplication = (appData) => {
    if (editingApplication) {
      const updated = applications.map(a => a.id === appData.id ? appData : a);
      updateApplications(updated);
      showToast(`Updated "${appData.jobTitle}"`);
    } else {
      const updated = [appData, ...applications];
      updateApplications(updated);
      showToast(`Added "${appData.jobTitle}" to tracker`);
    }
    setEditingApplication(null);
  };

  // Update inline edits from JobDetailModal (Job Description / Cover Letter)
  const handleUpdateApplication = (updatedApp) => {
    const updated = applications.map(a => a.id === updatedApp.id ? updatedApp : a);
    updateApplications(updated);
    showToast(`Saved changes for "${updatedApp.jobTitle}"`);
  };

  // Delete Application
  const handleDeleteApplication = (id) => {
    const target = applications.find(a => a.id === id);
    if (window.confirm(`Are you sure you want to remove "${target?.jobTitle || 'this application'}"?`)) {
      const updated = applications.filter(a => a.id !== id);
      updateApplications(updated);
      if (selectedJobId === id) {
        setSelectedJobId(null);
      }
      showToast(`Removed application`);
    }
  };

  // Status Change (moving across pipeline)
  const handleStatusChange = (id, newStatus) => {
    const updated = applications.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return a;
    });
    updateApplications(updated);
    showToast(`Moved application to ${newStatus}`);
  };

  // Quick Add from Table Empty State
  const handleQuickAddStage = (stageId) => {
    setDefaultStageForNew(stageId);
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  // Open Job Detail & Cover Letter Modal
  const handleSelectJob = (app, tab = 'details') => {
    setSelectedJobId(app.id);
    setDetailInitialTab(tab);
  };

  // Add from Suggested Remote Jobs Search
  const handleAddFromSearch = (job) => {
    const coverLetter =
      job.coverLetter ||
      generateHumanCoverLetter({
        jobTitle: job.title,
        company: job.company,
        description: job.description || '',
        matchedSkills: job.matchedSkills || [],
        platform: job.platform || ''
      });

    const newApp = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      jobTitle: job.title,
      company: job.company,
      salaryPhp: job.salaryPhp || 55000,
      salaryDisplay: job.salaryDisplay || `${formatPhp(job.salaryPhp || 55000)} / mo`,
      status: 'saved',
      jobUrl: job.jobUrl || '',
      platform: job.platform || 'Remotive',
      dateApplied: new Date().toISOString().slice(0, 10),
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      resumeUsed: 'Jesse_Aaron_Cuartero_Resume.pdf',
      notes: `Suggested by Aurora Remote Search (Match Score: ${job.matchScore}%). Keywords: ${(job.matchedSkills || []).join(', ')}`,
      jobDescription: job.description || '',
      coverLetter,
      location: job.location || '100% Remote',
      matchScore: job.matchScore,
      lastUpdated: new Date().toISOString()
    };

    updateApplications([newApp, ...applications]);
    showToast(`Added "${job.title}" with description & cover letter!`);
  };

  // Clear All Applications Handler (e.g. removing sample data)
  const handleClearAll = () => {
    if (window.confirm('Clear all tracked applications (including sample data) and start fresh?')) {
      hasUserMutatedRef.current = true;
      setApplications(clearAllApplications());
      setSelectedJobId(null);
      showToast('Tracker cleared — ready for your real applications!');
    }
  };

  // Push / Sync Now Handler
  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatusMessage('Pushing applications to Google Sheet...');
    try {
      const res = await syncToGoogleSheet(applications);
      setSyncStatusMessage(res.message);
      showToast(res.message);
      if (!res.isConfigured) {
        setActiveTab('sheet');
      }
    } catch (err) {
      setSyncStatusMessage(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Pull from Google Sheet Handler
  const handlePullFromSheet = async () => {
    setIsPulling(true);
    setSyncStatusMessage('Pulling latest rows from Google Sheet...');
    try {
      const res = await fetchFromGoogleSheet();
      if (res.success && Array.isArray(res.applications)) {
        hasUserMutatedRef.current = false;
        setApplications(res.applications);
      }
      setSyncStatusMessage(res.message);
      showToast(res.message);
      if (!res.isConfigured) {
        setActiveTab('sheet');
      }
    } catch (err) {
      setSyncStatusMessage(`Pull failed: ${err.message}`);
    } finally {
      setIsPulling(false);
    }
  };

  // Pipeline Metric Calculations
  const totalApps = applications.length;
  const inProgressApps = applications.filter(a => ['applied', 'screening', 'interview'].includes(a.status)).length;
  const offersCount = applications.filter(a => a.status === 'offer').length;
  const totalPipelinePhp = applications
    .filter(a => a.status !== 'rejected')
    .reduce((sum, a) => sum + (a.salaryPhp || 0), 0);

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans pb-20 lg:pb-10">
      
      {/* Background Liquid Aurora Mesh */}
      <BackgroundMesh />

      {/* Sticky Aurora Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewModal={() => {
          setDefaultStageForNew('applied');
          setEditingApplication(null);
          setIsModalOpen(true);
        }}
        applications={applications}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing || isPulling}
        sheetUrl={privateConfig.sheetUrl}
        isWebhookConnected={Boolean(privateConfig.gasWebhookUrl)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
        
        {/* Top Metric Cards (Visible across all tabs for daily driver clarity) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Total Applications</span>
              <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-black text-white">{totalApps}</span>
              <span className="text-[11px] text-slate-400">active items</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">In Interview Pipeline</span>
              <span className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-black text-purple-300">{inProgressApps}</span>
              <span className="text-[11px] text-slate-400">in stages</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Offers Received</span>
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                <Award className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{offersCount}</span>
              <span className="text-[11px] text-emerald-300 font-medium">Offers</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 border border-teal-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Active Pipeline Volume</span>
              <span className="p-1.5 rounded-lg bg-teal-500/15 text-teal-300">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2">
              <span className="text-base sm:text-xl font-black text-emerald-400 truncate block">
                {formatPhp(totalPipelinePhp)}
              </span>
              <span className="text-[10px] text-slate-400">PHP / month potential</span>
            </div>
          </div>

        </div>

        {/* Pure Table Header (Only shown on Tracker tab) */}
        {activeTab === 'tracker' && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Application Pipeline
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Click any job row to view the full job description &amp; ready-to-paste cover letter</span>
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Tab Body */}
        <div>
          {activeTab === 'tracker' && (
            <TableView
              applications={applications}
              onEdit={(app) => {
                setEditingApplication(app);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteApplication}
              onStatusChange={handleStatusChange}
              onSelectJob={handleSelectJob}
              onQuickAdd={handleQuickAddStage}
              onClearAll={handleClearAll}
            />
          )}

          {activeTab === 'search' && (
            <JobSearchEngine
              onAddToTracker={handleAddFromSearch}
              existingApplications={applications}
            />
          )}

          {activeTab === 'resume' && (
            <ResumeHub
              privateConfig={privateConfig}
              onSavePrivateConfig={handleSavePrivateConfig}
            />
          )}

          {activeTab === 'sheet' && (
            <GoogleSheetSync
              applications={applications}
              onSyncNow={handleSyncNow}
              onPullFromSheet={handlePullFromSheet}
              isSyncing={isSyncing}
              isPulling={isPulling}
              syncStatusMessage={syncStatusMessage}
              privateConfig={privateConfig}
              onSavePrivateConfig={handleSavePrivateConfig}
            />
          )}
        </div>

      </main>

      {/* iPhone 17 Pro Max Safe-Area Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        applicationsCount={applications.length}
      />

      {/* Tabbed Job Details & Cover Letter Pop-up Modal */}
      <JobDetailModal
        application={applications.find(a => a.id === selectedJobId) || null}
        isOpen={Boolean(selectedJobId)}
        initialTab={detailInitialTab}
        onClose={() => setSelectedJobId(null)}
        onUpdateApplication={handleUpdateApplication}
        onEditFull={(app) => {
          setEditingApplication(app);
          setIsModalOpen(true);
        }}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteApplication}
      />

      {/* Application Create / Edit Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingApplication(null);
        }}
        onSave={handleSaveApplication}
        initialData={editingApplication}
        defaultStage={defaultStageForNew}
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-8 right-4 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-2xl glass-panel border border-emerald-500/40 text-xs font-bold text-emerald-300 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

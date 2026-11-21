import React, { useState, useEffect, useRef } from 'react';
import BackgroundMesh from './components/layout/BackgroundMesh';
import Navbar from './components/layout/Navbar';
import MobileNav from './components/layout/MobileNav';
import SplashScreen from './components/layout/SplashScreen';
import TableView from './components/tracker/TableView';
import ApplicationModal from './components/tracker/ApplicationModal';
import JobDetailModal from './components/tracker/JobDetailModal';
import JobSearchEngine from './components/search/JobSearchEngine';
import ResumeHub from './components/resume/ResumeHub';
import { 
  getStoredApplications, 
  saveStoredApplications, 
  syncToGoogleSheet,
  fetchFromGoogleSheet,
  clearAllApplications,
  exportToCsv
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
  FileText,
  Download
} from 'lucide-react';

export default function App() {
  const [applications, setApplications] = useState([]);
  const [privateConfig, setPrivateConfig] = useState(() => getPrivateConfig());
  const [activeTab, setActiveTab] = useState('tracker'); // tracker | search | resume
  const [showSplash, setShowSplash] = useState(true);
  
  // Create/Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [defaultStageForNew, setDefaultStageForNew] = useState('applied');

  // Job Detail & Cover Letter Modal state
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [detailInitialTab, setDetailInitialTab] = useState('details'); // details | coverLetter

  // Silent direct cloud sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const hasUserMutatedRef = useRef(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Load local applications immediately and silently pull from the connected Google Sheet
  useEffect(() => {
    const loaded = getStoredApplications();
    setApplications(loaded);

    const cfg = getPrivateConfig();
    if (cfg.gasWebhookUrl) {
      setIsSyncing(true);
      fetchFromGoogleSheet()
        .then((res) => {
          if (res.success && Array.isArray(res.applications)) {
            setApplications(res.applications);
          }
        })
        .finally(() => setIsSyncing(false));
    }
  }, []);

  // Debounced silent auto-push to Google Sheet after user changes
  useEffect(() => {
    if (!hasUserMutatedRef.current || !privateConfig.gasWebhookUrl) return;
    const timer = setTimeout(async () => {
      setIsSyncing(true);
      try {
        await syncToGoogleSheet(applications);
      } finally {
        setIsSyncing(false);
        hasUserMutatedRef.current = false;
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [applications, privateConfig.gasWebhookUrl]);

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

  const handleUpdateApplication = (updatedApp) => {
    const updated = applications.map(a => a.id === updatedApp.id ? updatedApp : a);
    updateApplications(updated);
    showToast(`Saved changes for "${updatedApp.jobTitle}"`);
  };

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

  const handleQuickAddStage = (stageId) => {
    setDefaultStageForNew(stageId);
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  const handleSelectJob = (app, tab = 'details') => {
    setSelectedJobId(app.id);
    setDetailInitialTab(tab);
  };

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
      platform: job.platform || 'RemoteOK',
      dateApplied: new Date().toISOString().slice(0, 10),
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      resumeUsed: 'Jesse_Aaron_Cuartero_Resume.pdf',
      notes: `Found on ${job.platform || 'Remote Board'} (Match Score: ${job.matchScore}%). Keywords: ${(job.matchedSkills || []).join(', ')}`,
      jobDescription: job.description || '',
      coverLetter,
      location: job.location || '100% Remote',
      matchScore: job.matchScore,
      lastUpdated: new Date().toISOString()
    };

    updateApplications([newApp, ...applications]);
    showToast(`Added "${job.title}" (${job.platform}) to tracker!`);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all tracked applications and start fresh?')) {
      hasUserMutatedRef.current = true;
      setApplications(clearAllApplications());
      setSelectedJobId(null);
      showToast('Tracker cleared — ready for new applications!');
    }
  };

  // Direct Sync Handler (Push current local changes to connected Google Sheet, then confirm)
  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      if (applications.length === 0) {
        const pullRes = await fetchFromGoogleSheet();
        if (pullRes.success && Array.isArray(pullRes.applications)) {
          hasUserMutatedRef.current = false;
          setApplications(pullRes.applications);
          showToast(pullRes.message);
        } else {
          showToast(pullRes.message);
        }
      } else {
        const pushRes = await syncToGoogleSheet(applications);
        showToast(pushRes.message);
      }
    } catch (err) {
      showToast(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
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
    <div className="relative min-h-[100dvh] w-full max-w-full overflow-x-hidden text-zinc-100 flex flex-col font-sans main-safe-bottom">
      
      {/* Startup Professional Loading Splash Screen */}
      {showSplash && <SplashScreen onFinished={() => setShowSplash(false)} />}

      {/* Background Graphite Gray, Silver & Yellow Mesh */}
      <BackgroundMesh />

      {/* Sticky Header */}
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
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 border border-zinc-700/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400">Total Applications</span>
              <span className="p-1.5 rounded-lg bg-zinc-800 text-yellow-400 border border-zinc-700">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-black text-white">{totalApps}</span>
              <span className="text-[11px] text-zinc-400">active items</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 border border-zinc-700/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400">In Interview Pipeline</span>
              <span className="p-1.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-black text-zinc-100">{inProgressApps}</span>
              <span className="text-[11px] text-zinc-400">in stages</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 border border-zinc-700/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400">Offers Received</span>
              <span className="p-1.5 rounded-lg bg-yellow-400/15 text-yellow-400 border border-yellow-400/35">
                <Award className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-black text-yellow-400">{offersCount}</span>
              <span className="text-[11px] text-yellow-300 font-medium">Offers</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-3.5 sm:p-4 border border-zinc-700/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400">Active Pipeline Volume</span>
              <span className="p-1.5 rounded-lg bg-zinc-800 text-yellow-400 border border-zinc-700">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2">
              <span className="text-base sm:text-xl font-black text-yellow-400 truncate block">
                {formatPhp(totalPipelinePhp)}
              </span>
              <span className="text-[10px] text-zinc-400">PHP / month potential</span>
            </div>
          </div>

        </div>

        {/* Pure Table Header & Overview Description (Only shown on Tracker tab) */}
        {activeTab === 'tracker' && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Application Pipeline
              </h2>
              <p className="text-xs text-zinc-400 font-medium mt-0.5 flex items-start sm:items-center space-x-1.5 leading-relaxed">
                <FileText className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  Track every remote application in PHP, tap any job row for its full description &amp; human cover letter, and stay synced automatically with Google Sheets.
                </span>
              </p>
            </div>

            {applications.length > 0 && (
              <button
                type="button"
                onClick={() => exportToCsv(applications)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-yellow-400" />
                <span>Export CSV</span>
              </button>
            )}
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
              onOpenSearch={() => setActiveTab('search')}
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
        </div>

      </main>

      {/* iPhone 17 Pro Max Safe-Area Bottom Navigation Bar (3 Clean Tabs) */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
        <div className="fixed bottom-20 lg:bottom-8 right-4 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-2xl glass-panel border border-yellow-400/45 text-xs font-bold text-yellow-300 shadow-2xl">
          <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

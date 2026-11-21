import React from 'react';
import { Briefcase, Search, FileText, FileSpreadsheet } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab, applicationsCount = 0 }) {
  const navItems = [
    { id: 'tracker', label: 'Tracker', icon: Briefcase, count: applicationsCount },
    { id: 'search', label: 'Remote Jobs', icon: Search, badge: 'Live' },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'sheet', label: 'Backend', icon: FileSpreadsheet },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-emerald-500/20 backdrop-blur-2xl bg-[#0d0718]/90 safe-bottom">
      <div className="grid grid-cols-4 h-16 items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center py-1 transition-all"
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 shadow-sm shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400 stroke-[2.2]' : ''}`} />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight font-medium ${
                  isActive ? 'text-emerald-300 font-bold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>

              {/* Badges */}
              {item.badge && (
                <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

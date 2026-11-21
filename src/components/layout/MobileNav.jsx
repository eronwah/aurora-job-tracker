import React from 'react';
import { Briefcase, Search, FileText } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'tracker', label: 'Tracker', icon: Briefcase },
    { id: 'search', label: 'Remote Jobs', icon: Search, badge: 'Live' },
    { id: 'resume', label: 'Resume', icon: FileText },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 w-full max-w-full overflow-hidden z-50 glass-panel border-t border-zinc-700/70 backdrop-blur-2xl bg-[#111317]/95 safe-bottom"
    >
      <div className="grid grid-cols-3 h-[62px] items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center py-1 transition-all"
            >
              <div
                className={`relative p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-yellow-400/15 text-yellow-300 border border-yellow-400/35 shadow-sm shadow-yellow-400/20'
                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-400 stroke-[2.2]' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight font-medium ${
                  isActive ? 'text-yellow-300 font-bold' : 'text-zinc-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

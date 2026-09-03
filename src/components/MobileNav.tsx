import React from 'react';
import { NavigationTab, useApp } from '../context/AppContext';
import { GradientBell } from './GradientBell';
import { GradientCamera } from './GradientCamera';
import { GradientHome } from './GradientHome';
import { GradientMapFold } from './GradientMapFold';
import { GradientUser } from './GradientUser';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsReportModalOpen, notifications } = useApp();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      id="mobile-bottom-navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb"
      style={{ paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom, 0.4rem))' }}
    >
      {/* Home */}
      <button
        id="mobile-nav-home"
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-2 rounded-2xl transition-all ${
          activeTab === 'home'
            ? 'text-cyan-700 bg-cyan-50/80 font-bold scale-105'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <GradientHome className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Home</span>
      </button>

      {/* Map */}
      <button
        id="mobile-nav-map"
        onClick={() => setActiveTab('map')}
        className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-2 rounded-2xl transition-all ${
          activeTab === 'map'
            ? 'text-cyan-700 bg-cyan-50/80 font-bold scale-105'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <GradientMapFold className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Map</span>
      </button>

      {/* Prominent Central Action Button */}
      <div className="relative -top-5">
        <button
          id="mobile-nav-report-action"
          onClick={() => setIsReportModalOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-400 to-emerald-400 p-0.5 shadow-xl shadow-cyan-500/30 flex items-center justify-center active:scale-90 hover:scale-105 transition-all ring-4 ring-white"
          title="Report an Issue (Take Photo)"
          aria-label="Report a new civic issue"
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <GradientCamera className="w-7 h-7" />
          </div>
        </button>
      </div>

      {/* Updates / Community Feed */}
      <button
        id="mobile-nav-feed"
        onClick={() => setActiveTab('feed')}
        className={`relative flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-2 rounded-2xl transition-all ${
          activeTab === 'feed'
            ? 'text-cyan-700 bg-cyan-50/80 font-bold scale-105'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <GradientBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white animate-pulse" />
        )}
        <span className="text-[10px] tracking-tight">Updates</span>
      </button>

      {/* Profile */}
      <button
        id="mobile-nav-profile"
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-2 rounded-2xl transition-all ${
          activeTab === 'profile'
            ? 'text-cyan-700 bg-cyan-50/80 font-bold scale-105'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <GradientUser className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Profile</span>
      </button>
    </div>
  );
};

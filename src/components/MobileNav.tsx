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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-xl safe-area-pb"
    >
      {/* Home */}
      <button
        id="mobile-nav-home"
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'home' ? 'text-cyan-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <GradientHome className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Map */}
      <button
        id="mobile-nav-map"
        onClick={() => setActiveTab('map')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'map' ? 'text-cyan-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <GradientMapFold className="w-5 h-5" />
        <span className="text-[10px]">Map</span>
      </button>

      {/* Prominent Central Action Button */}
      <div className="relative -top-5">
        <button
          id="mobile-nav-report-action"
          onClick={() => setIsReportModalOpen(true)}
          className="w-14 h-14 rounded-full bg-white border-2 border-slate-100 shadow-xl shadow-cyan-500/20 flex items-center justify-center active:scale-95 transition-transform hover:shadow-2xl ring-4 ring-cyan-500/10"
          title="Report an Issue (Take Photo)"
        >
          <GradientCamera className="w-7 h-7" />
        </button>
      </div>

      {/* Updates / Community Feed */}
      <button
        id="mobile-nav-feed"
        onClick={() => setActiveTab('feed')}
        className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'feed' ? 'text-cyan-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <GradientBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-pink-500" />
        )}
        <span className="text-[10px]">Updates</span>
      </button>

      {/* Profile */}
      <button
        id="mobile-nav-profile"
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'profile' ? 'text-cyan-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <GradientUser className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </button>
    </div>
  );
};

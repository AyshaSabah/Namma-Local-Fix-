import React, { useEffect, useState } from 'react';
import { AboutView } from './components/AboutView';
import { AdminDashboard } from './components/AdminDashboard';
import { CategoryFilterGrid } from './components/CategoryFilterGrid';
import { CleanCityDashboard } from './components/CleanCityDashboard';
import { CommunityFeed } from './components/CommunityFeed';
import { CommunityStats } from './components/CommunityStats';
import { ExploreMap } from './components/ExploreMap';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { HeroSection } from './components/HeroSection';
import { IssueDetailModal } from './components/IssueDetailModal';
import { LeaderboardView } from './components/LeaderboardView';
import { LoadingScreen } from './components/LoadingScreen';
import { Logo } from './components/Logo';
import { MobileNav } from './components/MobileNav';
import { Navbar } from './components/Navbar';
import { PointsDashboard } from './components/PointsDashboard';
import { ProfileView } from './components/ProfileView';
import { QuickImpactCards } from './components/QuickImpactCards';
import { ReportIssueModal } from './components/ReportIssueModal';
import { ToastContainer } from './components/ToastContainer';
import { AppProvider, useApp } from './context/AppContext';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsSearchOpen, setIsReportModalOpen } = useApp();
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // Keyboard shortcut: Cmd+K / Ctrl+K opens global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-800">
      {/* Branded Loading Splash Screen on App/Website Load */}
      {isInitialLoading && (
        <LoadingScreen onLoaded={() => setIsInitialLoading(false)} minDurationMs={1200} />
      )}

      {/* Top Navbar */}
      <Navbar />

      {/* Global Modals & Floating Toasts */}
      <ReportIssueModal />
      <IssueDetailModal />
      <GlobalSearchModal />
      <ToastContainer />

      {/* Main View Router */}
      <main className="flex-1 pb-24 lg:pb-12">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <HeroSection />
            <QuickImpactCards />
            <CategoryFilterGrid />
            <CommunityStats />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-6">
            <div className="mb-2 sm:mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 font-['Outfit']">
                  Bengaluru Live Civic Map
                </h1>
                <p className="hidden sm:block text-xs text-slate-600">
                  Explore reported civic hazards, active garbage spots, and resolved transformations across all wards.
                </p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 shadow-md shadow-cyan-500/20"
              >
                + Pin Issue
              </button>
            </div>
            <ExploreMap height="calc(100dvh - 10rem)" isCompact={false} />
          </div>
        )}

        {activeTab === 'cleancity' && <CleanCityDashboard />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'points' && <PointsDashboard />}
        {activeTab === 'feed' && <CommunityFeed />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'about' && <AboutView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <Logo size="sm" showTagline={false} onClick={() => setActiveTab('home')} />
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="font-medium text-slate-600">Namma Local Fix • Bengaluru, Karnataka, India</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 text-[11px] font-medium">
            <button onClick={() => setActiveTab('about')} className="hover:text-cyan-600 transition-colors">
              About & Mission
            </button>
            <button onClick={() => setActiveTab('cleancity')} className="hover:text-emerald-600 transition-colors">
              Clean City Squads
            </button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-purple-600 transition-colors">
              BBMP Portal
            </button>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">SEE → REPORT → VERIFY → FIX → EARN</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

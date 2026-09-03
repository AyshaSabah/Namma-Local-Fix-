import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Flame,
  Globe,
  MapPin,
  Plus,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import React from 'react';
import { useApp } from '../context/AppContext';
import { ExploreMap } from './ExploreMap';
import { GradientTrashBin } from './GradientTrashBin';

export const HeroSection: React.FC = () => {
  const {
    setActiveTab,
    setIsReportModalOpen,
    setSelectedCategory,
    stats,
    issues,
    setSelectedIssueId,
  } = useApp();

  const recentResolved = issues.find((i) => i.status === 'Resolved');
  const recentReported = issues.find((i) => i.status === 'Reported');

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16">
      {/* Ambient background glows for Light Mode */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-200/40 via-sky-200/30 to-emerald-200/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Mission Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-cyan-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-['Cairo_Play'] text-cyan-700 tracking-wide font-bold">Bengaluru Civic-Tech Platform</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-bold">BBMP & Citizen Squads</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-['Outfit']">
              Make Bengaluru Better,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 font-['Cairo_Play']">
                One Fix at a Time.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              See a problem? Report it. See waste? Help clean it. Together, we can make Bengaluru cleaner, safer and better.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-2">
              <button
                id="hero-report-btn"
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
              >
                <Plus className="w-5 h-5 text-slate-950 stroke-[3]" />
                <span>Report an Issue</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="hero-explore-map-btn"
                  onClick={() => setActiveTab('map')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-800 bg-white border border-slate-200 hover:border-cyan-400 hover:bg-slate-50 transition-all shadow-xs"
                >
                  <Compass className="w-4 h-4 text-cyan-600" />
                  <span>Explore Map</span>
                </button>

                <button
                  id="hero-cleancity-btn"
                  onClick={() => setActiveTab('cleancity')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all"
                >
                  <GradientTrashBin className="w-4 h-4" />
                  <span>Clean Squad</span>
                </button>
              </div>
            </div>

            {/* Live Bengaluru Feed Ticker */}
            <div className="pt-2">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    LIVE UPDATE
                  </span>
                  <p className="text-slate-700 font-medium truncate max-w-xs sm:max-w-sm">
                    {recentResolved ? (
                      <span>Resolved: {recentResolved.title} in {recentResolved.area}</span>
                    ) : (
                      <span>Citizen spot-fix active in Indiranagar</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('feed')}
                  className="text-cyan-700 hover:underline flex items-center gap-1 text-[11px] font-bold flex-shrink-0"
                >
                  View Feed <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Mini Bengaluru Map Card Preview */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-3 bg-white border border-slate-200/90 glass-card shadow-xl">
              {/* Header card badge */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Live Bengaluru Map
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="text-[11px] text-cyan-600 font-bold hover:underline"
                >
                  Open Fullscreen
                </button>
              </div>

              {/* Map embed */}
              <ExploreMap height="340px" isCompact={true} showControls={false} />

              {/* Quick stats bottom ribbon */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-base font-black text-slate-900 font-['Outfit']">
                    {stats.totalReports.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold">Reports</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-base font-black text-emerald-600 font-['Outfit']">
                    {stats.resolvedIssues.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold">Fixed</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-base font-black text-cyan-700 font-['Outfit']">
                    {stats.cleanupActions.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold">Cleanups</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

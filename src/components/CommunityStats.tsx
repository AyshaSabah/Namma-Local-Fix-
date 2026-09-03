import { CheckCircle2, Flame, HeartHandshake, Sparkles, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import { useApp } from '../context/AppContext';

export const CommunityStats: React.FC = () => {
  const { stats } = useApp();

  const resolutionRate = Math.round(
    (stats.resolvedIssues / Math.max(1, stats.totalReports)) * 100
  );

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xl relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Bengaluru Civic Impact Pulse
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
                Real citizens. Real fixes. Zero bureaucracy.
              </h3>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-500">Resolution Rate</p>
                <p className="text-lg font-black text-emerald-700 font-['Outfit']">{resolutionRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-emerald-500 flex items-center justify-center text-xs font-bold text-slate-800">
                {resolutionRate}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {/* Total Reports */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-700 text-xs font-bold">
                <Flame className="w-4 h-4" />
                <span>Reports Logged</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
                {stats.totalReports.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Across 198 BBMP Wards</p>
            </div>

            {/* Resolved Issues */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Issues Resolved</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-['Outfit']">
                {stats.resolvedIssues.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Verified by photo proof</p>
            </div>

            {/* Cleanup Actions */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-700 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Cleanup Actions</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-purple-700 font-['Outfit']">
                {stats.cleanupActions.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                ~{stats.totalWasteRemovedKg.toLocaleString()} kg waste cleared
              </p>
            </div>

            {/* Active Community Members */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
                <Users className="w-4 h-4" />
                <span>Active Citizens</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 font-['Outfit']">
                {stats.communityMembers.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Volunteering daily</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

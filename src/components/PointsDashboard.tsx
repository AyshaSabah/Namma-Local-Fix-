import {
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  Droplets,
  Flame,
  Gift,
  HelpCircle,
  Lock,
  Plus,
  Shield,
  Sparkles,
  Star,
  Trees,
  Users,
  Zap,
} from 'lucide-react';
import React from 'react';
import { useApp } from '../context/AppContext';

export const PointsDashboard: React.FC = () => {
  const { user, setIsReportModalOpen, setActiveTab } = useApp();

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return Sparkles;
      case 'Shield':
        return Shield;
      case 'Droplets':
        return Droplets;
      case 'Trees':
        return Trees;
      case 'Users':
        return Users;
      default:
        return Award;
    }
  };

  const getPointsHistoryIcon = (type: string) => {
    switch (type) {
      case 'cleanup':
        return Sparkles;
      case 'report':
        return Plus;
      case 'verify':
        return CheckCircle2;
      case 'support':
        return Users;
      default:
        return Coins;
    }
  };

  const currentLevel = user.level;
  const progressToNext = Math.min(
    100,
    Math.round(((user.points - (currentLevel - 1) * 300) / 400) * 100)
  );

  return (
    <div id="points-dashboard-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner with Gradient Level Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Namma Gamification Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit']">
              <span className="font-['Cairo_Play'] text-cyan-800">Namma Points</span> & Rewards
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl font-medium">
              Every action makes Bengaluru better. Earn points for reporting civic defects, joining cleanups, verifying before/after spot-fixes, and earning civic prestige.
            </p>

            {/* Level Progress */}
            <div className="pt-2 max-w-md space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-amber-900 font-bold">
                  Level {user.level}: {user.levelTitle}
                </span>
                <span className="text-slate-500 font-medium">
                  {user.pointsToNextLevel > 0
                    ? `${user.pointsToNextLevel} pts to next rank`
                    : 'Max Tier Achieved'}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(15, progressToNext)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Points Counter Box */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-amber-300 text-center space-y-2 shadow-lg backdrop-blur-xl">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
              Total Balance
            </span>
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-7 h-7 text-amber-500 fill-amber-500" />
              <span className="text-4xl sm:text-5xl font-black text-amber-800 font-['Outfit']">
                {user.points.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-amber-700 font-bold">Namma Points</p>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full mt-3 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:opacity-95 shadow-md shadow-amber-500/20"
            >
              + Earn More Points Now
            </button>
          </div>
        </div>
      </div>

      {/* How to Earn Rules Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
          How to Earn Namma Points
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { action: 'Report Civic Issue', pts: '+10 pts', desc: 'Pothole, streetlight, signal defect', color: 'border-cyan-200 bg-cyan-50 text-cyan-800' },
            { action: 'Report Garbage Dump', pts: '+15 pts', desc: 'Illegal debris, road garbage', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
            { action: 'Before & After Cleanup', pts: '+50 pts', desc: 'Spot-fix verified by AI', color: 'border-amber-200 bg-amber-50 text-amber-800' },
            { action: 'Support an Issue', pts: '+2 pts', desc: 'Upvote civic priority', color: 'border-purple-200 bg-purple-50 text-purple-800' },
            { action: 'Issue Resolved', pts: '+20 pts', desc: 'Confirmed resolution on ground', color: 'border-teal-200 bg-teal-50 text-teal-800' },
          ].map((rule, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${rule.color} space-y-1.5 flex flex-col justify-between shadow-xs`}
            >
              <div>
                <span className="text-base font-black font-['Outfit']">{rule.pts}</span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{rule.action}</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug font-medium">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Achievement Badges
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Unlock prestigious community titles as you transform Bengaluru.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            {user.badges.filter((b) => b.unlocked).length} / {user.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.badges.map((badge) => {
            const Icon = getBadgeIcon(badge.icon);
            return (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  badge.unlocked
                    ? 'bg-white border-amber-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                    badge.unlocked
                      ? 'bg-amber-100 border-amber-300 text-amber-800'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  {badge.unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] truncate">
                      {badge.name}
                    </h4>
                    {badge.unlocked && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        Earned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug font-medium">{badge.description}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    {badge.unlocked ? `Unlocked: ${badge.unlockedDate}` : 'Action required in city'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points History Timeline */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600" />
            <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">
              Points Activity History
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-medium">Live ledger</span>
        </div>

        <div className="divide-y divide-slate-100">
          {user.pointsHistory.map((item) => {
            const Icon = getPointsHistoryIcon(item.iconType);
            return (
              <div
                key={item.id}
                className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{item.action}</h5>
                    <span className="text-[10px] text-slate-500 font-medium">{item.timestamp}</span>
                  </div>
                </div>

                <span className="text-xs font-black text-amber-800 font-['Outfit']">
                  +{item.points} pts
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

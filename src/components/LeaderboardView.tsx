import {
  Award,
  Crown,
  Flame,
  Medal,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LEADERBOARD_USERS } from '../data/bengaluruData';

export const LeaderboardView: React.FC = () => {
  const { user, setActiveTab } = useApp();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all_time'>('monthly');

  // Insert current user into leaderboard list if not already present
  const allContributors = [...LEADERBOARD_USERS];

  const topThree = allContributors.slice(0, 3);
  const restContributors = allContributors.slice(3);

  return (
    <div id="leaderboard-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Bengaluru Civic Honor Roll</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit']">
          Bengaluru Community Champions
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Recognizing the citizens who actively report issues, clean neighborhood streets, and transform Namma Bengaluru.
        </p>

        {/* Timeframe Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-white border border-slate-200 shadow-xs mt-2">
          {[
            { id: 'weekly', label: 'This Week' },
            { id: 'monthly', label: 'This Month' },
            { id: 'all_time', label: 'All Time' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === tab.id
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 max-w-4xl mx-auto items-end">
        {/* 2nd Place (Silver) */}
        {topThree[1] && (
          <div className="order-2 md:order-1 p-5 rounded-3xl bg-white border border-slate-300 text-center space-y-3 relative shadow-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-200 text-slate-800 font-black text-xs border border-slate-300">
              #2 Silver
            </div>
            <img
              src={topThree[1].avatar}
              alt={topThree[1].name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-slate-200 shadow-md mt-2"
            />
            <div>
              <h4 className="text-base font-bold text-slate-900 font-['Outfit']">{topThree[1].name}</h4>
              <p className="text-xs text-slate-500 font-medium">{topThree[1].area}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="text-lg font-black text-slate-800 font-['Outfit']">
                {topThree[1].points.toLocaleString()} pts
              </p>
              <p className="text-[10px] text-cyan-700 font-bold">{topThree[1].levelTitle}</p>
            </div>
            <div className="flex justify-around text-[11px] text-slate-500 font-medium pt-1">
              <span>{topThree[1].reports} Reports</span>
              <span>{topThree[1].cleanups} Cleanups</span>
            </div>
          </div>
        )}

        {/* 1st Place (Gold Champion) */}
        {topThree[0] && (
          <div className="order-1 md:order-2 p-6 rounded-3xl bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 text-center space-y-3 relative shadow-xl md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-slate-950" /> #1 Champion
            </div>
            <img
              src={topThree[0].avatar}
              alt={topThree[0].name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-amber-300 shadow-lg mt-2"
            />
            <div>
              <h4 className="text-lg font-extrabold text-slate-900 font-['Outfit']">{topThree[0].name}</h4>
              <p className="text-xs text-amber-800 font-bold">{topThree[0].area}</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100/60 border border-amber-200 space-y-1">
              <p className="text-2xl font-black text-amber-800 font-['Outfit']">
                {topThree[0].points.toLocaleString()} pts
              </p>
              <p className="text-xs text-amber-900 font-bold">{topThree[0].levelTitle}</p>
            </div>
            <div className="flex justify-around text-xs text-slate-700 pt-1 font-semibold">
              <span>{topThree[0].reports} Reports</span>
              <span className="text-emerald-700">{topThree[0].cleanups} Cleanups</span>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {topThree[2] && (
          <div className="order-3 p-5 rounded-3xl bg-white border border-amber-200 text-center space-y-3 relative shadow-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-700 text-white font-black text-xs">
              #3 Bronze
            </div>
            <img
              src={topThree[2].avatar}
              alt={topThree[2].name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-amber-200 shadow-md mt-2"
            />
            <div>
              <h4 className="text-base font-bold text-slate-900 font-['Outfit']">{topThree[2].name}</h4>
              <p className="text-xs text-slate-500 font-medium">{topThree[2].area}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="text-lg font-black text-amber-800 font-['Outfit']">
                {topThree[2].points.toLocaleString()} pts
              </p>
              <p className="text-[10px] text-cyan-700 font-bold">{topThree[2].levelTitle}</p>
            </div>
            <div className="flex justify-around text-[11px] text-slate-500 font-medium pt-1">
              <span>{topThree[2].reports} Reports</span>
              <span>{topThree[2].cleanups} Cleanups</span>
            </div>
          </div>
        )}
      </div>

      {/* Your Current Rank Pin Ribbon */}
      <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-cyan-50 border border-cyan-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm">
            #{user.rank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-sm font-bold text-slate-900">{user.name} (You)</h5>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
                {user.levelTitle}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {user.area} • {user.issuesReported} Reports • {user.cleanupsJoined} Cleanups
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-black text-amber-800 font-['Outfit']">
              {user.points.toLocaleString()} pts
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              {user.pointsToNextLevel > 0 ? `${user.pointsToNextLevel} pts to next rank` : 'Max Level'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('points')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-90 shadow-xs"
          >
            My Points Hub
          </button>
        </div>
      </div>

      {/* Contributors Table */}
      <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">
            Top Bengaluru Contributors
          </h4>
          <span className="text-xs text-slate-500 font-medium">Updated hourly</span>
        </div>

        <div className="divide-y divide-slate-100">
          {restContributors.map((c, idx) => (
            <div
              key={c.id}
              className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-6 text-center font-mono font-bold text-slate-500 text-xs">
                  #{idx + 4}
                </span>
                <img
                  src={c.avatar}
                  alt={c.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-slate-900 truncate font-['Outfit']">{c.name}</h5>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {c.area} • {c.levelTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right flex-shrink-0">
                <div className="hidden sm:block text-slate-600 text-xs font-medium">
                  <span>{c.reports} reports</span>
                </div>
                <div className="hidden sm:block text-emerald-700 text-xs font-semibold">
                  <span>{c.cleanups} cleanups</span>
                </div>
                <div className="min-w-16">
                  <span className="text-xs font-black text-amber-800 font-['Outfit']">
                    {c.points.toLocaleString()} pts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

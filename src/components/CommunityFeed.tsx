import {
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  MessageSquare,
  Plus,
  Share2,
  Sparkles,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CommunityFeed: React.FC = () => {
  const { issues, supportIssue, setSelectedIssueId, user, setIsReportModalOpen } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'resolved' | 'reported' | 'cleanups'>('all');

  const feedItems = issues.filter((iss) => {
    if (filterType === 'resolved') return iss.status === 'Resolved';
    if (filterType === 'reported') return iss.status === 'Reported';
    if (filterType === 'cleanups') return iss.category === 'Garbage' || iss.category === 'Illegal Dumping';
    return true;
  });

  return (
    <div id="community-feed-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
            Live Civic Activity
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-0.5">
            Bengaluru Civic Feed
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time reports, verified cleanups, and community fixes happening right now.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post Report</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Activities' },
          { id: 'resolved', label: 'Resolved Transformations' },
          { id: 'reported', label: 'New Reports' },
          { id: 'cleanups', label: 'Cleanups & Waste' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed Cards */}
      <div className="space-y-4">
        {feedItems.map((item) => {
          const isSupported = item.supporters.includes(user.id);
          const isResolved = item.status === 'Resolved';

          return (
            <div
              key={item.id}
              id={`feed-card-${item.id}`}
              className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 hover:border-cyan-400 hover:shadow-md transition-all shadow-xs"
            >
              {/* Card User Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.reportedBy.avatar}
                    alt={item.reportedBy.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{item.reportedBy.name}</h4>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold">
                        {item.area}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Reported {item.reportedAt} • #{item.id}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    isResolved
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : item.status === 'In Progress'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Text & Photos */}
              <div className="space-y-2">
                <h3
                  onClick={() => setSelectedIssueId(item.id)}
                  className="text-base font-bold text-slate-900 font-['Outfit'] cursor-pointer hover:text-cyan-700 transition-colors"
                >
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.description}</p>
              </div>

              {/* Image Preview */}
              <div
                onClick={() => setSelectedIssueId(item.id)}
                className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-72 cursor-pointer group"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white">
                  {item.streetAddress}
                </div>
              </div>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => supportIssue(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                      isSupported
                        ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                        : 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Support ({item.supportersCount})</span>
                  </button>

                  <button
                    onClick={() => setSelectedIssueId(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 font-medium"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Comments ({item.comments.length})</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedIssueId(item.id)}
                  className="text-xs font-bold text-cyan-700 hover:underline"
                >
                  View Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

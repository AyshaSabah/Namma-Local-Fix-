import {
  AlertCircle,
  Award,
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  Layers,
  MapPin,
  MessageSquare,
  Send,
  Share2,
  Shield,
  Sparkles,
  ThumbsUp,
  User,
  X,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const IssueDetailModal: React.FC = () => {
  const {
    selectedIssueId,
    setSelectedIssueId,
    issues,
    supportIssue,
    toggleBookmark,
    addComment,
    user,
    addToast,
  } = useApp();

  const [commentText, setCommentText] = useState('');

  if (!selectedIssueId) return null;

  const issue = issues.find((i) => i.id === selectedIssueId);
  if (!issue) return null;

  const isSupported = issue.supporters.includes(user.id);
  const isBookmarked = user.savedIssueIds.includes(issue.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out this civic issue on Namma Local Fix (#${issue.id}): ${issue.title} in ${issue.area}`
      );
      addToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Issue link copied to clipboard. Share with your neighborhood group!',
      });
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(issue.id, commentText);
    setCommentText('');
  };

  const statusSteps = ['Reported', 'Verified', 'In Progress', 'Resolved'];
  const currentStepIndex = statusSteps.indexOf(issue.status);

  return (
    <div
      id="issue-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="issue-detail-modal-card"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Top Nav Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-cyan-800 bg-cyan-100 px-2.5 py-1 rounded-lg border border-cyan-200">
              #{issue.id}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700">
              {issue.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Share Issue"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleBookmark(issue.id)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Bookmark Issue"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-cyan-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
            <button
              id="close-issue-detail-btn"
              onClick={() => setSelectedIssueId(null)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Main Photo or Before/After Comparison */}
          {issue.resolvedBeforeAfter ? (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Resolution Proof (Before vs After)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-44">
                  <img
                    src={issue.resolvedBeforeAfter.beforeUrl}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-bold text-rose-300">
                    BEFORE
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-emerald-300 h-44">
                  <img
                    src={issue.resolvedBeforeAfter.afterUrl}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-emerald-100 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    AFTER (RESOLVED)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-64 sm:h-80 bg-slate-100">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md ${
                    issue.severity === 'Critical'
                      ? 'bg-rose-500 text-white'
                      : issue.severity === 'High'
                      ? 'bg-orange-500 text-white'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  {issue.severity} Severity
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-slate-800 border border-slate-200 shadow-md backdrop-blur-md">
                  {issue.status}
                </span>
              </div>
            </div>
          )}

          {/* Issue Title & Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              {issue.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <MapPin className="w-4 h-4" />
                <span>{issue.area} • {issue.streetAddress}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Reported {issue.reportedAt}</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-1 font-medium">
              {issue.description}
            </p>
          </div>

          {/* Status Progress Lifecycle Timeline */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Resolution Lifecycle
            </span>
            <div className="flex items-center justify-between relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />

              {statusSteps.map((s, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={s} className="relative z-10 flex flex-col items-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 ring-4 ring-cyan-500/20'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-semibold whitespace-nowrap ${
                        isCurrent ? 'text-cyan-700 font-bold' : isPassed ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>

            {issue.resolvedAt && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between mt-2 font-medium">
                <span>{issue.resolvedByText || 'Resolved on ground'}</span>
                <span className="font-mono text-[10px]">{issue.resolvedAt}</span>
              </div>
            )}
          </div>

          {/* AI Inspection Box & Assigned Authority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* AI Box */}
            {issue.aiDetection && (
              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> AI Analysis
                  </span>
                  <span className="text-[10px] font-bold text-cyan-700 font-mono">
                    {issue.aiDetection.confidence}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-snug font-medium">
                  "{issue.aiDetection.explanation}"
                </p>
                {issue.aiDetection.suggestedAction && (
                  <p className="text-[11px] text-cyan-800 font-bold">
                    Action: {issue.aiDetection.suggestedAction}
                  </p>
                )}
              </div>
            )}

            {/* Authority Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-600" /> Municipal Jurisdiction
              </span>
              <p className="text-xs font-bold text-slate-900">
                {issue.assignedAuthority || 'BBMP Ward Control Unit'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Estimated turnaround: {issue.estimatedResolutionDays || 3} business days
              </p>
            </div>
          </div>

          {/* Reporter Profile & Support Action CTA */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={issue.reportedBy.avatar}
                alt={issue.reportedBy.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/20"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{issue.reportedBy.name}</h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  @{issue.reportedBy.username} • Verified Citizen
                </p>
              </div>
            </div>

            <button
              id={`support-issue-btn-${issue.id}`}
              onClick={() => supportIssue(issue.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                isSupported
                  ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                  : 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:opacity-95'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>
                {isSupported ? 'Supported' : 'Support Issue'} ({issue.supportersCount})
              </span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-600" />
                Community Updates & Discussion ({issue.comments.length})
              </h4>
            </div>

            <div className="space-y-2.5">
              {issue.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No comments yet. Add the first update.
                </p>
              ) : (
                issue.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-xl border ${
                      comment.isOfficial
                        ? 'bg-purple-50 border-purple-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-900">
                          {comment.userName}
                        </span>
                        {comment.isOfficial && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-purple-100 text-purple-800 font-bold rounded-full border border-purple-200">
                            Official Response
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono font-medium">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed pl-8 font-medium">
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleSendComment} className="flex gap-2 pt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Post a civic update or status remark..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

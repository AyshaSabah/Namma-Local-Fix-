import {
  ArrowUpRight,
  Award,
  Bookmark,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  Edit3,
  Flame,
  HelpCircle,
  Image,
  Layers,
  MapPin,
  Medal,
  Plus,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  User,
  X,
} from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { LEADERBOARD_USERS } from '../data/bengaluruData';
import { GradientStar } from './GradientStar';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
];

export const ProfileView: React.FC = () => {
  const { user, updateUserProfile, issues, cleanupDrives, setSelectedIssueId, setIsReportModalOpen, setActiveTab } = useApp();
  const [profileTab, setProfileTab] = useState<'reports' | 'saved' | 'cleanups' | 'badges'>('reports');

  // Scoreboard Modal State
  const [isScoreboardOpen, setIsScoreboardOpen] = useState<boolean>(false);
  const [scoreboardTimeframe, setScoreboardTimeframe] = useState<'weekly' | 'monthly' | 'all_time'>('monthly');
  const [scoreboardSearch, setScoreboardSearch] = useState<string>('');
  const [selectedScoreboardWard, setSelectedScoreboardWard] = useState<string>('all');
  const [showHowPointsWork, setShowHowPointsWork] = useState<boolean>(false);

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(user.name);
  const [editUsername, setEditUsername] = useState<string>(user.username.replace(/^@/, ''));
  const [editAvatar, setEditAvatar] = useState<string>(user.avatar);
  const [editBio, setEditBio] = useState<string>(user.bio || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEditModal = () => {
    setEditName(user.name);
    setEditUsername(user.username.replace(/^@/, ''));
    setEditAvatar(user.avatar);
    setEditBio(user.bio || '');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    updateUserProfile({
      name: editName.trim(),
      username: editUsername.trim().startsWith('@') ? editUsername.trim() : `@${editUsername.trim()}`,
      avatar: editAvatar.trim() || user.avatar,
      bio: editBio.trim(),
    });

    setIsEditingProfile(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const myReportedIssues = issues.filter((i) => i.reportedBy.id === user.id);
  const mySavedIssues = issues.filter((i) => user.savedIssueIds.includes(i.id));
  const myJoinedDrives = cleanupDrives.filter((d) => d.joinedUserIds.includes(user.id));

  // Extract all unique wards for filtering
  const wardsList = useMemo(() => {
    const set = new Set<string>();
    LEADERBOARD_USERS.forEach((u) => {
      if (u.area) set.add(u.area);
    });
    if (user.area) set.add(user.area);
    return ['all', ...Array.from(set)];
  }, [user.area]);

  // Compute live scoreboard users including the current user's live points
  const scoreboardUsers = useMemo(() => {
    const currentUserItem = {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      points: user.points,
      level: user.level,
      levelTitle: user.levelTitle,
      area: user.area || 'Koramangala',
      reports: user.issuesReported,
      cleanups: user.cleanupsJoined,
      isCurrentUser: true,
    };

    let list = LEADERBOARD_USERS.map((u) => ({
      ...u,
      isCurrentUser: u.id === user.id || u.username === user.username,
    }));

    if (!list.some((u) => u.isCurrentUser)) {
      list.push(currentUserItem);
    } else {
      list = list.map((u) =>
        u.isCurrentUser
          ? {
              ...u,
              name: user.name,
              avatar: user.avatar,
              points: user.points,
              reports: user.issuesReported,
              cleanups: user.cleanupsJoined,
              levelTitle: user.levelTitle,
            }
          : u
      );
    }

    // Adapt points based on timeframe tab
    const multiplier = scoreboardTimeframe === 'weekly' ? 0.35 : scoreboardTimeframe === 'monthly' ? 1 : 2.4;
    const formattedList = list.map((u) => ({
      ...u,
      displayPoints: Math.round(u.points * multiplier),
    }));

    formattedList.sort((a, b) => b.displayPoints - a.displayPoints);

    return formattedList.filter((u) => {
      const matchesSearch =
        scoreboardSearch === '' ||
        u.name.toLowerCase().includes(scoreboardSearch.toLowerCase()) ||
        u.username.toLowerCase().includes(scoreboardSearch.toLowerCase()) ||
        u.area.toLowerCase().includes(scoreboardSearch.toLowerCase());

      const matchesWard = selectedScoreboardWard === 'all' || u.area === selectedScoreboardWard;

      return matchesSearch && matchesWard;
    });
  }, [user, scoreboardTimeframe, scoreboardSearch, selectedScoreboardWard]);

  return (
    <div id="profile-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Profile Identity Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Avatar with Clickable Change Icon */}
            <div className="relative group cursor-pointer" onClick={openEditModal} title="Change Profile Picture">
              <img
                id="profile-user-img"
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-cyan-500/20 shadow-md transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-3xl bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                <Camera className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-cyan-500 text-white shadow-sm ring-2 ring-white">
                <Camera className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* User Name & Details */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 id="profile-user-name" className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                  {user.name}
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold border border-cyan-200">
                  {user.levelTitle}
                </span>
                <button
                  id="edit-profile-btn"
                  onClick={openEditModal}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 border border-slate-200 transition-colors"
                  title="Edit Name & Profile Picture"
                >
                  <Edit3 className="w-3 h-3 text-cyan-600" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 font-medium">@{user.username.replace(/^@/, '')}</p>
              {user.bio && (
                <p className="text-xs text-slate-600 mt-1 max-w-md font-medium">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Points & Scoreboard Trigger Card */}
          <div
            id="profile-scoreboard-card"
            role="button"
            tabIndex={0}
            onClick={() => setIsScoreboardOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsScoreboardOpen(true);
              }
            }}
            aria-label="Open Bengaluru People's Scoreboard & City Rankings"
            title="Click to view people's scoreboard, city rankings & ward leaders"
            className="cursor-pointer group relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-100/70 border-2 border-amber-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/15 active:scale-[0.98] transition-all duration-200 text-center sm:text-right space-y-1.5 w-full sm:w-auto flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500/50 select-none"
          >
            {/* Ambient hover light */}
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none group-hover:bg-amber-400/35 transition-colors" />

            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-amber-700">
              <GradientStar className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-2xl sm:text-3xl font-black font-['Outfit'] text-amber-900 tracking-tight">
                {user.points.toLocaleString()}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 font-bold">Total Namma Points</p>

            <div className="flex items-center justify-center sm:justify-end gap-1.5 pt-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-[10px] font-bold border border-cyan-200 shadow-xs">
                <Trophy className="w-3 h-3 text-amber-600 shrink-0" />
                Bengaluru Rank #{user.rank}
              </span>
            </div>

            {/* Click to View Scoreboard CTA pill */}
            <div className="pt-1 flex items-center justify-center sm:justify-end">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-amber-900 group-hover:text-amber-950 transition-all bg-amber-200/70 group-hover:bg-amber-300/90 px-3 py-1 rounded-full border border-amber-400/70 shadow-xs">
                <Trophy className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-6 transition-transform" />
                <span>View People's Scoreboard</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>

        {/* Lifetime Activity Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-lg font-black text-slate-900 font-['Outfit']">{user.issuesReported}</p>
            <p className="text-[10px] text-slate-500 font-bold">Issues Reported</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-lg font-black text-emerald-700 font-['Outfit']">{user.cleanupsJoined}</p>
            <p className="text-[10px] text-slate-500 font-bold">Cleanups Completed</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-lg font-black text-purple-700 font-['Outfit']">{user.trashReports}</p>
            <p className="text-[10px] text-slate-500 font-bold">Trash Dumps Cleared</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-lg font-black text-amber-800 font-['Outfit']">
              {user.badges.filter((b) => b.unlocked).length}
            </p>
            <p className="text-[10px] text-slate-500 font-bold">Badges Earned</p>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            id="edit-profile-modal"
            className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Edit Profile</h3>
                  <p className="text-xs text-slate-500 font-medium">Update your name and profile picture</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Profile Picture Upload & Preview */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={editAvatar}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500 shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 hover:bg-cyan-100 text-xs font-bold border border-cyan-200 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={editAvatar.startsWith('data:') ? '' : editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Avatar Presets */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    Or pick an avatar preset:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatar(preset)}
                        className={`relative rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                          editAvatar === preset
                            ? 'ring-2 ring-cyan-600 scale-105'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset}
                          alt={`Preset ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label htmlFor="edit-name-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="edit-name-input"
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold text-slate-900"
                />
              </div>

              {/* Username Input */}
              <div className="space-y-1.5">
                <label htmlFor="edit-username-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">@</span>
                  <input
                    id="edit-username-input"
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.replace(/^@/, ''))}
                    placeholder="username"
                    className="w-full pl-8 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Bio Textarea */}
              <div className="space-y-1.5">
                <label htmlFor="edit-bio-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Bio
                </label>
                <textarea
                  id="edit-bio-input"
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell Bengaluru about your civic efforts..."
                  className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="save-profile-btn"
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:opacity-90 transition-opacity shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: 'reports', label: `My Reports (${myReportedIssues.length})` },
          { id: 'saved', label: `Bookmarked (${mySavedIssues.length})` },
          { id: 'cleanups', label: `My Cleanups (${myJoinedDrives.length})` },
          { id: 'badges', label: 'Badges & Achievements' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setProfileTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              profileTab === tab.id
                ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: MY REPORTS */}
      {profileTab === 'reports' && (
        <div className="space-y-4">
          {myReportedIssues.length === 0 ? (
            <div className="text-center py-10 rounded-2xl bg-white border border-slate-200 space-y-3">
              <p className="text-sm text-slate-600 font-medium">You haven't reported any issues yet.</p>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400"
              >
                + Report an Issue Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myReportedIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssueId(issue.id)}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 cursor-pointer transition-all space-y-3 group shadow-xs hover:shadow-md"
                >
                  <div className="relative rounded-xl overflow-hidden h-36">
                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 text-[10px] font-bold text-cyan-800 border border-slate-200 shadow-xs">
                      {issue.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] line-clamp-1 group-hover:text-cyan-700">
                      {issue.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-1">{issue.area} • #{issue.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SAVED */}
      {profileTab === 'saved' && (
        <div className="space-y-4">
          {mySavedIssues.length === 0 ? (
            <div className="text-center py-10 rounded-2xl bg-white border border-slate-200 text-slate-500 font-medium">
              No saved issues yet. Click the bookmark icon on any issue to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mySavedIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssueId(issue.id)}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 cursor-pointer transition-all space-y-2 group shadow-xs"
                >
                  <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] group-hover:text-cyan-700">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">{issue.area} • {issue.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: CLEANUPS */}
      {profileTab === 'cleanups' && (
        <div className="space-y-4">
          {myJoinedDrives.length === 0 ? (
            <div className="text-center py-10 rounded-2xl bg-white border border-slate-200 text-slate-500 font-medium">
              You haven't joined any cleanup drives yet. Check the Clean City tab to participate!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myJoinedDrives.map((drive) => (
                <div
                  key={drive.id}
                  className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2 shadow-xs"
                >
                  <span className="text-[10px] font-bold uppercase text-emerald-700">
                    Registered Volunteer
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">{drive.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{drive.location} • {drive.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: BADGES */}
      {profileTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border ${
                badge.unlocked
                  ? 'bg-white border-amber-300 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">{badge.name}</h4>
                {badge.unlocked && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Unlocked
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">{badge.description}</p>
              {badge.unlockedDate && (
                <p className="text-[10px] text-slate-400 mt-1 font-mono">Date: {badge.unlockedDate}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PEOPLE'S SCOREBOARD MODAL */}
      {isScoreboardOpen && (
        <div
          id="scoreboard-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsScoreboardOpen(false);
          }}
        >
          <div
            id="peoples-scoreboard-modal"
            className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50/80 via-cyan-50/50 to-emerald-50/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shadow-xs">
                  <Trophy className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
                      Bengaluru People's Scoreboard
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Citywide citizen rankings, verified points & ward impact
                  </p>
                </div>
              </div>

              <button
                id="close-scoreboard-modal-btn"
                onClick={() => setIsScoreboardOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-xs shrink-0"
                aria-label="Close scoreboard"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Controls: Timeframe, Search, and Ward Filters */}
            <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3 bg-slate-50/50">
              {/* User Standing Strip */}
              <div className="p-3 rounded-2xl bg-white border border-amber-200/80 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1 rounded-full bg-cyan-600 text-white text-[9px] font-black">
                      YOU
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 font-['Outfit']">{user.name}</p>
                      <span className="text-[10px] text-slate-500">({user.area || 'Koramangala'})</span>
                    </div>
                    <p className="text-[11px] text-cyan-700 font-semibold">
                      Rank #{user.rank} • {user.levelTitle}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-amber-800 font-black text-sm sm:text-base font-['Outfit']">
                    <GradientStar className="w-4 h-4" />
                    <span>{user.points.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">Namma Points</span>
                </div>
              </div>

              {/* Timeframe selector + Search input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* Timeframe pills */}
                <div className="inline-flex items-center p-1 rounded-xl bg-white border border-slate-200 shadow-xs">
                  {[
                    { id: 'weekly', label: 'This Week' },
                    { id: 'monthly', label: 'This Month' },
                    { id: 'all_time', label: 'All Time' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setScoreboardTimeframe(tab.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        scoreboardTimeframe === tab.id
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={scoreboardSearch}
                    onChange={(e) => setScoreboardSearch(e.target.value)}
                    placeholder="Search citizens or ward..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                  {scoreboardSearch && (
                    <button
                      onClick={() => setScoreboardSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Ward filter chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 pr-1 shrink-0">
                  <MapPin className="w-3 h-3 text-cyan-600" /> Wards:
                </span>
                {wardsList.map((ward) => (
                  <button
                    key={ward}
                    onClick={() => setSelectedScoreboardWard(ward)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors shrink-0 ${
                      selectedScoreboardWard === ward
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {ward === 'all' ? 'All Bengaluru' : ward}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Scoreboard List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 divide-y divide-slate-100">
              {scoreboardUsers.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No contributors found matching "{scoreboardSearch}". Try searching another name or ward.
                </div>
              ) : (
                scoreboardUsers.map((person, idx) => {
                  const rank = idx + 1;
                  const isTop1 = rank === 1;
                  const isTop2 = rank === 2;
                  const isTop3 = rank === 3;

                  return (
                    <div
                      key={person.id || person.username}
                      className={`pt-2.5 first:pt-0 flex items-center justify-between gap-3 p-2 rounded-2xl transition-colors ${
                        person.isCurrentUser
                          ? 'bg-cyan-50/70 border border-cyan-300/80 shadow-xs'
                          : isTop1
                          ? 'bg-amber-50/40'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Left: Rank badge, Avatar, Name & Ward */}
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        {/* Rank Badge */}
                        <div className="w-8 flex items-center justify-center shrink-0">
                          {isTop1 && (
                            <div className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs ring-2 ring-amber-200">
                              <Crown className="w-4 h-4" />
                            </div>
                          )}
                          {isTop2 && (
                            <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center shadow-xs ring-2 ring-slate-300">
                              #2
                            </div>
                          )}
                          {isTop3 && (
                            <div className="w-7 h-7 rounded-xl bg-amber-700 text-amber-50 font-black text-xs flex items-center justify-center shadow-xs ring-2 ring-amber-600">
                              #3
                            </div>
                          )}
                          {!isTop1 && !isTop2 && !isTop3 && (
                            <span className="text-xs font-bold text-slate-400 font-mono">
                              #{rank}
                            </span>
                          )}
                        </div>

                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <img
                            src={person.avatar}
                            alt={person.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                          />
                          {isTop1 && (
                            <span className="absolute -top-1 -right-1 text-xs">👑</span>
                          )}
                        </div>

                        {/* Name & Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 font-['Outfit'] truncate">
                              {person.name}
                            </span>
                            {person.isCurrentUser && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-600 text-white font-black">
                                YOU
                              </span>
                            )}
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-medium">
                              {person.area}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-0.5">
                            <span className="text-cyan-700 font-semibold">{person.levelTitle}</span>
                            <span>•</span>
                            <span>{person.reports} reports</span>
                            <span>•</span>
                            <span>{person.cleanups} cleanups</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Points */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center justify-end gap-1 text-amber-900 font-black text-xs sm:text-sm font-['Outfit']">
                          <GradientStar className="w-3.5 h-3.5" />
                          <span>{person.displayPoints.toLocaleString()}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase">points</span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* How points work accordion */}
              <div className="pt-4 mt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowHowPointsWork(!showHowPointsWork)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-left hover:bg-amber-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>How to score points & climb the scoreboard</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-amber-700 transition-transform ${
                      showHowPointsWork ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {showHowPointsWork && (
                  <div className="mt-2.5 p-3.5 rounded-2xl bg-white border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 font-black text-[10px] flex items-center justify-center shrink-0">
                        +10
                      </span>
                      <span>Report civic issue or road pothole</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center shrink-0">
                        +30
                      </span>
                      <span>Complete a neighborhood cleanup drive</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-black text-[10px] flex items-center justify-center shrink-0">
                        +15
                      </span>
                      <span>Upload verified before/after photo proof</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black text-[10px] flex items-center justify-center shrink-0">
                        +2
                      </span>
                      <span>Upvote and verify neighborhood issues</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                id="open-full-leaderboard-btn"
                onClick={() => {
                  setIsScoreboardOpen(false);
                  setActiveTab('leaderboard');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:opacity-95 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <Trophy className="w-4 h-4 text-slate-950" />
                <span>Open Full Champions Page</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsScoreboardOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

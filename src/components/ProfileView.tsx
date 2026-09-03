import {
  Award,
  Bookmark,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Flame,
  Image,
  Layers,
  MapPin,
  Plus,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
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
  const { user, updateUserProfile, issues, cleanupDrives, setSelectedIssueId, setIsReportModalOpen } = useApp();
  const [profileTab, setProfileTab] = useState<'reports' | 'saved' | 'cleanups' | 'badges'>('reports');

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

          {/* Points Card */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-center sm:text-right space-y-1 w-full sm:w-auto flex-shrink-0">
            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-amber-700">
              <GradientStar className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black font-['Outfit'] text-amber-900">
                {user.points.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-bold">Total Namma Points</p>
            <div className="text-[10px] text-cyan-700 font-bold pt-1">
              Bengaluru Rank: #{user.rank}
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
    </div>
  );
};

import {
  Bell,
  CheckCheck,
  ChevronRight,
  Flame,
  Globe,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { NavigationTab, useApp } from '../context/AppContext';
import { GradientStar } from './GradientStar';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    notifications,
    setIsSearchOpen,
    setIsReportModalOpen,
    setSelectedIssueId,
    markAllNotificationsRead,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'map', label: 'Explore Map' },
    { id: 'report', label: 'Report Issue' },
    { id: 'cleancity', label: 'Clean City' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'feed', label: 'Civic Feed' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 glass-panel bg-white/90 backdrop-blur-xl shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Logo
          size="md"
          showTagline={true}
          onClick={() => setActiveTab('home')}
        />

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-${link.id}`}
                onClick={() => {
                  if (link.id === 'report') {
                    setIsReportModalOpen(true);
                  } else {
                    setActiveTab(link.id);
                  }
                }}
                className={`relative px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-700 bg-cyan-50 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}

          {/* Admin shortcut badge */}
          <button
            id="nav-admin"
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
              activeTab === 'admin'
                ? 'bg-purple-100 text-purple-800 border-purple-300'
                : 'text-purple-700 border-purple-200 hover:bg-purple-50'
            }`}
          >
            BBMP Admin
          </button>
        </nav>

        {/* Right: Search, Quick Report, Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Global Search Bar / Button */}
          <button
            id="global-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-cyan-400 text-xs transition-all shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden sm:inline">Search issues, areas...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white text-slate-500 rounded border border-slate-200 shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* "+ Report" Quick Action (Desktop) */}
          <button
            id="header-report-btn"
            onClick={() => setIsReportModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:opacity-95 shadow-md shadow-cyan-500/20 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Report Issue</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="notifications-toggle"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Menu */}
            {isNotifOpen && (
              <div
                id="notifications-dropdown"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel border border-slate-200 bg-white/98 backdrop-blur-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Civic Alerts
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-cyan-100 text-cyan-800 font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-cyan-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No notifications yet.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (notif.relatedIssueId) {
                            setSelectedIssueId(notif.relatedIssueId);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          notif.read
                            ? 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                            : 'bg-cyan-50/70 border-cyan-200 hover:bg-cyan-100/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-bold text-slate-900">{notif.title}</h5>
                          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-medium">Bengaluru Civic Watch</span>
                  <button
                    onClick={() => {
                      setActiveTab('feed');
                      setIsNotifOpen(false);
                    }}
                    className="text-cyan-700 font-bold hover:underline flex items-center gap-0.5"
                  >
                    View feed <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Points Badge & Profile Avatar */}
          <button
            id="user-profile-nav"
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-full bg-white border border-slate-200 hover:border-cyan-400 shadow-xs transition-all group"
          >
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black">
              <GradientStar className="w-3.5 h-3.5" />
              <span>{user.points.toLocaleString()}</span>
              <span className="text-[9px] font-normal text-amber-700">pts</span>
            </div>

            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover ring-2 ring-cyan-500/30 group-hover:ring-cyan-500"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

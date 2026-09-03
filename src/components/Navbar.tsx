import {
  Bell,
  CheckCheck,
  ChevronRight,
  Compass,
  Flame,
  Globe,
  Info,
  Layers,
  MapPin,
  Menu,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Trophy,
  User,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { NavigationTab, useApp } from '../context/AppContext';
import { GradientStar } from './GradientStar';
import { GradientTrashBin } from './GradientTrashBin';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks: { id: NavigationTab; label: string; icon?: any }[] = [
    { id: 'home', label: 'Home' },
    { id: 'map', label: 'Explore Map', icon: Compass },
    { id: 'report', label: 'Report Issue', icon: Plus },
    { id: 'cleancity', label: 'Clean City', icon: GradientTrashBin },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'feed', label: 'Civic Feed', icon: Sparkles },
    { id: 'about', label: 'About', icon: Info },
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
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Global Search Bar / Button */}
          <button
            id="global-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-cyan-400 text-xs transition-all shadow-xs shrink-0"
            title="Search issues, areas"
            aria-label="Search issues, areas"
          >
            <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-cyan-600 shrink-0" />
            <span className="hidden sm:inline">Search issues, areas...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white text-slate-500 rounded border border-slate-200 shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* "+ Report" Quick Action (Desktop) */}
          <button
            id="header-report-btn"
            onClick={() => setIsReportModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:opacity-95 shadow-md shadow-cyan-500/20 transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Report Issue</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative shrink-0">
            <button
              id="notifications-toggle"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
              title="Notifications"
              aria-label="Toggle notifications"
            >
              <Bell className="w-5 h-5 shrink-0" />
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
            className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2.5 sm:pr-1.5 sm:py-1 rounded-full bg-white border border-slate-200 hover:border-cyan-400 active:scale-95 shadow-xs transition-all group shrink-0"
            title={`Profile: ${user.name} (${user.points} pts)`}
            aria-label={`User profile for ${user.name}, ${user.points} points`}
          >
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black shrink-0 whitespace-nowrap">
              <GradientStar className="w-3.5 h-3.5 shrink-0" />
              <span>{user.points.toLocaleString()}</span>
              <span className="text-[9px] font-normal text-amber-700 hidden md:inline">pts</span>
            </div>

            <div className="relative shrink-0 flex items-center justify-center">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 sm:w-7 sm:h-7 rounded-full object-cover ring-2 ring-cyan-500/30 group-hover:ring-cyan-500 shrink-0"
              />
              <span className="sm:hidden absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[8px] font-black text-amber-950 shadow-xs leading-none">
                ★
              </span>
            </div>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-cyan-700 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-2xl shadow-2xl px-4 py-4 space-y-3 animate-in slide-in-from-top-3 duration-200"
        >
          {/* Quick Action Button for Mobile */}
          <button
            id="mobile-drawer-report-btn"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsReportModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 shadow-md shadow-cyan-500/20 active:scale-[0.99] transition-transform"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Report a Civic Issue Now</span>
          </button>

          {/* Navigation Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  id={`mobile-drawer-link-${link.id}`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (link.id === 'report') {
                      setIsReportModalOpen(true);
                    } else {
                      setActiveTab(link.id);
                    }
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-cyan-600 flex-shrink-0" />}
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}

            {/* BBMP Admin Portal Link */}
            <button
              id="mobile-drawer-link-admin"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveTab('admin');
              }}
              className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                  : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100/70'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="truncate">BBMP Admin</span>
            </button>
          </div>

          {/* User Civic Summary Footer inside Drawer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>
              Ward: <strong className="text-slate-800">{user.area}</strong>
            </span>
            <span>
              Rank: <strong className="text-cyan-700">#{user.rank} Bengaluru</strong>
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

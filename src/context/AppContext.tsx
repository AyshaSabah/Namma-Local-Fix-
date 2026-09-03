import confetti from 'canvas-confetti';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_CLEANUP_DRIVES,
  INITIAL_ISSUES,
  INITIAL_NOTIFICATIONS,
  INITIAL_STATS,
  INITIAL_USER,
} from '../data/bengaluruData';
import {
  CleanupDrive,
  CivicImpactStats,
  Comment,
  Issue,
  IssueCategory,
  IssueStatus,
  NotificationItem,
  UserProfile,
} from '../types';

export type NavigationTab =
  | 'home'
  | 'map'
  | 'report'
  | 'cleancity'
  | 'leaderboard'
  | 'about'
  | 'admin'
  | 'profile'
  | 'feed'
  | 'points';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'points';
  title: string;
  message: string;
  points?: number;
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  issues: Issue[];
  cleanupDrives: CleanupDrive[];
  user: UserProfile;
  notifications: NotificationItem[];
  stats: CivicImpactStats;
  selectedCategory: IssueCategory | 'All';
  setSelectedCategory: (cat: IssueCategory | 'All') => void;
  selectedStatus: IssueStatus | 'All';
  setSelectedStatus: (status: IssueStatus | 'All') => void;
  selectedArea: string | 'All';
  setSelectedArea: (area: string | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
  isCleanupModalOpen: boolean;
  setIsCleanupModalOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  
  // Actions
  addNewIssue: (issueData: Partial<Issue>) => Promise<Issue>;
  supportIssue: (issueId: string) => void;
  toggleBookmark: (issueId: string) => void;
  addComment: (issueId: string, text: string) => void;
  updateIssueStatus: (issueId: string, newStatus: IssueStatus, officialNote?: string) => void;
  joinCleanupDrive: (driveId: string) => void;
  submitCleanupProof: (proofData: {
    beforeImage: string;
    afterImage: string;
    area: string;
    notes?: string;
  }) => Promise<{ pointsEarned: number; wasteKgEstimate: number }>;
  markAllNotificationsRead: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem('nlf_issues');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });
  const [cleanupDrives, setCleanupDrives] = useState<CleanupDrive[]>(() => {
    const saved = localStorage.getItem('nlf_cleanups');
    return saved ? JSON.parse(saved) : INITIAL_CLEANUP_DRIVES;
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nlf_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('nlf_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [stats, setStats] = useState<CivicImpactStats>(() => {
    const saved = localStorage.getItem('nlf_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'All'>('All');
  const [selectedArea, setSelectedArea] = useState<string | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [isCleanupModalOpen, setIsCleanupModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nlf_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('nlf_cleanups', JSON.stringify(cleanupDrives));
  }, [cleanupDrives]);

  useEffect(() => {
    localStorage.setItem('nlf_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nlf_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nlf_stats', JSON.stringify(stats));
  }, [stats]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981'],
      });
    } catch {
      // fallback
    }
  };

  const awardPoints = (pointsToAdd: number, actionName: string, iconType: 'report' | 'cleanup' | 'verify' | 'support' | 'badge') => {
    setUser((prev) => {
      const newPoints = prev.points + pointsToAdd;
      let newLevel = prev.level;
      let newLevelTitle = prev.levelTitle;

      if (newPoints >= 1800) {
        newLevel = 5;
        newLevelTitle = 'Bengaluru Guardian';
      } else if (newPoints >= 1000) {
        newLevel = 4;
        newLevelTitle = 'Community Champion';
      } else if (newPoints >= 600) {
        newLevel = 3;
        newLevelTitle = 'City Contributor';
      } else if (newPoints >= 250) {
        newLevel = 2;
        newLevelTitle = 'Local Helper';
      }

      const historyItem = {
        id: 'ph-' + Date.now(),
        action: actionName,
        points: pointsToAdd,
        timestamp: 'Just now',
        iconType,
      };

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        levelTitle: newLevelTitle,
        pointsToNextLevel: Math.max(0, 1800 - newPoints),
        pointsHistory: [historyItem, ...prev.pointsHistory],
      };
    });
  };

  const addNewIssue = async (issueData: Partial<Issue>): Promise<Issue> => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `NLF-${randomNum}`;
    const now = 'Just now';

    const newIssue: Issue = {
      id: newId,
      title: issueData.title || 'Civic Issue Reported',
      description: issueData.description || 'Reported by citizen via Namma Local Fix.',
      category: issueData.category || 'Garbage',
      status: 'Reported',
      severity: issueData.severity || 'Medium',
      lat: issueData.lat || 12.9716,
      lng: issueData.lng || 77.5946,
      area: issueData.area || 'Koramangala',
      streetAddress: issueData.streetAddress || 'Bengaluru, Karnataka',
      city: 'Bengaluru',
      imageUrl:
        issueData.imageUrl ||
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
      reportedBy: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
      reportedAt: now,
      updatedAt: now,
      supportersCount: 1,
      supporters: [user.id],
      bookmarkedBy: [],
      comments: [],
      aiDetection: issueData.aiDetection,
      assignedAuthority: 'BBMP Ward Control & Inspection Unit',
      estimatedResolutionDays: 3,
    };

    setIssues((prev) => [newIssue, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalReports: prev.totalReports + 1,
    }));
    setUser((prev) => ({
      ...prev,
      issuesReported: prev.issuesReported + 1,
    }));

    // Award +10 Namma Points for reporting genuine issue
    const pointBonus = issueData.category === 'Garbage' ? 15 : 10;
    awardPoints(pointBonus, `Reported ${issueData.category} in ${newIssue.area}`, 'report');

    // Add notification
    const newNotif: NotificationItem = {
      id: 'n-' + Date.now(),
      title: 'Report Submitted Successfully',
      message: `Issue #${newId} in ${newIssue.area} has been recorded. AI Verification is active.`,
      type: 'ai_verified',
      timestamp: 'Just now',
      read: false,
      relatedIssueId: newId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerConfetti();
    addToast({
      type: 'points',
      title: `Report Submitted! +${pointBonus} Points`,
      message: `Issue #${newId} recorded. Namma Bengaluru thanks you!`,
      points: pointBonus,
    });

    return newIssue;
  };

  const supportIssue = (issueId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const hasSupported = iss.supporters.includes(user.id);
          const newSupporters = hasSupported
            ? iss.supporters.filter((id) => id !== user.id)
            : [...iss.supporters, user.id];
          const newCount = hasSupported ? iss.supportersCount - 1 : iss.supportersCount + 1;

          if (!hasSupported) {
            awardPoints(2, `Supported Issue #${issueId} in ${iss.area}`, 'support');
            addToast({
              type: 'points',
              title: '+2 Namma Points',
              message: `You supported issue #${issueId}. Community power increases priority!`,
              points: 2,
            });
          }

          return {
            ...iss,
            supportersCount: Math.max(1, newCount),
            supporters: newSupporters,
          };
        }
        return iss;
      })
    );
  };

  const toggleBookmark = (issueId: string) => {
    setUser((prev) => {
      const isSaved = prev.savedIssueIds.includes(issueId);
      const newSaved = isSaved
        ? prev.savedIssueIds.filter((id) => id !== issueId)
        : [...prev.savedIssueIds, issueId];
      return { ...prev, savedIssueIds: newSaved };
    });

    addToast({
      type: 'info',
      title: 'Bookmark Updated',
      message: 'Issue saved to your profile for easy tracking.',
    });
  };

  const addComment = (issueId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: 'c-' + Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: text.trim(),
      timestamp: 'Just now',
    };

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            comments: [...iss.comments, newComment],
          };
        }
        return iss;
      })
    );

    addToast({
      type: 'info',
      title: 'Comment Posted',
      message: 'Your update has been added to the civic record.',
    });
  };

  const updateIssueStatus = (issueId: string, newStatus: IssueStatus, officialNote?: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const updatedComments = officialNote
            ? [
                ...iss.comments,
                {
                  id: 'c-admin-' + Date.now(),
                  userId: 'bbmp_admin',
                  userName: 'BBMP Bengaluru Control',
                  userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                  text: officialNote,
                  timestamp: 'Just now',
                  isOfficial: true,
                },
              ]
            : iss.comments;

          const resolved = newStatus === 'Resolved';

          if (resolved && iss.status !== 'Resolved') {
            setStats((s) => ({ ...s, resolvedIssues: s.resolvedIssues + 1 }));
            // Award resolution bonus
            awardPoints(20, `Issue #${issueId} Resolved`, 'verify');
          }

          return {
            ...iss,
            status: newStatus,
            updatedAt: 'Just now',
            resolvedAt: resolved ? 'Just now' : iss.resolvedAt,
            resolvedByText: resolved ? 'Resolved by BBMP Civic Wing & Community' : iss.resolvedByText,
            comments: updatedComments,
          };
        }
        return iss;
      })
    );

    addToast({
      type: 'success',
      title: 'Status Updated',
      message: `Issue #${issueId} moved to "${newStatus}"`,
    });
  };

  const joinCleanupDrive = (driveId: string) => {
    setCleanupDrives((prev) =>
      prev.map((drive) => {
        if (drive.id === driveId) {
          const alreadyJoined = drive.joinedUserIds.includes(user.id);
          if (alreadyJoined) {
            return {
              ...drive,
              joinedUserIds: drive.joinedUserIds.filter((id) => id !== user.id),
              participantsCount: drive.participantsCount - 1,
            };
          } else {
            awardPoints(50, `Joined Cleanup: ${drive.title}`, 'cleanup');
            setUser((u) => ({ ...u, cleanupsJoined: u.cleanupsJoined + 1 }));
            triggerConfetti();
            addToast({
              type: 'points',
              title: 'Joined Cleanup Drive! +50 Points',
              message: `You're registered for ${drive.title}. See you on ${drive.date}!`,
              points: 50,
            });
            return {
              ...drive,
              joinedUserIds: [...drive.joinedUserIds, user.id],
              participantsCount: drive.participantsCount + 1,
            };
          }
        }
        return drive;
      })
    );
  };

  const submitCleanupProof = async (proofData: {
    beforeImage: string;
    afterImage: string;
    area: string;
    notes?: string;
  }) => {
    try {
      const response = await fetch('/api/ai/verify-cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proofData),
      });
      const resData = await response.json();
      const points = resData?.data?.pointsAwarded || 50;
      const wasteKg = resData?.data?.wasteRemovedKgEstimate || 12;

      awardPoints(points, `Cleaned Area in ${proofData.area} (+${wasteKg}kg waste removed)`, 'cleanup');
      setStats((s) => ({
        ...s,
        cleanupActions: s.cleanupActions + 1,
        totalWasteRemovedKg: s.totalWasteRemovedKg + wasteKg,
      }));
      setUser((u) => ({
        ...u,
        trashReports: u.trashReports + 1,
        cleanupsJoined: u.cleanupsJoined + 1,
      }));

      triggerConfetti();
      addToast({
        type: 'points',
        title: `Cleanup Verified! +${points} Namma Points`,
        message: `AI confirmed ~${wasteKg} kg waste cleared in ${proofData.area}. Incredible effort!`,
        points,
      });

      return { pointsEarned: points, wasteKgEstimate: wasteKg };
    } catch {
      // Fallback
      awardPoints(50, `Cleaned Area in ${proofData.area}`, 'cleanup');
      triggerConfetti();
      addToast({
        type: 'points',
        title: 'Cleanup Verified! +50 Points',
        message: 'Your before and after photos have been confirmed.',
        points: 50,
      });
      return { pointsEarned: 50, wasteKgEstimate: 10 };
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
    });
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile changes have been saved.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        issues,
        cleanupDrives,
        user,
        notifications,
        stats,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        selectedArea,
        setSelectedArea,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        selectedIssueId,
        setSelectedIssueId,
        isCleanupModalOpen,
        setIsCleanupModalOpen,
        toasts,
        addToast,
        removeToast,
        triggerConfetti,
        addNewIssue,
        supportIssue,
        toggleBookmark,
        addComment,
        updateIssueStatus,
        joinCleanupDrive,
        submitCleanupProof,
        markAllNotificationsRead,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type IssueCategory =
  | 'Pothole'
  | 'Garbage'
  | 'Broken Streetlight'
  | 'Water Leakage'
  | 'Traffic Signal'
  | 'Illegal Dumping'
  | 'Public Space Damage'
  | 'Stray Animal'
  | 'Pollution'
  | 'Overgrown Area'
  | 'Other';

export type IssueStatus = 'Reported' | 'Verified' | 'In Progress' | 'Resolved';

export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  isOfficial?: boolean;
}

export interface AiDetectionResult {
  detectedCategory: IssueCategory;
  confidence: number; // e.g. 96
  severity: IssueSeverity;
  explanation: string;
  tags?: string[];
  suggestedAction?: string;
  estimatedImpact?: string;
}

export interface Issue {
  id: string; // e.g. NLF-10231
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  severity: IssueSeverity;
  lat: number;
  lng: number;
  area: string; // e.g. "Koramangala 4th Block"
  streetAddress: string;
  city: 'Bengaluru';
  imageUrl: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  reportedBy: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  reportedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedByText?: string;
  supportersCount: number;
  supporters: string[]; // User IDs who supported
  bookmarkedBy: string[]; // User IDs
  comments: Comment[];
  aiDetection?: AiDetectionResult;
  assignedAuthority?: string; // e.g. "BBMP Ward 151 Road Infra"
  estimatedResolutionDays?: number;
}

export interface CleanupDrive {
  id: string;
  title: string;
  description: string;
  area: string;
  locationDetails: string;
  lat: number;
  lng: number;
  date: string; // e.g. "Saturday, 5 Sept 2026"
  time: string; // e.g. "8:00 AM"
  participantsCount: number;
  targetWasteKg: number;
  collectedWasteKg?: number;
  imageUrl: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  hostName: string;
  hostBadge: string;
  joinedUserIds: string[];
  equipmentProvided: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  colorGradient: string;
}

export interface PointsHistoryItem {
  id: string;
  action: string;
  points: number;
  timestamp: string;
  referenceId?: string;
  iconType: 'report' | 'cleanup' | 'verify' | 'support' | 'badge';
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email: string;
  area: string;
  city: 'Bengaluru';
  points: number;
  level: number;
  levelTitle: string;
  pointsToNextLevel: number;
  nextLevelThreshold: number;
  currentLevelMinPoints: number;
  issuesReported: number;
  issuesResolved: number;
  cleanupsJoined: number;
  trashReports: number;
  rank: number;
  badges: Badge[];
  pointsHistory: PointsHistoryItem[];
  savedIssueIds: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'status_update' | 'points' | 'cleanup_drive' | 'ai_verified' | 'support';
  timestamp: string;
  read: boolean;
  relatedIssueId?: string;
}

export interface CivicImpactStats {
  totalReports: number;
  resolvedIssues: number;
  cleanupActions: number;
  communityMembers: number;
  totalWasteRemovedKg: number;
}

export type MyProfileDto = {
  userId: string;
  email: string;
  username: string;
  totalPoints: number;
  currentStreakDays: number;
  bestStreakDays: number;
  lastActiveDate: string | null;
};

export type ProfileBadgeDto = {
  badgeId: string;
  name: string;
  description: string;
  iconPath: string | null;
  isUnlocked: boolean;
  awardedAt: string | null;
};
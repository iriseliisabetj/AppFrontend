export type MyProfileDto = {
  userId: string;
  email: string;
  username: string;
  totalPoints: number;
  currentStreakDays: number;
  bestStreakDays: number;
  lastActiveDate: string | null;
};

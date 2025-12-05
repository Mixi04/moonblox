
export enum GameType {
  CRASH = 'CRASH',
  COINFLIP = 'COINFLIP',
  MINES = 'MINES',
  CASES = 'CASES',
  BATTLES = 'BATTLES',
  TOWERS = 'TOWERS',
  UPGRADER = 'UPGRADER',
  BLACKJACK = 'BLACKJACK',
  PLINKO = 'PLINKO',
  ROULETTE = 'ROULETTE'
}

export type AuthMode = 'LOGIN' | 'SIGNUP';

export interface UserState {
  balance: number;
  username: string;
  avatar?: string;
  email?: string;
  isLoggedIn: boolean;
  level: number;
  xp: number;
  claimedLevels: number[]; // Array of level numbers that have been claimed
  usernameChanged?: boolean; // Track if user has already changed their name
  totalWagered: number; // Total amount wagered all-time
}

export interface ChatMessage {
  id: string;
  user_id?: string; // Links to auth user
  type: 'self' | 'other' | 'bot' | 'system';
  username: string;
  avatar?: string;
  text: string;
  created_at?: string; // Database timestamp
  timestamp: Date; // Frontend object
  rank?: 'ADMIN' | 'MOD' | 'VIP' | 'USER';
}

export interface GameProps {
  balance: number;
  updateBalance: (amount: number) => void;
  onPlay: (amount: number) => void; // Hook for sound/analytics
  isLoggedIn: boolean;
  onOpenLogin: () => void;
}

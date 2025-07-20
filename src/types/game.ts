export interface GameState {
  currentPage: 'home' | 'map' | 'mission';
  currentMission: number;
  completedMissions: boolean[];
  playerData: {
    pseudo: string;
    email: string;
  };
  missionAttempts: { [key: number]: number };
  hintsShown: { [key: number]: number };
}

export interface Mission {
  id: number;
  name: string;
  location: string;
  description: string;
  answer: string;
  hints: string[];
  type: 'text' | 'puzzle' | 'calculation' | 'riddle';
  content: MissionContent;
}

export interface MissionContent {
  story?: string;
  images?: string[];
  puzzle?: PuzzleData;
  riddle?: RiddleData;
}

export interface PuzzleData {
  pieces: number;
  solution: string;
}

export interface RiddleData {
  clues: string[];
  solution: string;
}

export interface Location {
  id: number;
  name: string;
  coordinates: { x: number; y: number };
  isUnlocked: boolean;
  isCompleted: boolean;
}
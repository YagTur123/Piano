export type Hand = 'L' | 'R';
export type FingerNumber = 1 | 2 | 3 | 4 | 5;

export interface FingerGuide {
  hand: Hand;
  finger: FingerNumber;
  label?: string; // e.g. "Sağ Başparmak"
}

export interface NoteInfo {
  midi: number;
  noteName: string; // e.g. "C4", "F#4"
  pitch: string; // "C", "F#", etc.
  octave: number;
  isSharp: boolean;
  solfege: string; // "Do", "Re", "Mi", etc.
  keyShortcut?: string; // Computer keyboard mapping
}

export interface LessonNote {
  note: string; // e.g. "C4"
  duration: number; // in quarter beats: 1 = quarter, 2 = half, 4 = whole, 0.5 = eighth
  finger?: FingerGuide;
  lyric?: string;
  hand?: Hand;
}

export interface Lesson {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  objective: string;
  handGuide: string;
  tips: string[];
  tempo: number;
  timeSignature: string; // "4/4", "3/4"
  notes: LessonNote[];
  recommendedKeyRange?: [string, string]; // e.g. ["C4", "G4"]
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  level: 'Başlangıç' | 'Temel' | 'Orta' | 'İleri';
  lessons: Lesson[];
}

export interface NotePlayEvent {
  note: string;
  midi: number;
  timestamp: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  stars: number; // 1-3
  highScore: number;
  lastPlayedAt?: number;
}

export type KeyLabelMode = 'solfege' | 'letters' | 'fingers' | 'keyboard' | 'none';

export type TabletLayoutMode = 'ergo' | 'fit' | 'dual' | 'stage' | 'custom';
export type KeyHeightMode = 'standard' | 'tall' | 'maximum';

export interface PianoSettings {
  keyWidth: number; // in pixels (36 to 88)
  labelMode: KeyLabelMode;
  sustainPedal: boolean;
  volume: number; // 0 to 1
  metronomeBpm: number;
  metronomeEnabled: boolean;
  octaveOffset: number; // -2 to +2
  reverbAmount: number; // 0 to 1
  hapticSensitivity: number; // 0 to 100 (tactile vibration intensity)
}

export interface ChordItem {
  id: string;
  name: string;
  root: string;
  type: string;
  symbol: string;
  notes: string[]; // e.g. ["C4", "E4", "G4"]
  fingeringRight: number[];
  fingeringLeft: number[];
  description: string;
  category: 'Majör' | 'Minör' | 'Yedili (7th)' | 'Askıda (Sus)';
}

export interface ScaleItem {
  id: string;
  name: string;
  root: string;
  type: string;
  notes: string[];
  fingeringRight: number[];
  fingeringLeft: number[];
  description: string;
  category: 'Majör' | 'Doğal Minör' | 'Armonik Minör' | 'Pentatonik';
}

import { NoteInfo } from '../types/piano';

export const PITCH_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const SOLFEGE_NAMES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

// Computer keyboard mappings centered around Middle C (C4)
export const KEYBOARD_SHORTCUTS: Record<string, string> = {
  // Lower octave (C3 - B3)
  q: 'C3',
  '2': 'C#3',
  w: 'D3',
  '3': 'D#3',
  e: 'E3',
  r: 'F3',
  '5': 'F#3',
  t: 'G3',
  '6': 'G#3',
  y: 'A3',
  '7': 'A#3',
  u: 'B3',

  // Middle octave (C4 - B4)
  z: 'C4',
  s: 'C#4',
  x: 'D4',
  d: 'D#4',
  c: 'E4',
  v: 'F4',
  g: 'F#4',
  b: 'G4',
  h: 'G#4',
  n: 'A4',
  j: 'A#4',
  m: 'B4',

  // Upper octave (C5 - G5)
  i: 'C5',
  '9': 'C#5',
  o: 'D5',
  '0': 'D#5',
  p: 'E5',
  '[': 'F5',
  '=': 'F#5',
  ']': 'G5',
};

// Invert shortcuts mapping (note -> key)
export const NOTE_TO_SHORTCUT: Record<string, string> = Object.entries(KEYBOARD_SHORTCUTS).reduce(
  (acc, [key, note]) => {
    acc[note] = key.toUpperCase();
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Returns MIDI number for a note string (e.g. 'C4' -> 60)
 */
export function noteNameToMidi(noteName: string): number {
  const match = noteName.match(/^([A-G]#?)(-?\d+)$/);
  if (!match) return 60;
  const pitch = match[1];
  const octave = parseInt(match[2], 10);
  const pitchIndex = PITCH_NAMES.indexOf(pitch);
  if (pitchIndex === -1) return 60;
  return (octave + 1) * 12 + pitchIndex;
}

/**
 * Returns note name for a MIDI number (e.g. 60 -> 'C4')
 */
export function midiToNoteName(midi: number): string {
  const pitch = PITCH_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${pitch}${octave}`;
}

/**
 * Returns Solfege name for a note name (e.g. 'C4' -> 'Do4')
 */
export function noteNameToSolfege(noteName: string): string {
  const match = noteName.match(/^([A-G]#?)(-?\d+)$/);
  if (!match) return noteName;
  const pitch = match[1];
  const octave = match[2];
  const index = PITCH_NAMES.indexOf(pitch);
  if (index === -1) return noteName;
  return `${SOLFEGE_NAMES[index]}${octave}`;
}

/**
 * Builds a list of keys between startMidi and endMidi
 * Default standard 61-key (C2=36 to C7=96) or 49-key (C3=48 to C7=96)
 */
export function generatePianoKeys(startMidi: number = 36, endMidi: number = 96): NoteInfo[] {
  const keys: NoteInfo[] = [];
  for (let midi = startMidi; midi <= endMidi; midi++) {
    const pitchIndex = midi % 12;
    const pitch = PITCH_NAMES[pitchIndex];
    const octave = Math.floor(midi / 12) - 1;
    const noteName = `${pitch}${octave}`;
    const isSharp = pitch.includes('#');
    const solfege = SOLFEGE_NAMES[pitchIndex];
    const keyShortcut = NOTE_TO_SHORTCUT[noteName];

    keys.push({
      midi,
      noteName,
      pitch,
      octave,
      isSharp,
      solfege,
      keyShortcut,
    });
  }
  return keys;
}

/**
 * Finger number to Turkish human-readable name
 */
export function getFingerTurkishName(finger: number, hand: 'L' | 'R'): string {
  const handName = hand === 'R' ? 'Sağ El' : 'Sol El';
  const names: Record<number, string> = {
    1: '1 (Başparmak)',
    2: '2 (İşaret)',
    3: '3 (Orta Parmak)',
    4: '4 (Yüzük Parmağı)',
    5: '5 (Serçe Parmak)',
  };
  return `${handName} - ${names[finger] || finger}`;
}

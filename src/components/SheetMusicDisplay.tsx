import React from 'react';
import { LessonNote } from '../types/piano';
import { noteNameToSolfege } from '../utils/pianoUtils';

interface SheetMusicDisplayProps {
  notes: LessonNote[];
  currentIndex: number;
  tempo: number;
  timeSignature: string;
  isPlaying: boolean;
}

// Note positions on treble staff: line 1 (bottom) = E4, line 2 = G4, line 3 = B4, line 4 = D5, line 5 (top) = F5
// C4 is ledger line below bottom line (y = 86)
const NOTE_Y_MAP: Record<string, number> = {
  C3: 130,
  D3: 124,
  E3: 118,
  F3: 112,
  G3: 106,
  A3: 100,
  B3: 94,
  C4: 86, // Ledger line
  'C#4': 86,
  D4: 80, // Space below line 1
  'D#4': 80,
  Eb4: 74,
  E4: 74, // Line 1
  F4: 68, // Space 1
  'F#4': 68,
  G4: 62, // Line 2
  'G#4': 62,
  A4: 56, // Space 2
  'A#4': 56,
  B4: 50, // Line 3
  C5: 44, // Space 3
  'C#5': 44,
  D5: 38, // Line 4
  'D#5': 38,
  E5: 32, // Space 4
  F5: 26, // Line 5
  G5: 20,
};

export const SheetMusicDisplay: React.FC<SheetMusicDisplayProps> = ({
  notes,
  currentIndex,
  timeSignature,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center px-4 overflow-hidden select-none bg-[#131417]">
      {/* Upper subtle bar: Key & Current Note */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-1.5 border-b border-[#23252b]">
        <div className="flex items-center gap-2.5">
          <span className="text-[#ff9f0a] font-semibold tracking-wider">SKOR</span>
          <span className="text-neutral-600">·</span>
          <span>Ölçü: <strong className="text-neutral-200">{timeSignature}</strong></span>
          <span className="text-neutral-600">·</span>
          <span>Anahtar: <strong className="text-neutral-200">Sol (Treble)</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-neutral-400">Hedef:</span>
          {notes[currentIndex] ? (
            <span className="font-semibold text-[#ffb340] bg-[#221c12] px-2 py-0.5 rounded border border-[#ff9f0a]/30">
              {notes[currentIndex].note} ({noteNameToSolfege(notes[currentIndex].note)})
              {notes[currentIndex].finger && ` · Parmak ${notes[currentIndex].finger.finger}`}
            </span>
          ) : (
            <span className="text-[#30d158] font-semibold">Tamamlandı ✓</span>
          )}
        </div>
      </div>

      {/* SVG Music Staff (Clean Apple Logic / GarageBand Score Editor style) */}
      <div className="relative w-full h-24 overflow-x-auto overflow-y-hidden flex items-center py-1">
        <svg className="w-full h-full min-w-[640px]" viewBox="0 0 800 110">
          {/* Background */}
          <rect x="0" y="0" width="800" height="110" fill="#131417" />

          {/* 5 Staff lines in crisp metallic charcoal */}
          <line x1="10" y1="26" x2="790" y2="26" stroke="#2e323b" strokeWidth="1.5" />
          <line x1="10" y1="38" x2="790" y2="38" stroke="#2e323b" strokeWidth="1.5" />
          <line x1="10" y1="50" x2="790" y2="50" stroke="#2e323b" strokeWidth="1.5" />
          <line x1="10" y1="62" x2="790" y2="62" stroke="#2e323b" strokeWidth="1.5" />
          <line x1="10" y1="74" x2="790" y2="74" stroke="#2e323b" strokeWidth="1.5" />

          {/* Treble Clef 𝄞 Symbol */}
          <text x="24" y="70" fontSize="56" fill="#8e95a5" fontFamily="serif" pointerEvents="none">
            𝄞
          </text>

          {/* Time Signature */}
          <text x="75" y="48" fontSize="22" fontWeight="bold" fill="#717887" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
            {timeSignature.split('/')[0]}
          </text>
          <text x="75" y="70" fontSize="22" fontWeight="bold" fill="#717887" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
            {timeSignature.split('/')[1] || '4'}
          </text>

          {/* Measure bar lines */}
          <line x1="96" y1="26" x2="96" y2="74" stroke="#3e434f" strokeWidth="1.5" />
          <line x1="280" y1="26" x2="280" y2="74" stroke="#333742" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="480" y1="26" x2="480" y2="74" stroke="#333742" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="680" y1="26" x2="680" y2="74" stroke="#333742" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="790" y1="26" x2="790" y2="74" stroke="#4b5160" strokeWidth="2.5" />

          {/* Notes mapping */}
          {notes.map((item, idx) => {
            const x = 120 + idx * 56;
            const y = NOTE_Y_MAP[item.note] ?? 62;
            const isCurrent = idx === currentIndex;
            const isPassed = idx < currentIndex;
            const isC4 = item.note.startsWith('C4');

            const noteFill = isCurrent ? '#ff9f0a' : isPassed ? '#3a3f4b' : '#f2f2f7';
            const stemColor = isCurrent ? '#ffb340' : isPassed ? '#3a3f4b' : '#d1d5db';

            return (
              <g key={idx} className="transition-all duration-150">
                {/* Current playhead halo */}
                {isCurrent && (
                  <ellipse cx={x} cy={y} rx="16" ry="12" fill="rgba(255, 159, 10, 0.2)" />
                )}

                {/* Ledger line for Middle C (C4) */}
                {isC4 && (
                  <line
                    x1={x - 12}
                    y1="86"
                    x2={x + 12}
                    y2="86"
                    stroke={isCurrent ? '#ff9f0a' : isPassed ? '#3a3f4b' : '#8e8e93'}
                    strokeWidth="1.8"
                  />
                )}

                {/* Note head (oval angled like real music score) */}
                <ellipse
                  cx={x}
                  cy={y}
                  rx="7.5"
                  ry="5.5"
                  transform={`rotate(-25 ${x} ${y})`}
                  fill={noteFill}
                  stroke={isCurrent ? '#d97706' : '#1c1c1e'}
                  strokeWidth="1"
                />

                {/* Stem */}
                <line
                  x1={x + 6}
                  y1={y - 1}
                  x2={x + 6}
                  y2={y - 28}
                  stroke={stemColor}
                  strokeWidth="1.8"
                />

                {/* Finger Number above note */}
                {item.finger && (
                  <text
                    x={x + 6}
                    y={y - 33}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill={isCurrent ? '#ffb340' : isPassed ? '#3a3f4b' : '#93c5fd'}
                    fontFamily="monospace"
                  >
                    {item.finger.finger}
                  </text>
                )}

                {/* Note name & Solfege below */}
                <text
                  x={x}
                  y="102"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isCurrent ? 'bold' : 'normal'}
                  fill={isCurrent ? '#ffb340' : isPassed ? '#484f5d' : '#8e8e93'}
                  fontFamily="monospace"
                >
                  {item.lyric || noteNameToSolfege(item.note)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

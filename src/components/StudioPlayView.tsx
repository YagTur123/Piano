import React from 'react';
import { Music } from 'lucide-react';

interface StudioPlayViewProps {
  detectedChord: string | null;
  lastPlayedNote: string | null;
  activeNotes: Set<string>;
  onHighlightNotes: (notes: string[]) => void;
}

export const StudioPlayView: React.FC<StudioPlayViewProps> = ({
  detectedChord,
  activeNotes,
  onHighlightNotes,
}) => {
  const PROGRESSIONS = [
    {
      title: 'Pop Klasiği (I-V-vi-IV)',
      chords: 'C - G - Am - F',
      notes: ['C4', 'E4', 'G4'],
    },
    {
      title: 'Pachelbel Kanonu',
      chords: 'C - G - Am - Em - F',
      notes: ['C4', 'G4', 'A4', 'E4', 'F4'],
    },
    {
      title: 'Caz 2-5-1',
      chords: 'Dm7 - G7 - Cmaj7',
      notes: ['D4', 'F4', 'A4', 'C5'],
    },
    {
      title: 'Duygusal Minör',
      chords: 'Am - F - C - G',
      notes: ['A3', 'C4', 'E4'],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#131417] p-3 sm:p-4 select-none">
      {/* Upper readout */}
      <div className="flex items-center justify-between border-b border-[#23252b] pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-[#1c1d22] border border-[#2e3038] flex items-center justify-center">
            <Music className="w-3.5 h-3.5 text-[#ff9f0a]" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-white tracking-tight">
              Akustik Grand Piyano Stüdyosu
            </h2>
            <span className="text-[11px] text-neutral-400">
              Dokunmatik tuşlar, bilgisayar klavyesi veya harici USB/Bluetooth MIDI ile çalın
            </span>
          </div>
        </div>

        {/* Real-time Chord Meter LCD */}
        <div className="gb-lcd px-3 py-1 rounded-md flex items-center gap-2.5 shrink-0">
          <span className="text-[8px] font-mono text-[#ff9f0a]/75 uppercase">
            AKOR:
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-[#ffb340]">
            {detectedChord || (activeNotes.size > 0 ? Array.from(activeNotes).join(' ') : 'Serbest')}
          </span>
        </div>
      </div>

      {/* Suggested Chord Progressions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-auto">
        {PROGRESSIONS.map((prog, idx) => (
          <button
            key={idx}
            onClick={() => onHighlightNotes(prog.notes)}
            className="p-2.5 rounded-lg bg-[#18191e] border border-[#292b33] hover:border-[#ff9f0a]/50 hover:bg-[#20222a] text-left transition-all"
            title="Klavyede notaları ve pozisyonu göster"
          >
            <div className="text-xs font-semibold text-neutral-200 truncate">{prog.title}</div>
            <div className="text-xs font-mono text-[#ffb340] mt-1 truncate font-medium">
              {prog.chords}
            </div>
          </button>
        ))}
      </div>

      <div className="text-[11px] text-neutral-500 font-mono text-center border-t border-[#1e2026] pt-1.5">
        İpucu: Tuşlara aynı anda basarak akorları keşfedin · Boşluk tuşu sustain pedalını basılı tutar
      </div>
    </div>
  );
};

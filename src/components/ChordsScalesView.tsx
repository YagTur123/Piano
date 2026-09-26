import React, { useState } from 'react';
import { CHORDS_LIST, SCALES_LIST } from '../data/chordsAndScales';
import { ChordItem, ScaleItem } from '../types/piano';
import { soundEngine } from '../audio/soundEngine';
import { noteNameToMidi, noteNameToSolfege } from '../utils/pianoUtils';
import { Play } from 'lucide-react';

interface ChordsScalesViewProps {
  onHighlightNotes: (notes: string[]) => void;
}

export const ChordsScalesView: React.FC<ChordsScalesViewProps> = ({ onHighlightNotes }) => {
  const [activeTab, setActiveTab] = useState<'chords' | 'scales'>('chords');
  const [selectedChord, setSelectedChord] = useState<ChordItem>(CHORDS_LIST[0]);
  const [selectedScale, setSelectedScale] = useState<ScaleItem>(SCALES_LIST[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const playChord = (chord: ChordItem) => {
    setIsPlayingAudio(true);
    onHighlightNotes(chord.notes);

    chord.notes.forEach((note, i) => {
      setTimeout(() => {
        soundEngine.playNote(noteNameToMidi(note), 0.7);
      }, i * 160);
    });

    setTimeout(() => {
      chord.notes.forEach((note) => {
        soundEngine.playNote(noteNameToMidi(note), 0.85);
      });
      setIsPlayingAudio(false);
    }, chord.notes.length * 160 + 150);
  };

  const playScale = (scale: ScaleItem) => {
    setIsPlayingAudio(true);
    onHighlightNotes(scale.notes);

    scale.notes.forEach((note, i) => {
      setTimeout(() => {
        soundEngine.playNote(noteNameToMidi(note), 0.75);
        if (i === scale.notes.length - 1) {
          setIsPlayingAudio(false);
        }
      }, i * 200);
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#131417] p-3 sm:p-4 select-none">
      {/* Top Header & Tab Switch */}
      <div className="flex items-center justify-between border-b border-[#23252b] pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#24262e] text-[#ff9f0a] border border-[#ff9f0a]/30">
            ARMONİ
          </span>
          <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">
            Akor ve Gam Sözlüğü
          </span>
        </div>

        {/* Apple Segmented Control */}
        <div className="flex items-center bg-[#151619] p-0.5 rounded-md border border-[#2a2c32] shadow-inner">
          <button
            onClick={() => {
              setActiveTab('chords');
              onHighlightNotes(selectedChord.notes);
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'chords'
                ? 'bg-[#32353c] text-white shadow-xs border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Akorlar
          </button>
          <button
            onClick={() => {
              setActiveTab('scales');
              onHighlightNotes(selectedScale.notes);
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'scales'
                ? 'bg-[#32353c] text-white shadow-xs border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Gamlar
          </button>
        </div>
      </div>

      {/* Main Selection & Detail Strip */}
      {activeTab === 'chords' ? (
        <div className="flex flex-col gap-2.5 my-auto">
          {/* Chord Carousel / Strip */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {CHORDS_LIST.map((chord) => {
              const isSelected = selectedChord.id === chord.id;
              return (
                <button
                  key={chord.id}
                  onClick={() => {
                    setSelectedChord(chord);
                    onHighlightNotes(chord.notes);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-left shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-[#27231c] border-[#ff9f0a]/60 text-white shadow-xs'
                      : 'bg-[#18191e] border-[#292b33] text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="text-xs font-semibold font-mono">{chord.symbol}</div>
                  <div className="text-[10px] text-neutral-400">{chord.name}</div>
                </button>
              );
            })}
          </div>

          {/* Active Chord Details */}
          <div className="bg-[#101114] border border-[#202228] rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[9px] font-mono text-[#ff9f0a] uppercase tracking-wider">Akor Notaları:</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {selectedChord.notes.map((n, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#18191e] border border-[#2e303b] text-[#ffb340] font-mono text-xs font-medium"
                    >
                      {n} <span className="text-[10px] text-neutral-400 font-normal">({noteNameToSolfege(n)})</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-6 w-px bg-[#252830] hidden sm:block" />

              <div className="hidden sm:block text-xs font-mono text-neutral-400">
                Sağ El Parmakları: <strong className="text-white">{selectedChord.fingeringRight.join('-')}</strong> (1-3-5)
              </div>
            </div>

            <button
              onClick={() => playChord(selectedChord)}
              disabled={isPlayingAudio}
              className="gb-btn h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 shrink-0 self-end sm:self-center"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#ff9f0a]" />
              <span>Akoru Dinle</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 my-auto">
          {/* Scale Carousel / Strip */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {SCALES_LIST.map((scale) => {
              const isSelected = selectedScale.id === scale.id;
              return (
                <button
                  key={scale.id}
                  onClick={() => {
                    setSelectedScale(scale);
                    onHighlightNotes(scale.notes);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-left shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-[#27231c] border-[#ff9f0a]/60 text-white shadow-xs'
                      : 'bg-[#18191e] border-[#292b33] text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="text-xs font-semibold">{scale.name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono">{scale.root} {scale.type}</div>
                </button>
              );
            })}
          </div>

          {/* Active Scale Details */}
          <div className="bg-[#101114] border border-[#202228] rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-x-auto">
              <div>
                <span className="text-[9px] font-mono text-[#ff9f0a] uppercase tracking-wider">Dizi Sesleri:</span>
                <div className="flex items-center gap-1 mt-0.5 overflow-x-auto py-0.5">
                  {selectedScale.notes.map((n, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-[#18191e] border border-[#2e303b] text-[#ffb340] font-mono text-xs font-medium shrink-0"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-6 w-px bg-[#252830] hidden sm:block shrink-0" />

              <div className="hidden lg:block text-xs font-mono text-neutral-400 shrink-0">
                Parmak Sırası: <strong className="text-white">{selectedScale.fingeringRight.join('-')}</strong>
              </div>
            </div>

            <button
              onClick={() => playScale(selectedScale)}
              disabled={isPlayingAudio}
              className="gb-btn h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 shrink-0 self-end sm:self-center"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#ff9f0a]" />
              <span>Diziyi Dinle</span>
            </button>
          </div>
        </div>
      )}

      <div className="text-[11px] text-neutral-500 font-mono text-center border-t border-[#1e2026] pt-1.5">
        Seçilen sesler piyanoda sarı çerçeve ile işaretlenmiştir · Klavyede basarak deneyin
      </div>
    </div>
  );
};

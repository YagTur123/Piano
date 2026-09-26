import React, { useState, useEffect, useRef } from 'react';
import { NotePlayEvent } from '../types/piano';
import { soundEngine } from '../audio/soundEngine';
import { noteNameToMidi, noteNameToSolfege } from '../utils/pianoUtils';
import { Play } from 'lucide-react';

interface DrillPattern {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  targetFingers: string;
  notes: string[];
  initialBpm: number;
}

const DRILL_PATTERNS: DrillPattern[] = [
  {
    id: 'drill-hanon-1',
    name: 'Hanon No. 1',
    subtitle: '1-2 Parmak Açıklığı',
    description: '1. parmak ile 2. parmak arasındaki atlamayı alışkanlık haline getirir ve tüm parmakları eşit kuvvetle çalıştırmayı hedefler.',
    targetFingers: '1 - 2 - 3 - 4 - 5 - 4 - 3 - 2',
    notes: ['C4', 'E4', 'F4', 'G4', 'A4', 'G4', 'F4', 'E4'],
    initialBpm: 80,
  },
  {
    id: 'drill-five-finger',
    name: '5-Parmak Koşusu',
    subtitle: 'Akıcı Legato Hızı',
    description: 'Do\'dan Sol\'e beş parmağın birbirini takip eden dalga hareketi. Tuşları bağlayarak (legato) çalın.',
    targetFingers: '1 - 2 - 3 - 4 - 5 - 4 - 3 - 2 - 1',
    notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'F4', 'E4', 'D4', 'C4'],
    initialBpm: 90,
  },
  {
    id: 'drill-weak-fingers',
    name: '3-4-5 Parmak',
    subtitle: 'Zayıf Parmak İzolasyonu',
    description: 'Anatomik olarak birbirine en bağımlı olan yüzük ve serçe parmağın çevikliğini artırır.',
    targetFingers: '3 - 4 - 5 - 4 - 3 - 4 - 5',
    notes: ['E4', 'F4', 'G4', 'F4', 'E4', 'F4', 'G4'],
    initialBpm: 75,
  },
  {
    id: 'drill-thumb-under',
    name: 'Do Majör Gam',
    subtitle: 'Başparmak Alttan Geçiş',
    description: '3. parmaktan sonra 1. parmağın alttan Fa tuşuna pürüzsüzce süzülmesi alıştırması.',
    targetFingers: '1 - 2 - 3 -> 1 - 2 - 3 - 4 - 5',
    notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
    initialBpm: 85,
  }
];

interface DrillTrainerProps {
  noteEvent?: NotePlayEvent | null;
  onSetTargetNote: (note: string | null) => void;
  onSetTargetFinger: (finger: { hand: 'L' | 'R'; finger: 1 | 2 | 3 | 4 | 5 } | null) => void;
}

export const DrillTrainer: React.FC<DrillTrainerProps> = ({
  noteEvent,
  onSetTargetNote,
  onSetTargetFinger,
}) => {
  const [selectedDrill, setSelectedDrill] = useState<DrillPattern>(DRILL_PATTERNS[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [bpm, setBpm] = useState(selectedDrill.initialBpm);
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);

  const noteStartTimeRef = useRef<number>(Date.now());
  const lastProcessedTimestampRef = useRef<number>(0);

  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;
  const streakRef = useRef(0);
  streakRef.current = streak;
  const bestStreakRef = useRef(0);
  bestStreakRef.current = bestStreak;

  const currentTargetNote = selectedDrill.notes[currentIndex];

  useEffect(() => {
    onSetTargetNote(currentTargetNote);
    noteStartTimeRef.current = Date.now();
    return () => {
      onSetTargetNote(null);
      onSetTargetFinger(null);
    };
  }, [currentTargetNote, onSetTargetNote, onSetTargetFinger]);

  const handleSelectDrill = (drill: DrillPattern) => {
    setSelectedDrill(drill);
    currentIndexRef.current = 0;
    streakRef.current = 0;
    lastProcessedTimestampRef.current = 0;
    setCurrentIndex(0);
    setStreak(0);
    setBpm(drill.initialBpm);
    setLastReactionTime(null);
  };

  useEffect(() => {
    if (!noteEvent) return;
    if (noteEvent.timestamp <= lastProcessedTimestampRef.current) return;
    lastProcessedTimestampRef.current = noteEvent.timestamp;

    const currentIdx = currentIndexRef.current;
    const target = selectedDrill.notes[currentIdx];
    if (!target) return;

    if (noteEvent.note === target) {
      const reaction = Date.now() - noteStartTimeRef.current;
      setLastReactionTime(reaction);

      const nextStreak = streakRef.current + 1;
      streakRef.current = nextStreak;
      setStreak(nextStreak);
      if (nextStreak > bestStreakRef.current) {
        bestStreakRef.current = nextStreak;
        setBestStreak(nextStreak);
      }

      const nextIdx = currentIdx + 1;
      if (nextIdx >= selectedDrill.notes.length) {
        currentIndexRef.current = 0;
        setCurrentIndex(0);
        setBpm((b) => Math.min(220, b + 2));
      } else {
        currentIndexRef.current = nextIdx;
        setCurrentIndex(nextIdx);
      }
    } else {
      streakRef.current = 0;
      setStreak(0);
    }
  }, [noteEvent, selectedDrill]);

  const playPreview = () => {
    let t = 0;
    const interval = (60 / bpm) * 500;
    selectedDrill.notes.forEach((note) => {
      setTimeout(() => {
        soundEngine.playNote(noteNameToMidi(note), 0.7);
      }, t);
      t += interval;
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#131417] p-3 sm:p-4 select-none">
      {/* Upper Module Strip */}
      <div className="flex items-center justify-between border-b border-[#23252b] pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#24262e] text-[#ff9f0a] border border-[#ff9f0a]/30">
              HANON
            </span>
            <h2 className="text-xs sm:text-sm font-semibold text-white tracking-tight">{selectedDrill.name}</h2>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">
            Parmaklar: {selectedDrill.targetFingers}
          </span>
        </div>

        {/* Live Hardware LCD Metrics */}
        <div className="gb-lcd px-3 py-1 rounded-md font-mono text-center flex items-center gap-3 shrink-0">
          <div className="flex flex-col px-1">
            <span className="text-[7px] text-[#ff9f0a]/75 uppercase">SERİ</span>
            <span className="text-xs sm:text-sm font-bold text-[#ffb340]">{streak}</span>
          </div>

          <div className="w-px h-5 bg-[#252b33]" />

          <div className="flex flex-col px-1">
            <span className="text-[7px] text-[#ff9f0a]/75 uppercase">TEMPO</span>
            <span className="text-xs sm:text-sm font-bold text-[#ffb340]">{bpm} BPM</span>
          </div>

          <div className="w-px h-5 bg-[#252b33]" />

          <div className="flex flex-col px-1">
            <span className="text-[7px] text-[#ff9f0a]/75 uppercase">TEPKİ</span>
            <span className="text-xs sm:text-sm font-bold text-white">
              {lastReactionTime !== null ? `${lastReactionTime}ms` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Drill Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-auto">
        {DRILL_PATTERNS.map((drill) => {
          const isSelected = selectedDrill.id === drill.id;
          return (
            <button
              key={drill.id}
              onClick={() => handleSelectDrill(drill)}
              className={`p-2.5 rounded-lg text-left border transition-all ${
                isSelected
                  ? 'bg-[#27231c] border-[#ff9f0a]/60 text-white shadow-xs'
                  : 'bg-[#18191e] border-[#292b33] hover:bg-[#20222a] text-neutral-400'
              }`}
            >
              <span className="text-[10px] font-mono text-[#ff9f0a] block font-medium truncate">
                {drill.subtitle}
              </span>
              <span className="text-xs font-semibold text-neutral-200 truncate block mt-0.5">
                {drill.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Note Step Sequence Rack */}
      <div className="bg-[#101114] border border-[#202228] rounded-lg p-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {selectedDrill.notes.map((note, idx) => {
            const isCurrent = idx === currentIndex;
            const isDone = idx < currentIndex;
            return (
              <div
                key={`${note}-${idx}`}
                className={`px-2.5 py-1 rounded-md flex flex-col items-center min-w-[42px] border transition-all ${
                  isCurrent
                    ? 'bg-[#ff9f0a] text-black border-[#ffb340] font-bold scale-105 shadow-sm'
                    : isDone
                    ? 'bg-[#15161b] text-neutral-600 border-[#22242c]'
                    : 'bg-[#1c1d23] text-neutral-300 border-[#2e303b]'
                }`}
              >
                <span className="text-xs font-mono">{note}</span>
                <span className="text-[9px] opacity-75">{noteNameToSolfege(note)}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={playPreview}
          className="gb-btn h-7 px-2.5 rounded-md text-xs font-medium shrink-0 flex items-center gap-1"
        >
          <Play className="w-3 h-3 fill-current text-[#ff9f0a]" />
          <span>Dinle</span>
        </button>
      </div>
    </div>
  );
};

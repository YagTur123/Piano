import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GarageBandHeader, AppMode } from './components/GarageBandHeader';
import { PianoKeyboard } from './components/PianoKeyboard';
import { LessonPlayer } from './components/LessonPlayer';
import { LibraryDrawer } from './components/LibraryDrawer';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';
import { DrillTrainer } from './components/DrillTrainer';
import { ChordsScalesView } from './components/ChordsScalesView';
import { StudioPlayView } from './components/StudioPlayView';
import { PIANO_ROADMAP } from './data/roadmapData';
import {
  Lesson,
  LessonProgress,
  KeyLabelMode,
  FingerGuide,
  NotePlayEvent,
  TabletLayoutMode,
  KeyHeightMode,
} from './types/piano';
import { soundEngine } from './audio/soundEngine';
import { noteNameToMidi, KEYBOARD_SHORTCUTS } from './utils/pianoUtils';

const STORAGE_KEY = 'pianoforte_progress_v2';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('roadmap');
  const [activeLesson, setActiveLesson] = useState<Lesson>(PIANO_ROADMAP[0].lessons[0]);
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isWideStripMode, setIsWideStripMode] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // 13.1" Tablet Landscape & Ergonomic Finger Adjustment settings
  // Default to 72px for optimal touch comfort on 13.1" tablet screen
  const [keyWidth, setKeyWidth] = useState<number>(72);
  const [labelMode, setLabelMode] = useState<KeyLabelMode>('solfege');
  const [sustainPedal, setSustainPedal] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [octaveOffset, setOctaveOffset] = useState<number>(0);

  // 13.1" Tablet specific states
  const [tabletLayout, setTabletLayout] = useState<TabletLayoutMode>('ergo');
  const [keyHeightMode, setKeyHeightMode] = useState<KeyHeightMode>('tall');
  const [isDualKeyboard, setIsDualKeyboard] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hapticSensitivity, setHapticSensitivity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pianoforte_haptic_sensitivity');
      return saved !== null ? parseInt(saved, 10) : 65;
    } catch {
      return 65;
    }
  });

  const handleHapticChange = useCallback((val: number) => {
    setHapticSensitivity(val);
    try {
      localStorage.setItem('pianoforte_haptic_sensitivity', val.toString());
    } catch {
      // ignore
    }
  }, []);

  // Metronome settings
  const [metronomeBpm, setMetronomeBpm] = useState<number>(80);
  const [metronomeEnabled, setMetronomeEnabled] = useState<boolean>(false);
  const metronomeBeatRef = useRef<number>(0);
  const metronomeTimerRef = useRef<number | null>(null);

  // Active playing state
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [lastPlayedNote, setLastPlayedNote] = useState<string | null>(null);
  const [detectedChord, setDetectedChord] = useState<string | null>(null);
  const [noteEvent, setNoteEvent] = useState<NotePlayEvent | null>(null);

  // Lesson & Trainer guidance target notes
  const [targetNote, setTargetNote] = useState<string | null>(null);
  const [targetFinger, setTargetFinger] = useState<FingerGuide | null>(null);
  const [highlightedNotes, setHighlightedNotes] = useState<string[]>([]);

  // Studio Performance Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedEvents, setRecordedEvents] = useState<{ note: string; midi: number; time: number }[]>([]);
  const [isPlayingRecording, setIsPlayingRecording] = useState<boolean>(false);
  const recordStartTimeRef = useRef<number>(0);
  const playbackTimeoutsRef = useRef<number[]>([]);

  const activeNotesRef = useRef(activeNotes);
  activeNotesRef.current = activeNotes;

  // Auto-detect tablet landscape orientation
  useEffect(() => {
    const isTabletLandscape = window.innerWidth >= 900 && window.innerWidth > window.innerHeight;
    if (isTabletLandscape) {
      setKeyWidth(72);
      setKeyHeightMode('tall');
      setTabletLayout('ergo');
    }
  }, []);

  // Listen to full screen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const handleChangeTabletLayout = useCallback((layout: TabletLayoutMode) => {
    setTabletLayout(layout);
    if (layout === 'ergo') {
      setKeyWidth(72);
      setKeyHeightMode('tall');
      setIsDualKeyboard(false);
    } else if (layout === 'stage') {
      setKeyWidth(82);
      setKeyHeightMode('maximum');
      setIsDualKeyboard(false);
    } else if (layout === 'dual') {
      setIsDualKeyboard(true);
    } else if (layout === 'fit') {
      setIsDualKeyboard(false);
    }
  }, []);

  const handleToggleDualKeyboard = useCallback(() => {
    setIsDualKeyboard((prev) => {
      const next = !prev;
      if (next) {
        setTabletLayout('dual');
      } else {
        setTabletLayout('ergo');
      }
      return next;
    });
  }, []);

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProgressMap(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save progress helper
  const handleLessonComplete = useCallback((progress: LessonProgress) => {
    setProgressMap((prev) => {
      const updated = {
        ...prev,
        [progress.lessonId]: progress,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Next lesson navigator
  const handleNextLesson = useCallback(() => {
    const allLessons = PIANO_ROADMAP.flatMap((ch) => ch.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex !== -1 && currentIndex + 1 < allLessons.length) {
      setActiveLesson(allLessons[currentIndex + 1]);
    }
  }, [activeLesson]);

  // Sustain pedal toggle
  const handleToggleSustain = useCallback(() => {
    setSustainPedal((prev) => {
      const next = !prev;
      soundEngine.setSustainPedal(next);
      return next;
    });
  }, []);

  // Note press handler
  const handleNotePress = useCallback((noteName: string, midi: number) => {
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.add(noteName);

      // Detect chord if 2+ notes active
      const midis = Array.from(next).map(noteNameToMidi);
      const chord = soundEngine.detectChord(midis);
      setDetectedChord(chord);

      return next;
    });

    setLastPlayedNote(noteName);
    setNoteEvent({ note: noteName, midi, timestamp: Date.now() });

    // If recording in Studio
    if (isRecording) {
      const time = Date.now() - recordStartTimeRef.current;
      setRecordedEvents((prev) => [...prev, { note: noteName, midi, time }]);
    }
  }, [isRecording]);

  // Note release handler
  const handleNoteRelease = useCallback((noteName: string) => {
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(noteName);

      const midis = Array.from(next).map(noteNameToMidi);
      const chord = soundEngine.detectChord(midis);
      setDetectedChord(chord);

      return next;
    });
  }, []);

  // Recording toggle
  const handleToggleRecord = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setRecordedEvents([]);
      recordStartTimeRef.current = Date.now();
      setIsRecording(true);
    }
  }, [isRecording]);

  // Playback toggle
  const handleTogglePlayRecording = useCallback(() => {
    if (isPlayingRecording) {
      playbackTimeoutsRef.current.forEach((t) => clearTimeout(t));
      playbackTimeoutsRef.current = [];
      setIsPlayingRecording(false);
      return;
    }

    if (recordedEvents.length === 0) return;

    setIsPlayingRecording(true);
    const maxTime = recordedEvents[recordedEvents.length - 1].time + 1000;

    recordedEvents.forEach((event) => {
      const t = window.setTimeout(() => {
        soundEngine.playNote(event.midi, 0.8);
        setActiveNotes(new Set([event.note]));
        setLastPlayedNote(event.note);

        setTimeout(() => {
          setActiveNotes((prev) => {
            const next = new Set(prev);
            next.delete(event.note);
            return next;
          });
        }, 300);
      }, event.time);

      playbackTimeoutsRef.current.push(t);
    });

    const endTimeout = window.setTimeout(() => {
      setIsPlayingRecording(false);
    }, maxTime);
    playbackTimeoutsRef.current.push(endTimeout);
  }, [isPlayingRecording, recordedEvents]);

  // Metronome interval
  useEffect(() => {
    if (!metronomeEnabled) {
      if (metronomeTimerRef.current) {
        clearInterval(metronomeTimerRef.current);
        metronomeTimerRef.current = null;
      }
      return;
    }

    const intervalMs = (60 / metronomeBpm) * 1000;
    metronomeBeatRef.current = 0;

    metronomeTimerRef.current = window.setInterval(() => {
      const isAccent = metronomeBeatRef.current % 4 === 0;
      soundEngine.playMetronomeTick(isAccent);
      metronomeBeatRef.current++;
    }, intervalMs);

    return () => {
      if (metronomeTimerRef.current) {
        clearInterval(metronomeTimerRef.current);
        metronomeTimerRef.current = null;
      }
    };
  }, [metronomeEnabled, metronomeBpm]);

  // Computer keyboard hotkeys listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      // Spacebar toggles sustain pedal
      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleSustain();
        return;
      }

      const key = e.key.toLowerCase();
      const mappedNote = KEYBOARD_SHORTCUTS[key];
      if (mappedNote && !activeNotesRef.current.has(mappedNote)) {
        const midi = noteNameToMidi(mappedNote);
        soundEngine.playNote(midi);
        handleNotePress(mappedNote, midi);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mappedNote = KEYBOARD_SHORTCUTS[key];
      if (mappedNote) {
        const midi = noteNameToMidi(mappedNote);
        soundEngine.releaseNote(midi);
        handleNoteRelease(mappedNote);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleNotePress, handleNoteRelease, handleToggleSustain]);

  // Web MIDI API integration (Hardware USB/Bluetooth MIDI Support)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;
    if (!nav.requestMIDIAccess) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let midiAccessObj: any = null;

    nav.requestMIDIAccess().then(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (midiAccess: any) => {
        midiAccessObj = midiAccess;
        const inputs = midiAccess.inputs.values();
        for (const input of inputs) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          input.onmidimessage = (message: { data: Uint8Array | number[] }) => {
            const [command, note, velocity] = message.data;
            if (command === 144 && velocity > 0) {
              const midi = note;
              soundEngine.playNote(midi, velocity / 127);
              const PITCHES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
              const p = PITCHES[midi % 12];
              const oct = Math.floor(midi / 12) - 1;
              handleNotePress(`${p}${oct}`, midi);
            } else if (command === 128 || (command === 144 && velocity === 0)) {
              soundEngine.releaseNote(note);
              const PITCHES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
              const p = PITCHES[note % 12];
              const oct = Math.floor(note / 12) - 1;
              handleNoteRelease(`${p}${oct}`);
            }
          };
        }
      },
      () => {}
    );

    return () => {
      if (midiAccessObj) {
        for (const input of midiAccessObj.inputs.values()) {
          input.onmidimessage = null;
        }
      }
    };
  }, [handleNotePress, handleNoteRelease]);

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex flex-col justify-between bg-[#121316] select-none text-neutral-100 ${
        isWideStripMode ? 'max-w-[1400px] mx-auto border-x border-black shadow-2xl' : ''
      }`}
    >
      {/* 1. Authentic Apple GarageBand Top Transport Bar */}
      <GarageBandHeader
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setHighlightedNotes([]);
        }}
        keyWidth={keyWidth}
        onChangeKeyWidth={setKeyWidth}
        labelMode={labelMode}
        onChangeLabelMode={setLabelMode}
        sustainPedal={sustainPedal}
        onToggleSustain={handleToggleSustain}
        metronomeBpm={metronomeBpm}
        onChangeMetronomeBpm={setMetronomeBpm}
        metronomeEnabled={metronomeEnabled}
        onToggleMetronome={() => setMetronomeEnabled(!metronomeEnabled)}
        volume={volume}
        onChangeVolume={(v) => {
          setVolume(v);
          soundEngine.setVolume(v);
        }}
        lastPlayedNote={lastPlayedNote}
        detectedChord={detectedChord}
        activeLessonTitle={activeLesson.title}
        isRecording={isRecording}
        isPlayingRecording={isPlayingRecording}
        onToggleRecord={handleToggleRecord}
        onTogglePlayRecording={handleTogglePlayRecording}
        hasRecording={recordedEvents.length > 0}
        onRewind={() => {
          soundEngine.setSustainPedal(false);
          setActiveNotes(new Set());
        }}
        isDrawerOpen={isDrawerOpen}
        onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        isWideStripMode={isWideStripMode}
        onToggleWideStripMode={() => {
          setIsWideStripMode((prev) => !prev);
          if (!isWideStripMode) {
            setKeyWidth(72);
          }
        }}
        tabletLayout={tabletLayout}
        onChangeTabletLayout={handleChangeTabletLayout}
        keyHeightMode={keyHeightMode}
        onChangeKeyHeightMode={setKeyHeightMode}
        isDualKeyboard={isDualKeyboard}
        onToggleDualKeyboard={handleToggleDualKeyboard}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        hapticSensitivity={hapticSensitivity}
        onChangeHapticSensitivity={handleHapticChange}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* 2. Middle Workstation / Pedagogical Deck */}
      <div className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden bg-[#101115]">
        {currentMode === 'roadmap' && (
          <LessonPlayer
            lesson={activeLesson}
            onLessonComplete={handleLessonComplete}
            onNextLesson={handleNextLesson}
            onOpenLibrary={() => setIsDrawerOpen(true)}
            noteEvent={noteEvent}
            onSetTargetNote={setTargetNote}
            onSetTargetFinger={setTargetFinger}
            isCompact={isWideStripMode || isDualKeyboard}
          />
        )}

        {currentMode === 'freeplay' && (
          <StudioPlayView
            detectedChord={detectedChord}
            lastPlayedNote={lastPlayedNote}
            activeNotes={activeNotes}
            onHighlightNotes={setHighlightedNotes}
          />
        )}

        {currentMode === 'drills' && (
          <DrillTrainer
            noteEvent={noteEvent}
            onSetTargetNote={setTargetNote}
            onSetTargetFinger={setTargetFinger}
          />
        )}

        {currentMode === 'chords' && (
          <ChordsScalesView
            onHighlightNotes={setHighlightedNotes}
          />
        )}
      </div>

      {/* 3. Library Drawer Modal */}
      <LibraryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeLessonId={activeLesson.id}
        progressMap={progressMap}
        onSelectLesson={(lesson) => {
          setActiveLesson(lesson);
          setCurrentMode('roadmap');
        }}
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
      />

      {/* Beginner Step-by-Step Guide Modal */}
      <BeginnerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* 4. Acoustic Piano Keybed (Single Keybed or GarageBand Dual Row Stack) */}
      <div className="w-full shrink-0 border-t border-black bg-[#0d0e11] z-20">
        <PianoKeyboard
          keyWidth={keyWidth}
          onChangeKeyWidth={setKeyWidth}
          labelMode={labelMode}
          targetNote={targetNote}
          targetFinger={targetFinger}
          highlightedNotes={highlightedNotes}
          activeNotes={activeNotes}
          onNotePress={handleNotePress}
          onNoteRelease={handleNoteRelease}
          octaveOffset={octaveOffset}
          onChangeOctave={setOctaveOffset}
          showShortcuts={labelMode === 'keyboard'}
          tabletLayout={tabletLayout}
          onChangeTabletLayout={handleChangeTabletLayout}
          keyHeightMode={keyHeightMode}
          onChangeKeyHeightMode={setKeyHeightMode}
          isDualKeyboard={isDualKeyboard}
          onToggleDualKeyboard={handleToggleDualKeyboard}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          hapticSensitivity={hapticSensitivity}
        />
      </div>
    </div>
  );
}

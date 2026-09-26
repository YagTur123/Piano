import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { NoteInfo, KeyLabelMode, FingerGuide, TabletLayoutMode, KeyHeightMode } from '../types/piano';
import { generatePianoKeys, noteNameToMidi } from '../utils/pianoUtils';
import { soundEngine } from '../audio/soundEngine';
import {
  Layers,
  Maximize2,
  Minimize2,
  Scan,
  Sparkles,
  Sliders,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface PianoKeyboardProps {
  keyWidth: number;
  onChangeKeyWidth?: (width: number) => void;
  labelMode: KeyLabelMode;
  targetNote?: string | null;
  targetFinger?: FingerGuide | null;
  highlightedNotes?: string[];
  activeNotes: Set<string>;
  onNotePress: (noteName: string, midi: number) => void;
  onNoteRelease: (noteName: string, midi: number) => void;
  octaveOffset: number;
  onChangeOctave: (offset: number) => void;
  showShortcuts?: boolean;
  // 13.1" Tablet Landscape Support
  tabletLayout?: TabletLayoutMode;
  onChangeTabletLayout?: (layout: TabletLayoutMode) => void;
  keyHeightMode?: KeyHeightMode;
  onChangeKeyHeightMode?: (mode: KeyHeightMode) => void;
  isDualKeyboard?: boolean;
  onToggleDualKeyboard?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  hapticSensitivity?: number;
}

interface KeyRipple {
  id: number;
  noteName: string;
  x: number;
  y: number;
  isBlack: boolean;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  keyWidth,
  onChangeKeyWidth,
  labelMode,
  targetNote,
  targetFinger,
  highlightedNotes = [],
  activeNotes,
  onNotePress,
  onNoteRelease,
  octaveOffset,
  onChangeOctave,
  tabletLayout = 'ergo',
  onChangeTabletLayout,
  keyHeightMode = 'tall',
  isDualKeyboard = false,
  onToggleDualKeyboard,
  isFullscreen = false,
  onToggleFullscreen,
  hapticSensitivity = 60,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dualUpperContainerRef = useRef<HTMLDivElement>(null);
  const dualLowerContainerRef = useRef<HTMLDivElement>(null);

  const isPointerDownRef = useRef(false);
  const activePointersRef = useRef<Map<number, string>>(new Map());
  const [touchMode, setTouchMode] = useState<'glissando' | 'scroll'>('glissando');

  // Container width state for "Ekrana Tam Sığdır" (Fit-to-Screen) on 13.1" tablet
  const [containerWidth, setContainerWidth] = useState<number>(1080);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Dual keyboard independent octave shifts (GarageBand style: Upper melody, Lower bass chords)
  const [dualUpperOctave, setDualUpperOctave] = useState<number>(1); // C4-C6
  const [dualLowerOctave, setDualLowerOctave] = useState<number>(-1); // C2-C4

  // Pitch Bend Wheel state (-1.0 to +1.0, 0 is center)
  const [pitchBend, setPitchBend] = useState<number>(0);
  const pitchBendDraggingRef = useRef<boolean>(false);
  const pitchBendStartYRef = useRef<number>(0);

  // Modulation Wheel state (0.0 to 1.0)
  const [modWheel, setModWheel] = useState<number>(0.2);
  const modWheelDraggingRef = useRef<boolean>(false);
  const modWheelStartYRef = useRef<number>(0);

  // Effective key width calculation based on 13.1" Tablet landscape mode
  const effectiveKeyWidth = useMemo(() => {
    if (tabletLayout === 'fit') {
      // 15 white keys = 2 full octaves (e.g. C3 to C5)
      // Fit them edge-to-edge into available container width
      return Math.max(54, Math.floor((containerWidth - 6) / 15));
    }
    // Directly respect keyWidth so user can enlarge keys with the slider freely
    return keyWidth;
  }, [tabletLayout, containerWidth, keyWidth]);

  // Key Height calculation optimized for 13.1" Tablet Landscape & wide fingers
  const whiteKeyHeight = useMemo(() => {
    if (isDualKeyboard) {
      // Two stacked keyboards share vertical height on 13.1" tablet
      return 150;
    }
    if (keyHeightMode === 'maximum') {
      return Math.max(240, Math.min(360, Math.round(effectiveKeyWidth * 3.4)));
    }
    if (keyHeightMode === 'tall') {
      // Standard 13.1" Tablet Ergonomic Height - deep acoustic keys
      return Math.max(220, Math.min(320, Math.round(effectiveKeyWidth * 3.0)));
    }
    // standard
    return Math.max(160, Math.min(260, Math.round(effectiveKeyWidth * 2.6)));
  }, [isDualKeyboard, keyHeightMode, effectiveKeyWidth]);

  const blackKeyWidth = Math.round(effectiveKeyWidth * 0.58);
  const blackKeyHeight = Math.round(whiteKeyHeight * 0.63);

  // Keys collections
  // 5 full octaves (C2=36 to C7=96) for single manual
  const allKeys = useMemo(() => generatePianoKeys(36, 96), []);
  const whiteKeys = useMemo(() => allKeys.filter((k) => !k.isSharp), [allKeys]);

  // Dual keyboard keys (2 octaves each)
  const dualUpperKeys = useMemo(() => {
    const startMidi = 60 + (dualUpperOctave - 1) * 12; // default C4 (60)
    return generatePianoKeys(startMidi, startMidi + 24); // 2 full octaves = 25 keys (15 white)
  }, [dualUpperOctave]);

  const dualLowerKeys = useMemo(() => {
    const startMidi = 36 + (dualLowerOctave + 1) * 12; // default C2 (36)
    return generatePianoKeys(startMidi, startMidi + 24);
  }, [dualLowerOctave]);

  // Visual tactile ripple state for responsive touch & press feedback
  const [ripples, setRipples] = useState<KeyRipple[]>([]);
  const nextRippleId = useRef<number>(0);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const triggerRipple = useCallback(
    (
      noteName: string,
      isBlack: boolean,
      clientX?: number,
      clientY?: number,
      targetElement?: HTMLElement | null
    ) => {
      let x: number;
      let y: number;

      if (targetElement && clientX !== undefined && clientY !== undefined) {
        const rect = targetElement.getBoundingClientRect();
        x = Math.max(10, Math.min(rect.width - 10, clientX - rect.left));
        y = Math.max(12, Math.min(rect.height - 12, clientY - rect.top));
      } else {
        x = isBlack ? blackKeyWidth / 2 : (effectiveKeyWidth - 1) / 2;
        y = isBlack ? blackKeyHeight * 0.72 : whiteKeyHeight * 0.76;
      }

      const newRipple: KeyRipple = {
        id: ++nextRippleId.current,
        noteName,
        x,
        y,
        isBlack,
      };

      setRipples((prev) => [...prev.slice(-40), newRipple]);
    },
    [blackKeyHeight, blackKeyWidth, effectiveKeyWidth, whiteKeyHeight]
  );

  // Trigger tactile ripples when activeNotes changes from external input (keyboard, MIDI, demo)
  const prevActiveNotesRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    activeNotes.forEach((noteName) => {
      if (!prevActiveNotesRef.current.has(noteName)) {
        const isBlack = noteName.includes('#');
        triggerRipple(noteName, isBlack);
      }
    });
    prevActiveNotesRef.current = new Set(activeNotes);
  }, [activeNotes, triggerRipple]);

  // Center keyboard view on Middle C (C4) on mount or octave change
  useEffect(() => {
    if (!containerRef.current || isDualKeyboard) return;
    const container = containerRef.current;

    if (tabletLayout === 'fit') {
      // In fit mode, scroll to starting octave (e.g. C3 if offset 0)
      const targetMidi = 48 + octaveOffset * 12; // C3
      const whiteKeyIndex = whiteKeys.findIndex((k) => k.midi >= targetMidi);
      if (whiteKeyIndex !== -1) {
        container.scrollTo({ left: whiteKeyIndex * effectiveKeyWidth, behavior: 'smooth' });
      }
      return;
    }

    const targetMidi = 60 + octaveOffset * 12;
    const whiteKeyIndex = whiteKeys.findIndex((k) => k.midi >= targetMidi);

    if (whiteKeyIndex !== -1) {
      const targetScrollLeft = whiteKeyIndex * effectiveKeyWidth - container.clientWidth / 2 + effectiveKeyWidth * 1.5;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth',
      });
    }
  }, [effectiveKeyWidth, octaveOffset, whiteKeys, isDualKeyboard, tabletLayout]);

  // Auto-scroll when targetNote is outside visible viewport
  useEffect(() => {
    if (!targetNote || !containerRef.current || isDualKeyboard) return;
    const targetMidi = noteNameToMidi(targetNote);
    const whiteKeyIndex = whiteKeys.findIndex((k) => k.midi >= targetMidi - 1);
    if (whiteKeyIndex !== -1) {
      const container = containerRef.current;
      const keyPos = whiteKeyIndex * effectiveKeyWidth;
      if (keyPos < container.scrollLeft + 60 || keyPos > container.scrollLeft + container.clientWidth - 140) {
        container.scrollTo({
          left: Math.max(0, keyPos - container.clientWidth / 2 + effectiveKeyWidth),
          behavior: 'smooth',
        });
      }
    }
  }, [targetNote, effectiveKeyWidth, whiteKeys, isDualKeyboard]);

  // Haptic feedback trigger for compatible touch/tablet hardware
  const triggerHapticFeedback = useCallback(
    (isGlissando = false) => {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator && hapticSensitivity > 0) {
        try {
          // Duration scaled by sensitivity (1% to 100%)
          // Range: 3ms to 35ms pulse
          const duration = isGlissando
            ? Math.max(2, Math.round((hapticSensitivity / 100) * 18))
            : Math.max(3, Math.round((hapticSensitivity / 100) * 35));
          navigator.vibrate(duration);
        } catch {
          // ignore
        }
      }
    },
    [hapticSensitivity]
  );

  // Pointer event handlers with multi-touch support & tactile ripple & physical haptic
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, key: NoteInfo) => {
      e.preventDefault();
      isPointerDownRef.current = true;
      activePointersRef.current.set(e.pointerId, key.noteName);
      soundEngine.playNote(key.midi);
      onNotePress(key.noteName, key.midi);
      triggerRipple(key.noteName, key.isSharp, e.clientX, e.clientY, e.currentTarget as HTMLElement);
      triggerHapticFeedback(false);
    },
    [onNotePress, triggerRipple, triggerHapticFeedback]
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent, key: NoteInfo) => {
      if (touchMode === 'glissando' && (e.buttons > 0 || isPointerDownRef.current)) {
        activePointersRef.current.set(e.pointerId, key.noteName);
        soundEngine.playNote(key.midi);
        onNotePress(key.noteName, key.midi);
        triggerRipple(key.noteName, key.isSharp, e.clientX, e.clientY, e.currentTarget as HTMLElement);
        triggerHapticFeedback(true);
      }
    },
    [onNotePress, touchMode, triggerRipple, triggerHapticFeedback]
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent, key: NoteInfo) => {
      if (activePointersRef.current.get(e.pointerId) === key.noteName) {
        activePointersRef.current.delete(e.pointerId);
        soundEngine.releaseNote(key.midi);
        onNoteRelease(key.noteName, key.midi);
      }
    },
    [onNoteRelease]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent, key: NoteInfo) => {
      activePointersRef.current.delete(e.pointerId);
      if (activePointersRef.current.size === 0) {
        isPointerDownRef.current = false;
      }
      soundEngine.releaseNote(key.midi);
      onNoteRelease(key.noteName, key.midi);
    },
    [onNoteRelease]
  );

  // Pitch Bend drag handler
  const handlePitchBendStart = (e: React.PointerEvent) => {
    e.preventDefault();
    pitchBendDraggingRef.current = true;
    pitchBendStartYRef.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePitchBendMove = (e: React.PointerEvent) => {
    if (!pitchBendDraggingRef.current) return;
    const deltaY = pitchBendStartYRef.current - e.clientY;
    const val = Math.max(-1, Math.min(1, deltaY / 45));
    setPitchBend(val);
  };

  const handlePitchBendEnd = (e: React.PointerEvent) => {
    if (!pitchBendDraggingRef.current) return;
    pitchBendDraggingRef.current = false;
    setPitchBend(0);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Modulation Wheel drag handler
  const handleModWheelStart = (e: React.PointerEvent) => {
    e.preventDefault();
    modWheelDraggingRef.current = true;
    modWheelStartYRef.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleModWheelMove = (e: React.PointerEvent) => {
    if (!modWheelDraggingRef.current) return;
    const deltaY = modWheelStartYRef.current - e.clientY;
    setModWheel((prev) => Math.max(0, Math.min(1, prev + deltaY / 100)));
    modWheelStartYRef.current = e.clientY;
  };

  const handleModWheelEnd = (e: React.PointerEvent) => {
    modWheelDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const getBlackKeyOffset = (pitch: string, baseLeft: number, kw: number) => {
    switch (pitch) {
      case 'C#':
        return baseLeft + kw * 0.62;
      case 'D#':
        return baseLeft + kw * 0.74;
      case 'F#':
        return baseLeft + kw * 0.58;
      case 'G#':
        return baseLeft + kw * 0.68;
      case 'A#':
        return baseLeft + kw * 0.76;
      default:
        return baseLeft + kw * 0.65;
    }
  };

  // Calculate coordinates for a collection of keys
  const buildKeyElements = useCallback(
    (keys: NoteInfo[], kw: number) => {
      let whiteIndex = 0;
      const whites: { key: NoteInfo; left: number }[] = [];
      const blacks: { key: NoteInfo; left: number }[] = [];

      keys.forEach((key) => {
        if (!key.isSharp) {
          whites.push({ key, left: whiteIndex * kw });
          whiteIndex++;
        } else {
          const lastWhiteLeft = (whiteIndex - 1) * kw;
          const left = getBlackKeyOffset(key.pitch, lastWhiteLeft, kw);
          blacks.push({ key, left });
        }
      });

      return { whiteKeyElements: whites, blackKeyElements: blacks, totalWidth: whiteIndex * kw };
    },
    []
  );

  const { whiteKeyElements, blackKeyElements, totalWidth } = useMemo(
    () => buildKeyElements(allKeys, effectiveKeyWidth),
    [allKeys, effectiveKeyWidth, buildKeyElements]
  );

  const upperManualLayout = useMemo(
    () => buildKeyElements(dualUpperKeys, effectiveKeyWidth),
    [dualUpperKeys, effectiveKeyWidth, buildKeyElements]
  );

  const lowerManualLayout = useMemo(
    () => buildKeyElements(dualLowerKeys, effectiveKeyWidth),
    [dualLowerKeys, effectiveKeyWidth, buildKeyElements]
  );

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const targetScroll = clickRatio * totalWidth - containerRef.current.clientWidth / 2;
    containerRef.current.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  };

  // Render a single keybed manual
  const renderKeybedManual = (
    wElements: { key: NoteInfo; left: number }[],
    bElements: { key: NoteInfo; left: number }[],
    manualWidth: number,
    manualHeight: number,
    manualRef?: React.RefObject<HTMLDivElement | null>
  ) => {
    const curBlackKeyWidth = Math.round(effectiveKeyWidth * 0.58);
    const curBlackKeyHeight = Math.round(manualHeight * 0.63);

    return (
      <div
        ref={manualRef}
        className={`flex-1 overflow-x-auto overflow-y-hidden relative bg-[#0e0f12] select-none ${
          touchMode === 'glissando' ? 'touch-none' : ''
        }`}
        style={{ WebkitOverflowScrolling: 'touch' }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          className="relative"
          style={{
            width: `${manualWidth}px`,
            height: `${manualHeight + 6}px`,
          }}
        >
          {/* White Keys */}
          {wElements.map(({ key, left }) => {
            const isPressed = activeNotes.has(key.noteName);
            const isTarget = targetNote === key.noteName;
            const isHighlighted = highlightedNotes.includes(key.noteName);
            const isMiddleC = key.noteName === 'C4';

            return (
              <div
                key={key.noteName}
                onPointerDown={(e) => handlePointerDown(e, key)}
                onPointerEnter={(e) => handlePointerEnter(e, key)}
                onPointerLeave={(e) => handlePointerLeave(e, key)}
                onPointerUp={(e) => handlePointerUp(e, key)}
                onPointerCancel={(e) => handlePointerUp(e, key)}
                style={{
                  left: `${left}px`,
                  width: `${effectiveKeyWidth - 1}px`,
                  height: `${manualHeight}px`,
                }}
                className={`
                  white-key absolute top-0 flex flex-col justify-end items-center pb-2.5 z-10 transition-colors overflow-hidden
                  ${isPressed ? 'active-pressed bg-[#ede8dc]' : ''}
                  ${isTarget && !isPressed ? 'ring-4 ring-inset ring-[#ff9f0a] bg-[#fff6e0] shadow-[0_0_22px_rgba(255,159,10,0.85)] z-15 animate-pulse' : ''}
                  ${isHighlighted && !isTarget && !isPressed ? 'bg-[#fff5e5]' : ''}
                `}
              >
                {/* Tactile Ripple Feedback Animations */}
                {ripples
                  .filter((r) => r.noteName === key.noteName)
                  .map((r) => (
                    <React.Fragment key={r.id}>
                      <div
                        className="key-ripple-effect key-ripple-white"
                        style={{ left: `${r.x}px`, top: `${r.y}px` }}
                        onAnimationEnd={() => removeRipple(r.id)}
                      />
                      <div
                        className="key-ripple-shockwave key-ripple-shockwave-white"
                        style={{ left: `${r.x}px`, top: `${r.y}px` }}
                      />
                    </React.Fragment>
                  ))}

                {/* Middle C Indicator Accent */}
                {isMiddleC && (
                  <div
                    className="absolute top-2 w-2 h-2 rounded-full bg-[#b45309] shadow-xs z-10"
                    title="Merkez Do (C4)"
                  />
                )}

                {/* Highly Visible Target Callout Indicator for Beginners */}
                {isTarget && (
                  <div className="absolute top-1/4 flex flex-col items-center pointer-events-none z-30 animate-bounce">
                    <div className="bg-[#b45309] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-1 whitespace-nowrap">
                      <span>👇 BASIN</span>
                    </div>
                    {targetFinger && (
                      <span className="text-[9px] font-bold text-amber-950 bg-amber-300 px-1.5 py-0.2 rounded-full mt-1 border border-amber-500 shadow-xs whitespace-nowrap">
                        {targetFinger.hand === 'R' ? 'Sağ' : 'Sol'} {targetFinger.finger}
                      </span>
                    )}
                  </div>
                )}

                {/* Key Label */}
                <div className="flex flex-col items-center gap-0.5 pointer-events-none relative z-10">
                  {labelMode === 'solfege' && (
                    <span className={`text-[12px] font-semibold ${isMiddleC ? 'text-[#b45309] font-bold' : 'text-neutral-800'}`}>
                      {key.solfege}
                      <span className="text-[9px] text-neutral-500 font-normal ml-0.5">{key.octave}</span>
                    </span>
                  )}

                  {labelMode === 'letters' && (
                    <span className={`text-[12px] font-bold font-mono ${isMiddleC ? 'text-[#b45309]' : 'text-neutral-800'}`}>
                      {key.noteName}
                    </span>
                  )}

                  {labelMode === 'keyboard' && (
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-semibold text-neutral-800">{key.pitch}</span>
                      {key.keyShortcut && (
                        <span className="text-[9px] px-1 bg-neutral-200 rounded text-neutral-700 font-mono font-medium">
                          {key.keyShortcut}
                        </span>
                      )}
                    </div>
                  )}

                  {labelMode === 'none' && isMiddleC && (
                    <span className="text-[10px] font-semibold text-neutral-500">C4</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Black Keys */}
          {bElements.map(({ key, left }) => {
            const isPressed = activeNotes.has(key.noteName);
            const isTarget = targetNote === key.noteName;
            const isHighlighted = highlightedNotes.includes(key.noteName);

            return (
              <div
                key={key.noteName}
                onPointerDown={(e) => handlePointerDown(e, key)}
                onPointerEnter={(e) => handlePointerEnter(e, key)}
                onPointerLeave={(e) => handlePointerLeave(e, key)}
                onPointerUp={(e) => handlePointerUp(e, key)}
                onPointerCancel={(e) => handlePointerUp(e, key)}
                style={{
                  left: `${left}px`,
                  width: `${curBlackKeyWidth}px`,
                  height: `${curBlackKeyHeight}px`,
                }}
                className={`
                  black-key absolute top-0 flex flex-col justify-end items-center pb-2 z-20 overflow-hidden
                  ${isPressed ? 'active-pressed' : ''}
                  ${isTarget && !isPressed ? 'ring-4 ring-inset ring-[#ff9f0a] bg-[#2a2418] shadow-[0_0_20px_rgba(255,159,10,0.9)] animate-pulse' : ''}
                  ${isHighlighted && !isTarget && !isPressed ? 'ring-1 ring-[#ff9f0a]/60' : ''}
                `}
              >
                {/* Tactile Ripple Feedback Animations */}
                {ripples
                  .filter((r) => r.noteName === key.noteName)
                  .map((r) => (
                    <React.Fragment key={r.id}>
                      <div
                        className="key-ripple-effect key-ripple-black"
                        style={{ left: `${r.x}px`, top: `${r.y}px` }}
                        onAnimationEnd={() => removeRipple(r.id)}
                      />
                      <div
                        className="key-ripple-shockwave key-ripple-shockwave-black"
                        style={{ left: `${r.x}px`, top: `${r.y}px` }}
                      />
                    </React.Fragment>
                  ))}

                {/* Highly Visible Target Callout Indicator on Black Key */}
                {isTarget && (
                  <div className="absolute top-1/4 flex flex-col items-center pointer-events-none z-30 animate-bounce">
                    <div className="bg-[#b45309] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-amber-300 whitespace-nowrap">
                      <span>👇 BAS</span>
                    </div>
                    {targetFinger && (
                      <span className="text-[8px] font-bold text-amber-200 mt-0.5 whitespace-nowrap">
                        {targetFinger.hand === 'R' ? 'S' : 'Sol'}{targetFinger.finger}
                      </span>
                    )}
                  </div>
                )}

                {/* Black Key Labels */}
                <div className="flex flex-col items-center pointer-events-none pb-0.5 relative z-10">
                  {labelMode === 'solfege' && (
                    <span className="text-[10px] font-medium text-neutral-300">
                      {key.solfege}
                    </span>
                  )}
                  {labelMode === 'letters' && (
                    <span className="text-[10px] font-mono text-neutral-300">
                      {key.pitch}
                    </span>
                  )}
                  {labelMode === 'keyboard' && key.keyShortcut && (
                    <span className="text-[8px] px-1 bg-neutral-700 rounded text-neutral-200 font-mono">
                      {key.keyShortcut}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full select-none shrink-0 bg-[#0f1013] touch-none">
      {/* Wood Fallboard with Apple GarageBand styling + 13.1" Tablet controls */}
      <div className="wood-fallboard h-9 w-full flex items-center justify-between px-2 sm:px-4 border-b border-black relative z-20">
        {/* Brand Inscription + 13.1" Tablet Badge */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a] shadow-[0_0_4px_#ff9f0a]" />
          <span className="text-[11px] font-serif font-bold tracking-[0.14em] text-[#d4af37] uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            Steinway & Sons
          </span>
          <span className="text-[9px] text-[#9e843b] font-mono hidden md:inline tracking-wider">
            · 13.1" TABLET YATAY
          </span>
        </div>

        {/* 13.1" Tablet Ergonomic Quick Presets */}
        <div className="flex items-center gap-1.5">
          {/* Live Finger Size / Key Width Enlarger Slider directly on Fallboard */}
          {onChangeKeyWidth && (
            <div
              className="flex items-center gap-1.5 bg-[#121316] px-2 py-0.5 rounded-md border border-[#2b2d35] shadow-inner"
              title="Parmaklarınıza göre tuş genişliğini büyütün veya küçültün"
            >
              <span className="text-[9px] font-semibold text-neutral-400 hidden xl:inline">Tuş Boyutu:</span>
              <button
                onClick={() => {
                  const next = Math.max(46, effectiveKeyWidth - 6);
                  onChangeKeyWidth(next);
                  onChangeTabletLayout?.('custom');
                }}
                className="w-5 h-5 rounded flex items-center justify-center text-neutral-300 hover:text-white bg-[#1c1d22] border border-[#2a2c34] text-xs font-mono font-bold"
                title="Tuşları Küçült (-6px)"
              >
                -
              </button>
              <input
                type="range"
                min="48"
                max="130"
                step="2"
                value={effectiveKeyWidth}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onChangeKeyWidth(val);
                  onChangeTabletLayout?.('custom');
                }}
                className="w-16 sm:w-28 accent-amber-500 cursor-pointer h-1.5"
              />
              <button
                onClick={() => {
                  const next = Math.min(130, effectiveKeyWidth + 6);
                  onChangeKeyWidth(next);
                  onChangeTabletLayout?.('custom');
                }}
                className="w-5 h-5 rounded flex items-center justify-center text-neutral-300 hover:text-white bg-[#1c1d22] border border-[#2a2c34] text-xs font-mono font-bold"
                title="Tuşları Büyüt (+6px)"
              >
                +
              </button>
              <span className="font-mono text-[10px] text-amber-300 font-bold min-w-[34px] text-right">
                {effectiveKeyWidth}px
              </span>
            </div>
          )}

          {/* Dual Row Keyboard Toggle (GarageBand iPad signature feature) */}
          {onToggleDualKeyboard && (
            <button
              onClick={onToggleDualKeyboard}
              className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 transition-all border ${
                isDualKeyboard
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/80 shadow-xs'
                  : 'bg-[#15161a] border-[#292b33] text-neutral-400 hover:text-white'
              }`}
              title="Çift Katlı Klavye: Üstte melodi, altta bas akorlar (GarageBand)"
            >
              <Layers className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Çift Kat</span>
            </button>
          )}

          {/* Fit 2-Octaves to screen toggle */}
          {onChangeTabletLayout && (
            <button
              onClick={() => onChangeTabletLayout(tabletLayout === 'fit' ? 'ergo' : 'fit')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 transition-all border ${
                tabletLayout === 'fit'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/80 shadow-xs'
                  : 'bg-[#15161a] border-[#292b33] text-neutral-400 hover:text-white'
              }`}
              title="13.1 inç Ekrana Tam Sığdır (15 Beyaz Tuş C3-C5 sıfır kaydırma)"
            >
              <Scan className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Sığdır</span>
            </button>
          )}

          {/* 72px Ergonomic standard button */}
          {onChangeTabletLayout && (
            <button
              onClick={() => onChangeTabletLayout('ergo')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 transition-all border ${
                tabletLayout === 'ergo' && !isDualKeyboard
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/80 shadow-xs'
                  : 'bg-[#15161a] border-[#292b33] text-neutral-400 hover:text-white'
              }`}
              title="13.1 inç Doğal Parmak Boyutu (72px)"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">72px</span>
            </button>
          )}

          {/* Fullscreen Button */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 transition-all border ${
                isFullscreen
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/80'
                  : 'bg-[#15161a] border-[#292b33] text-neutral-400 hover:text-white'
              }`}
              title="Tam Ekran (Tarayıcı çubuklarını gizler)"
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span className="hidden md:inline">{isFullscreen ? 'Normal' : 'Tam Ekran'}</span>
            </button>
          )}
        </div>

        {/* Right side: Minimap Ribbon & Glissando / Scroll Switch */}
        <div className="flex items-center gap-2">
          {!isDualKeyboard && (
            <div
              onClick={handleMinimapClick}
              className="cursor-pointer h-4 w-28 sm:w-40 bg-black/75 rounded border border-[#2b2416] relative overflow-hidden flex items-center px-1 shadow-inner"
              title="Tüm klavyeyi kaydırmak için dokunun"
            >
              <div className="w-full flex justify-between text-[7px] text-[#ff9f0a]/50 font-mono font-bold">
                <span>C2</span>
                <span>C3</span>
                <span className="text-[#ff9f0a]">C4</span>
                <span>C5</span>
                <span>C6</span>
                <span>C7</span>
              </div>
              <div
                className="absolute top-0 bottom-0 w-8 bg-[#ff9f0a]/20 border border-[#ff9f0a]/60 rounded-xs pointer-events-none"
                style={{
                  left: `${Math.max(0, Math.min(80, (octaveOffset + 2) * 20))}%`,
                }}
              />
            </div>
          )}

          {/* Glissando vs Scroll Rocker Switch */}
          <div className="flex items-center gap-1 bg-[#121316] p-0.5 rounded-md border border-[#262830]">
            <button
              onClick={() => setTouchMode('glissando')}
              className={`px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase transition-all ${
                touchMode === 'glissando'
                  ? 'bg-[#30271c] text-[#ffb340] border border-[#ff9f0a]/60 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Glissando: Parmağı kaydırarak piyano çal"
            >
              Glissando
            </button>
            <button
              onClick={() => setTouchMode('scroll')}
              className={`px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase transition-all ${
                touchMode === 'scroll'
                  ? 'bg-[#30271c] text-[#ffb340] border border-[#ff9f0a]/60 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Kaydır: Klavyeyi sağa-sola sürükle"
            >
              Kaydır
            </button>
          </div>
        </div>
      </div>

      {/* Red Velvet Felt Damper Strip */}
      <div className="felt-strip h-1.5 w-full relative z-20" />

      {/* Keyboard Assembly: Single Manual vs Dual Manual Mode */}
      {!isDualKeyboard ? (
        /* SINGLE MANUAL ASSEMBLY */
        <div className="flex w-full relative bg-[#0e0f12]">
          {/* Authentic GarageBand Left Controller Panel */}
          <div
            className="w-16 sm:w-20 bg-[#16171b] border-r border-[#101114] shrink-0 flex flex-col justify-between items-center py-2 px-1 select-none z-20 shadow-xl"
            style={{ height: `${whiteKeyHeight + 6}px` }}
          >
            {/* Octave Transposition Controller with LEDs */}
            <div className="flex flex-col items-center gap-1 w-full bg-[#101114] py-1.5 rounded-md border border-[#23252d]">
              <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400">
                OKTAV
              </span>

              {/* 5 Octave LED dots (-2, -1, 0, +1, +2) */}
              <div className="flex items-center gap-1 my-0.5">
                {[-2, -1, 0, 1, 2].map((val) => (
                  <div
                    key={val}
                    className={`w-1.5 h-1.5 rounded-full ${
                      octaveOffset === val
                        ? 'bg-[#ff9f0a] shadow-[0_0_5px_#ff9f0a]'
                        : 'bg-[#2a2d35]'
                    }`}
                  />
                ))}
              </div>

              {/* +/- Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onChangeOctave(Math.max(-2, octaveOffset - 1))}
                  disabled={octaveOffset <= -2}
                  className="gb-btn w-6 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center disabled:opacity-30"
                  title="1 Oktav Aşağı"
                >
                  -
                </button>
                <button
                  onClick={() => onChangeOctave(Math.min(2, octaveOffset + 1))}
                  disabled={octaveOffset >= 2}
                  className="gb-btn w-6 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center disabled:opacity-30"
                  title="1 Oktav Yukarı"
                >
                  +
                </button>
              </div>
            </div>

            {/* Performance Wheels Container (Pitch Bend & Modulation) */}
            <div className="flex items-center justify-center gap-1.5 w-full mt-1">
              {/* Pitch Bend Wheel (Spring-loaded) */}
              <div className="flex flex-col items-center">
                <span className="text-[7px] font-mono uppercase text-neutral-400 mb-0.5">PITCH</span>
                <div
                  onPointerDown={handlePitchBendStart}
                  onPointerMove={handlePitchBendMove}
                  onPointerUp={handlePitchBendEnd}
                  onPointerCancel={handlePitchBendEnd}
                  className="w-5 sm:w-6 h-18 sm:h-20 rubber-wheel rounded cursor-ns-resize flex items-center justify-center relative touch-none"
                  title="Pitch Bend (Yukarı/Aşağı çekin)"
                >
                  <div
                    className="w-full h-1 bg-[#ff9f0a] shadow-[0_0_4px_#ff9f0a] rounded-full pointer-events-none transition-transform duration-75"
                    style={{
                      transform: `translateY(${-pitchBend * 25}px)`,
                    }}
                  />
                </div>
              </div>

              {/* Modulation Wheel */}
              <div className="flex flex-col items-center">
                <span className="text-[7px] font-mono uppercase text-neutral-400 mb-0.5">MOD</span>
                <div
                  onPointerDown={handleModWheelStart}
                  onPointerMove={handleModWheelMove}
                  onPointerUp={handleModWheelEnd}
                  onPointerCancel={handleModWheelEnd}
                  className="w-5 sm:w-6 h-18 sm:h-20 rubber-wheel rounded cursor-ns-resize flex items-end justify-center relative touch-none"
                  title="Modulation Wheel"
                >
                  <div
                    className="w-full h-1 bg-[#0a84ff] shadow-[0_0_4px_#0a84ff] rounded-full pointer-events-none transition-transform duration-75"
                    style={{
                      transform: `translateY(${-(modWheel - 0.5) * 50}px)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Keybed */}
          {renderKeybedManual(whiteKeyElements, blackKeyElements, totalWidth, whiteKeyHeight, containerRef)}
        </div>
      ) : (
        /* DUAL MANUAL ASSEMBLY (GarageBand iPad Pro 2-Tier Stack) */
        <div className="flex flex-col w-full relative bg-[#0e0f12]">
          {/* Upper Manual: Melodic Right-Hand (C4 - C6) */}
          <div className="flex w-full relative border-b border-black">
            {/* Upper Octave Controls */}
            <div className="w-14 sm:w-16 bg-[#16171b] border-r border-[#101114] shrink-0 flex flex-col justify-center items-center py-1 px-1 z-20">
              <span className="text-[7px] font-mono text-amber-400 uppercase tracking-widest font-bold">ÜST KAT</span>
              <span className="text-[8px] font-mono text-neutral-300">C{3 + dualUpperOctave}</span>
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={() => setDualUpperOctave((prev) => Math.max(-1, prev - 1))}
                  className="gb-btn w-5 h-5 rounded text-[9px] font-bold"
                >
                  -
                </button>
                <button
                  onClick={() => setDualUpperOctave((prev) => Math.min(2, prev + 1))}
                  className="gb-btn w-5 h-5 rounded text-[9px] font-bold"
                >
                  +
                </button>
              </div>
            </div>
            {renderKeybedManual(
              upperManualLayout.whiteKeyElements,
              upperManualLayout.blackKeyElements,
              upperManualLayout.totalWidth,
              whiteKeyHeight,
              dualUpperContainerRef
            )}
          </div>

          {/* Middle Wood & Velvet Divider */}
          <div className="w-full h-2.5 bg-gradient-to-r from-[#1c1511] via-[#2c1d14] to-[#1c1511] flex items-center justify-center border-y border-black relative z-20 shadow-md">
            <div className="felt-strip h-1 w-full" />
          </div>

          {/* Lower Manual: Bass Chords Left-Hand (C2 - C4) */}
          <div className="flex w-full relative">
            {/* Lower Octave Controls */}
            <div className="w-14 sm:w-16 bg-[#16171b] border-r border-[#101114] shrink-0 flex flex-col justify-center items-center py-1 px-1 z-20">
              <span className="text-[7px] font-mono text-amber-400 uppercase tracking-widest font-bold">ALT KAT</span>
              <span className="text-[8px] font-mono text-neutral-300">C{3 + dualLowerOctave}</span>
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={() => setDualLowerOctave((prev) => Math.max(-2, prev - 1))}
                  className="gb-btn w-5 h-5 rounded text-[9px] font-bold"
                >
                  -
                </button>
                <button
                  onClick={() => setDualLowerOctave((prev) => Math.min(1, prev + 1))}
                  className="gb-btn w-5 h-5 rounded text-[9px] font-bold"
                >
                  +
                </button>
              </div>
            </div>
            {renderKeybedManual(
              lowerManualLayout.whiteKeyElements,
              lowerManualLayout.blackKeyElements,
              lowerManualLayout.totalWidth,
              whiteKeyHeight,
              dualLowerContainerRef
            )}
          </div>
        </div>
      )}
    </div>
  );
};

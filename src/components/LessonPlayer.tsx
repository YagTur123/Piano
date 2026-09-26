import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lesson, LessonProgress, NotePlayEvent } from '../types/piano';
import { soundEngine } from '../audio/soundEngine';
import { noteNameToMidi, noteNameToSolfege, getFingerTurkishName } from '../utils/pianoUtils';
import { SheetMusicDisplay } from './SheetMusicDisplay';
import { BeginnerGuideModal } from './BeginnerGuideModal';
import {
  Play,
  RotateCcw,
  CheckCircle,
  ChevronRight,
  Square,
  HelpCircle,
  Info,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LessonPlayerProps {
  lesson: Lesson;
  onLessonComplete: (progress: LessonProgress) => void;
  onNextLesson?: () => void;
  onOpenLibrary?: () => void;
  noteEvent?: NotePlayEvent | null;
  onSetTargetNote: (note: string | null) => void;
  onSetTargetFinger: (finger: { hand: 'L' | 'R'; finger: 1 | 2 | 3 | 4 | 5 } | null) => void;
  isCompact?: boolean;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  onLessonComplete,
  onNextLesson,
  noteEvent,
  onSetTargetNote,
  onSetTargetFinger,
}) => {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [correctHits, setCorrectHits] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionStats, setCompletionStats] = useState<{ score: number; stars: number } | null>(null);

  // Beginner Help & Explanations state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [liveFeedback, setLiveFeedback] = useState<{
    type: 'idle' | 'success' | 'mistake';
    message: string;
  }>({
    type: 'idle',
    message: 'Aşağıdaki piyano klavyesinde sarı/turuncu çerçeveyle parlayan tuşa basın.',
  });

  const demoTimeoutsRef = useRef<number[]>([]);
  const lastProcessedTimestampRef = useRef<number>(0);

  const mistakesRef = useRef(0);
  mistakesRef.current = mistakes;
  const correctHitsRef = useRef(0);
  correctHitsRef.current = correctHits;
  const currentNoteIndexRef = useRef(0);
  currentNoteIndexRef.current = currentNoteIndex;

  const currentTarget = lesson.notes[currentNoteIndex];

  // Update target note and finger for keyboard highlighting
  useEffect(() => {
    if (isCompleted || !currentTarget) {
      onSetTargetNote(null);
      onSetTargetFinger(null);
    } else {
      onSetTargetNote(currentTarget.note);
      onSetTargetFinger(currentTarget.finger || null);
    }
  }, [currentTarget, isCompleted, onSetTargetNote, onSetTargetFinger]);

  // Restart lesson
  const handleRestart = useCallback(() => {
    demoTimeoutsRef.current.forEach((t) => clearTimeout(t));
    demoTimeoutsRef.current = [];
    setIsPlayingDemo(false);

    currentNoteIndexRef.current = 0;
    mistakesRef.current = 0;
    correctHitsRef.current = 0;
    lastProcessedTimestampRef.current = 0;

    setCurrentNoteIndex(0);
    setMistakes(0);
    setCorrectHits(0);
    setIsCompleted(false);
    setCompletionStats(null);
    setLiveFeedback({
      type: 'idle',
      message: 'Aşağıdaki piyano klavyesinde sarı/turuncu çerçeveyle parlayan tuşa basın.',
    });
  }, []);

  // When lesson changes, reset
  useEffect(() => {
    handleRestart();
  }, [lesson.id, handleRestart]);

  // Handle note press with interactive feedback
  useEffect(() => {
    if (!noteEvent) return;
    if (noteEvent.timestamp <= lastProcessedTimestampRef.current) return;
    lastProcessedTimestampRef.current = noteEvent.timestamp;

    if (isCompleted || isPlayingDemo) return;

    const currentIdx = currentNoteIndexRef.current;
    const target = lesson.notes[currentIdx];
    if (!target) return;

    if (noteEvent.note === target.note) {
      const newCorrect = correctHitsRef.current + 1;
      correctHitsRef.current = newCorrect;
      setCorrectHits(newCorrect);

      setLiveFeedback({
        type: 'success',
        message: `✨ Harika! Doğru bastınız: ${noteNameToSolfege(target.note)} (${target.note})`,
      });

      const nextIndex = currentIdx + 1;
      if (nextIndex >= lesson.notes.length) {
        // Lesson finished
        const totalNotes = lesson.notes.length;
        const curMistakes = mistakesRef.current;
        const accuracy = Math.max(0, Math.round(((totalNotes - curMistakes) / totalNotes) * 100));
        let stars = 1;
        if (accuracy >= 90) stars = 3;
        else if (accuracy >= 70) stars = 2;

        setCompletionStats({ score: accuracy, stars });
        setIsCompleted(true);

        onLessonComplete({
          lessonId: lesson.id,
          completed: true,
          stars,
          highScore: accuracy,
          lastPlayedAt: Date.now(),
        });
      } else {
        currentNoteIndexRef.current = nextIndex;
        setCurrentNoteIndex(nextIndex);
      }
    } else {
      const newMistakes = mistakesRef.current + 1;
      mistakesRef.current = newMistakes;
      setMistakes(newMistakes);

      setLiveFeedback({
        type: 'mistake',
        message: `⚠️ Yanlış tuş (${noteNameToSolfege(noteEvent.note)}). Lütfen aşağıdaki parlayan ${noteNameToSolfege(target.note)} (${target.note}) tuşuna dokunun!`,
      });
    }
  }, [noteEvent, isCompleted, isPlayingDemo, lesson, onLessonComplete]);

  // Play audio demonstration
  const handlePlayDemo = () => {
    if (isPlayingDemo) {
      demoTimeoutsRef.current.forEach((t) => clearTimeout(t));
      demoTimeoutsRef.current = [];
      setIsPlayingDemo(false);
      return;
    }

    setIsPlayingDemo(true);
    let currentTimeMs = 0;
    const beatDurationMs = (60 / lesson.tempo) * 1000;

    lesson.notes.forEach((item, index) => {
      const timeoutId = window.setTimeout(() => {
        const midi = noteNameToMidi(item.note);
        soundEngine.playNote(midi, 0.75);
        setCurrentNoteIndex(index);

        if (index === lesson.notes.length - 1) {
          const endTimeout = window.setTimeout(() => {
            setIsPlayingDemo(false);
            setCurrentNoteIndex(0);
          }, item.duration * beatDurationMs);
          demoTimeoutsRef.current.push(endTimeout);
        }
      }, currentTimeMs);

      demoTimeoutsRef.current.push(timeoutId);
      currentTimeMs += item.duration * beatDurationMs;
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#131417] select-none relative">
      {/* 1. Upper Lesson Control Bar with Prominent "Nasıl Çalınır?" Button */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-2 bg-[#191b20] border-b border-[#24262c] shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5 truncate">
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#24262e] text-[#ff9f0a] border border-[#ff9f0a]/30">
            Ders {lesson.number}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
            {lesson.title}
          </span>
        </div>

        {/* Action Buttons: Beginner Help, Lesson Tips, Demo & Restart */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Beginner Help Modal Trigger */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 flex items-center gap-1.5 transition-all shadow-xs"
            title="Piyanoda ne yapacağınızı ve nasıl çalınacağını adım adım öğrenin"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Ne Yapmalıyım?</span>
          </button>

          {/* Toggle Tips & Objective */}
          <button
            onClick={() => setShowTips((prev) => !prev)}
            className={`gb-btn h-7 px-2 sm:px-2.5 rounded-md text-xs font-medium flex items-center gap-1 text-neutral-300 ${
              showTips ? 'gb-btn-active text-amber-300' : ''
            }`}
            title="Ders hedefi ve ipuçlarını göster"
          >
            <Info className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">İpuçları</span>
            {showTips ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Play/Stop Audio Demo */}
          <button
            onClick={handlePlayDemo}
            className={`gb-btn h-7 px-2 sm:px-2.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${
              isPlayingDemo ? 'gb-btn-active' : ''
            }`}
            title="Parçanın doğru sesini ve ritmini önce dinleyin"
          >
            {isPlayingDemo ? (
              <>
                <Square className="w-3 h-3 fill-current text-[#0a84ff]" />
                <span className="hidden sm:inline">Durdur</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current text-[#ff9f0a]" />
                <span className="hidden sm:inline">Örnek Dinle</span>
              </>
            )}
          </button>

          {/* Restart Button */}
          <button
            onClick={handleRestart}
            className="gb-btn h-7 w-7 rounded-md flex items-center justify-center text-neutral-300"
            title="Dersi Baştan Al"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Coach Banner: Tells the user exactly what to do RIGHT NOW! */}
      <div className="px-3 sm:px-5 py-2 bg-[#16181f] border-b border-[#252833] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>

          <div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 flex-wrap">
              <span>Şu Anda:</span>
              {currentTarget?.finger ? (
                <span className="text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-500/50 font-mono">
                  {getFingerTurkishName(currentTarget.finger.finger, currentTarget.finger.hand)}
                </span>
              ) : (
                <span className="text-amber-400">Doğru parmağınızla</span>
              )}
              <span>ile aşağıdaki parlayan</span>
              <span className="text-[#38bdf8] font-bold underline font-mono text-sm">
                {currentTarget ? `${noteNameToSolfege(currentTarget.note)} (${currentTarget.note})` : 'Son Nota'}
              </span>
              <span>tuşuna dokunun!</span>
            </div>

            {/* Live Interactive Feedback message */}
            <div
              className={`text-[11px] mt-0.5 font-medium transition-all ${
                liveFeedback.type === 'mistake'
                  ? 'text-red-400 font-semibold'
                  : liveFeedback.type === 'success'
                  ? 'text-emerald-400 font-semibold'
                  : 'text-neutral-400'
              }`}
            >
              {liveFeedback.message}
            </div>
          </div>
        </div>

        {/* Progress Counters */}
        <div className="flex items-center gap-3 self-end sm:self-center font-mono text-xs text-neutral-400 shrink-0">
          <div className="px-2 py-0.5 rounded bg-[#101114] border border-[#2b2d38]">
            Nota: <strong className="text-white">{currentNoteIndex + 1}/{lesson.notes.length}</strong>
          </div>
          <div className="px-2 py-0.5 rounded bg-[#101114] border border-[#2b2d38]">
            Hata: <strong className={mistakes > 0 ? 'text-amber-400' : 'text-neutral-300'}>{mistakes}</strong>
          </div>
        </div>
      </div>

      {/* 3. Collapsible Detailed Lesson Tips & Objective card */}
      {showTips && (
        <div className="px-4 py-3 bg-[#181a22] border-b border-[#2d303d] text-xs space-y-2 animate-fadeIn shrink-0">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold shrink-0">🎯 Ders Hedefi:</span>
            <span className="text-neutral-200">{lesson.objective}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold shrink-0">🖐️ El Pozisyonu:</span>
            <span className="text-neutral-300">{lesson.handGuide}</span>
          </div>
          {lesson.tips && lesson.tips.length > 0 && (
            <div className="pt-1 border-t border-[#232631]">
              <span className="text-amber-400 font-bold block mb-1">💡 İpuçları:</span>
              <ul className="list-disc list-inside space-y-0.5 text-neutral-300 text-[11px]">
                {lesson.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 4. Musical Score Display */}
      <div className="flex-1 flex flex-col justify-center min-h-[90px] overflow-hidden">
        <SheetMusicDisplay
          notes={lesson.notes}
          currentIndex={currentNoteIndex}
          tempo={lesson.tempo}
          timeSignature={lesson.timeSignature}
          isPlaying={isPlayingDemo}
        />
      </div>

      {/* 5. Completion Banner */}
      {isCompleted && completionStats && (
        <div className="bg-[#181510] border-t border-[#ff9f0a]/60 px-4 py-2.5 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#ff9f0a]" />
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">
                Tebrikler! Ders Tamamlandı!
              </span>
              <span className="text-[11px] text-amber-300">
                %{completionStats.score} Doğruluk · {'★'.repeat(completionStats.stars)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="gb-btn h-8 px-3 rounded-md text-xs font-medium"
            >
              Tekrar Çal
            </button>
            {onNextLesson && (
              <button
                onClick={onNextLesson}
                className="gb-btn gb-btn-active h-8 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Sonraki Ders</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Beginner Guide Modal */}
      <BeginnerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onStartDemo={handlePlayDemo}
      />
    </div>
  );
};

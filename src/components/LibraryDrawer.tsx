import React, { useState } from 'react';
import { PIANO_ROADMAP } from '../data/roadmapData';
import { Lesson, LessonProgress } from '../types/piano';
import {
  X,
  BookOpen,
  Activity,
  Layers,
  CheckCircle2,
  Circle,
  Play,
} from 'lucide-react';
import { AppMode } from './GarageBandHeader';

interface LibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeLessonId: string;
  progressMap: Record<string, LessonProgress>;
  onSelectLesson: (lesson: Lesson) => void;
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const LibraryDrawer: React.FC<LibraryDrawerProps> = ({
  isOpen,
  onClose,
  activeLessonId,
  progressMap,
  onSelectLesson,
  onSelectMode,
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'drills' | 'chords'>('roadmap');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative z-10 w-full max-w-md bg-[#16171b] border-r border-[#262830] shadow-2xl flex flex-col h-full text-neutral-200">
        {/* Drawer Header */}
        <div className="gb-topbar h-12 px-4 flex items-center justify-between border-b border-[#1b1c22] shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#ff9f0a]" />
            <span className="font-semibold text-xs tracking-wider text-white uppercase">
              Piyano Kütüphanesi
            </span>
          </div>

          <button
            onClick={onClose}
            className="gb-btn w-7 h-7 rounded-md flex items-center justify-center text-neutral-300"
            title="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#101114] border-b border-[#202228] p-1 shrink-0">
          <button
            onClick={() => {
              setActiveTab('roadmap');
              onSelectMode('roadmap');
            }}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'roadmap'
                ? 'bg-[#292c34] text-white shadow-xs border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dersler</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('drills');
              onSelectMode('drills');
            }}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'drills'
                ? 'bg-[#292c34] text-white shadow-xs border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Hanon</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('chords');
              onSelectMode('chords');
            }}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'chords'
                ? 'bg-[#292c34] text-white shadow-xs border border-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Akorlar</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {activeTab === 'roadmap' && (
            <div className="space-y-3">
              {PIANO_ROADMAP.map((chapter) => (
                <div key={chapter.id} className="bg-[#121317] rounded-lg border border-[#23252d] p-2.5">
                  <div className="pb-1.5 border-b border-[#1f2129]">
                    <span className="text-[9px] font-mono font-medium text-[#ff9f0a] uppercase tracking-wider">
                      Bölüm {chapter.number} · {chapter.level}
                    </span>
                    <h3 className="text-xs font-semibold text-white mt-0.5">{chapter.title}</h3>
                  </div>

                  <div className="mt-2 space-y-1">
                    {chapter.lessons.map((lesson) => {
                      const isSelected = activeLessonId === lesson.id;
                      const progress = progressMap[lesson.id];
                      const isDone = progress?.completed;

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            onSelectLesson(lesson);
                            onSelectMode('roadmap');
                            onClose();
                          }}
                          className={`p-2 rounded-md flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#27231c] border border-[#ff9f0a]/60 text-white'
                              : 'bg-[#18191e] hover:bg-[#20222a] border border-[#262832] text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158] shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                            )}
                            <div>
                              <div className="text-xs font-medium leading-tight">
                                {lesson.number}. {lesson.title}
                              </div>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {lesson.timeSignature} · {lesson.notes.length} Nota
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {progress?.stars ? (
                              <span className="text-[#ff9f0a] text-xs">
                                {'★'.repeat(progress.stars)}
                              </span>
                            ) : null}
                            <Play className="w-3 h-3 text-[#ff9f0a] opacity-75" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'drills' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400 bg-[#121317] p-3 rounded-lg border border-[#23252d]">
                Piyano el kuvveti, parmak bağımsızlığı ve tuş hassasiyeti için temel Hanon virtüöz egzersizleri.
              </p>
              <button
                onClick={() => {
                  onSelectMode('drills');
                  onClose();
                }}
                className="w-full gb-btn gb-btn-active py-2.5 rounded-lg text-xs font-semibold"
              >
                Hanon Egzersizlerini Aç
              </button>
            </div>
          )}

          {activeTab === 'chords' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400 bg-[#121317] p-3 rounded-lg border border-[#23252d]">
                Popüler majör, minör ve 7'li akorlar ile temel gamların klavye parmak pozisyonları.
              </p>
              <button
                onClick={() => {
                  onSelectMode('chords');
                  onClose();
                }}
                className="w-full gb-btn gb-btn-active py-2.5 rounded-lg text-xs font-semibold"
              >
                Akor & Gam Sözlüğünü Aç
              </button>
            </div>
          )}
        </div>

        <div className="p-2.5 bg-[#101114] border-t border-[#1f2128] text-[10px] text-neutral-500 font-mono text-center">
          Pianoforte Studio · GarageBand Grand Piano
        </div>
      </div>
    </div>
  );
};

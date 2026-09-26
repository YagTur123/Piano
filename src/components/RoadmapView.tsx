import React from 'react';
import { PIANO_ROADMAP } from '../data/roadmapData';
import { Lesson, LessonProgress } from '../types/piano';
import { CheckCircle2, Circle, Play, Star, BookOpen, Award } from 'lucide-react';

interface RoadmapViewProps {
  progressMap: Record<string, LessonProgress>;
  activeLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  progressMap,
  activeLessonId,
  onSelectLesson,
}) => {
  // Compute overall stats
  const totalLessons = PIANO_ROADMAP.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const completedLessons = Object.values(progressMap).filter((p) => p.completed).length;
  const overallPercentage = Math.round((completedLessons / totalLessons) * 100);
  const totalStars = Object.values(progressMap).reduce((acc, p) => acc + (p.stars || 0), 0);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 mb-1">
            <Award className="w-4 h-4" />
            <span>Piyano Öğrenme Yol Haritası</span>
            <span>·</span>
            <span className="text-neutral-400">Sıfırdan İleri Seviyeye</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">
            Adım Adım Piyano Müfredatı
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Temel oturuş ve parmak numaralarından başlayarak Hanon virtüöz egzersizlerine, akor armonisine ve ölümsüz klasik eserlere uzanan yapılandırılmış piyano rehberi.
          </p>
        </div>

        {/* Progress Stat Rings / Cards */}
        <div className="flex items-center gap-3 shrink-0 bg-neutral-950/80 p-3 rounded-xl border border-neutral-800">
          <div className="flex flex-col items-center px-2">
            <span className="text-xs text-neutral-400">Tamamlanan</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {completedLessons} / {totalLessons}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">%{overallPercentage}</span>
          </div>

          <div className="w-px h-8 bg-neutral-800" />

          <div className="flex flex-col items-center px-2">
            <span className="text-xs text-neutral-400">Yıldızlar</span>
            <span className="text-xl font-bold font-mono text-amber-300 flex items-center gap-0.5">
              <span>{totalStars}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Maks {totalLessons * 3}</span>
          </div>
        </div>
      </div>

      {/* Chapters Timeline List */}
      <div className="flex flex-col gap-6">
        {PIANO_ROADMAP.map((chapter) => {
          const chapterCompleted = chapter.lessons.filter((l) => progressMap[l.id]?.completed).length;
          const chapterTotal = chapter.lessons.length;
          const isDone = chapterCompleted === chapterTotal;

          return (
            <div
              key={chapter.id}
              className="bg-neutral-900/80 border border-neutral-800/90 rounded-2xl p-5 flex flex-col gap-4 shadow-md"
            >
              {/* Chapter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Bölüm {chapter.number}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">{chapter.level} Seviye</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-100 mt-1">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{chapter.description}</p>
                </div>

                <div className="text-xs font-mono text-neutral-400 shrink-0">
                  {chapterCompleted} / {chapterTotal} Tamamlandı
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {chapter.lessons.map((lesson) => {
                  const progress = progressMap[lesson.id];
                  const completed = progress?.completed;
                  const stars = progress?.stars || 0;
                  const isCurrent = activeLessonId === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson)}
                      className={`
                        p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left relative group
                        ${
                          isCurrent
                            ? 'bg-amber-950/40 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
                            : completed
                            ? 'bg-neutral-950/60 border-neutral-800 hover:border-amber-700/60'
                            : 'bg-neutral-950/40 border-neutral-850 hover:border-neutral-700'
                        }
                      `}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-mono text-amber-400/90 font-semibold">
                            Ders {lesson.number} · {lesson.subtitle}
                          </span>
                          {completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-neutral-600 shrink-0" />
                          )}
                        </div>

                        <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-amber-200 transition-colors line-clamp-1">
                          {lesson.title}
                        </h4>

                        <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                          {lesson.objective}
                        </p>
                      </div>

                      {/* Footer: Stars & Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-xs">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < stars
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-700'
                              }`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                          <Play className="w-3 h-3 fill-amber-400" />
                          <span>{completed ? 'Tekrar Et' : isCurrent ? 'Çalışılıyor' : 'Başla'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Play,
  Square,
  RotateCcw,
  BookOpen,
  Sliders,
  Volume2,
  Maximize2,
  Minimize2,
  Tablet,
  Layers,
  Scan,
  Sparkles,
  Activity,
  HelpCircle,
} from 'lucide-react';
import { KeyLabelMode, TabletLayoutMode, KeyHeightMode } from '../types/piano';

export type AppMode = 'roadmap' | 'freeplay' | 'drills' | 'chords';

interface GarageBandHeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  keyWidth: number;
  onChangeKeyWidth: (width: number) => void;
  labelMode: KeyLabelMode;
  onChangeLabelMode: (mode: KeyLabelMode) => void;
  sustainPedal: boolean;
  onToggleSustain: () => void;
  metronomeBpm: number;
  onChangeMetronomeBpm: (bpm: number) => void;
  metronomeEnabled: boolean;
  onToggleMetronome: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  lastPlayedNote: string | null;
  detectedChord: string | null;
  activeLessonTitle?: string;
  isRecording?: boolean;
  isPlayingRecording?: boolean;
  onToggleRecord?: () => void;
  onTogglePlayRecording?: () => void;
  hasRecording?: boolean;
  onRewind?: () => void;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  isWideStripMode: boolean;
  onToggleWideStripMode: () => void;
  // 13.1" Tablet Landscape Props
  tabletLayout?: TabletLayoutMode;
  onChangeTabletLayout?: (layout: TabletLayoutMode) => void;
  keyHeightMode?: KeyHeightMode;
  onChangeKeyHeightMode?: (mode: KeyHeightMode) => void;
  isDualKeyboard?: boolean;
  onToggleDualKeyboard?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  hapticSensitivity?: number;
  onChangeHapticSensitivity?: (val: number) => void;
  onOpenGuide?: () => void;
}

export const GarageBandHeader: React.FC<GarageBandHeaderProps> = ({
  currentMode,
  onSelectMode,
  keyWidth,
  onChangeKeyWidth,
  labelMode,
  onChangeLabelMode,
  sustainPedal,
  onToggleSustain,
  metronomeBpm,
  onChangeMetronomeBpm,
  metronomeEnabled,
  onToggleMetronome,
  volume,
  onChangeVolume,
  lastPlayedNote,
  detectedChord,
  activeLessonTitle,
  isRecording = false,
  isPlayingRecording = false,
  onToggleRecord,
  onTogglePlayRecording,
  hasRecording = false,
  onRewind,
  isDrawerOpen,
  onToggleDrawer,
  isWideStripMode,
  onToggleWideStripMode,
  tabletLayout = 'ergo',
  onChangeTabletLayout,
  keyHeightMode = 'tall',
  onChangeKeyHeightMode,
  isDualKeyboard = false,
  onToggleDualKeyboard,
  isFullscreen = false,
  onToggleFullscreen,
  hapticSensitivity = 60,
  onChangeHapticSensitivity,
  onOpenGuide,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="w-full gb-topbar select-none z-30 shrink-0">
      <div className="h-12 px-2 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left Section: Library Toggle & Segmented View Switch */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Library / Lessons Drawer Button */}
          <button
            onClick={onToggleDrawer}
            className={`gb-btn h-8 px-2 sm:px-2.5 rounded-md flex items-center gap-1.5 text-xs font-medium ${
              isDrawerOpen ? 'gb-btn-active' : ''
            }`}
            title="Müfredat ve Ders Kütüphanesi"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Kütüphane</span>
          </button>

          {/* Beginner Guide "Nasıl Çalınır?" Button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="gb-btn h-8 px-2 sm:px-2.5 rounded-md flex items-center gap-1.5 text-xs font-semibold text-amber-300 border-amber-500/40 bg-amber-950/40 hover:bg-amber-950/70 shadow-xs"
              title="Piyanoda ne yapacağınızı ve nasıl çalınacağını adım adım öğrenin"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Nasıl Çalınır?</span>
            </button>
          )}

          {/* Segmented Mode Selector - Authentic Apple Rounded Segmented Control */}
          <div className="flex items-center bg-[#151619] p-0.5 rounded-md border border-[#2a2c32] shadow-inner">
            {[
              { id: 'roadmap', label: 'Ders' },
              { id: 'freeplay', label: 'Stüdyo' },
              { id: 'drills', label: 'Hanon' },
              { id: 'chords', label: 'Akor' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectMode(tab.id as AppMode)}
                className={`px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-medium transition-all ${
                  currentMode === tab.id
                    ? 'bg-[#32353c] text-white shadow-xs border border-white/10'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Authentic Apple GarageBand LCD Display */}
        <div className="gb-lcd px-2.5 sm:px-4 py-1 rounded-md flex items-center gap-2.5 sm:gap-4 justify-center text-center shrink-0 min-w-[190px] sm:min-w-[280px]">
          {/* Measure / Beat */}
          <div className="flex flex-col items-center">
            <span className="text-[7px] font-mono tracking-widest text-[#ff9f0a]/75 uppercase">
              BAR.BEAT
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-[#ffb340] tracking-wider drop-shadow-[0_0_6px_rgba(255,159,10,0.3)]">
              001. 1
            </span>
          </div>

          <div className="w-px h-5 bg-[#252b33]" />

          {/* Note / Chord / Mode Status */}
          <div className="flex flex-col items-center">
            <span className="text-[7px] font-mono tracking-widest text-[#ff9f0a]/75 uppercase">
              {detectedChord ? 'AKOR' : 'STATÜ'}
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-wide truncate max-w-[85px] sm:max-w-[130px]">
              {detectedChord || (lastPlayedNote ? `${lastPlayedNote}` : activeLessonTitle || 'Do Majör')}
            </span>
          </div>

          <div className="w-px h-5 bg-[#252b33]" />

          {/* Tempo BPM */}
          <div className="flex flex-col items-center">
            <span className="text-[7px] font-mono tracking-widest text-[#ff9f0a]/75 uppercase">
              TEMPO
            </span>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-xs sm:text-sm font-bold text-[#ffb340] drop-shadow-[0_0_6px_rgba(255,159,10,0.3)]">
                {metronomeBpm}
              </span>
              <span className="text-[8px] text-[#ff9f0a]/75">BPM</span>
            </div>
          </div>
        </div>

        {/* Right Section: Circular Transport Controls & 13.1" Tablet Quick Settings */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Rewind Button */}
          {onRewind && (
            <button
              onClick={onRewind}
              className="gb-transport-btn w-7 sm:w-8 h-7 sm:h-8"
              title="Başa Al (Rewind)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Play/Stop Button */}
          {onTogglePlayRecording && hasRecording && (
            <button
              onClick={onTogglePlayRecording}
              className={`gb-transport-btn w-7 sm:w-8 h-7 sm:h-8 ${
                isPlayingRecording ? 'gb-transport-play-active' : ''
              }`}
              title="Kaydı Dinle / Durdur"
            >
              {isPlayingRecording ? (
                <Square className="w-3 h-3 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>
          )}

          {/* Record Button (Red Circular Transport) */}
          {onToggleRecord && (
            <button
              onClick={onToggleRecord}
              className={`gb-transport-btn w-7 sm:w-8 h-7 sm:h-8 ${
                isRecording ? 'gb-transport-rec-active' : ''
              }`}
              title="Kayıt (Record)"
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  isRecording ? 'bg-[#ff453a]' : 'bg-[#e03131]'
                }`}
              />
            </button>
          )}

          {/* Metronome Button */}
          <button
            onClick={onToggleMetronome}
            className={`gb-btn h-8 px-2 rounded-md flex items-center gap-1.5 text-xs font-medium ${
              metronomeEnabled ? 'gb-btn-active' : ''
            }`}
            title="Metronom (Tık-Tak)"
          >
            <div className={`led-dot ${metronomeEnabled ? 'led-cyan' : ''}`} />
            <span className="hidden xl:inline text-[11px]">Metronom</span>
          </button>

          {/* Sustain Pedal Button */}
          <button
            onClick={onToggleSustain}
            className={`gb-btn h-8 px-2 rounded-md flex items-center gap-1.5 text-xs font-medium ${
              sustainPedal ? 'gb-btn-active' : ''
            }`}
            title="Sustain Pedalı [Boşluk Tuşu]"
          >
            <div className={`led-dot ${sustainPedal ? 'led-amber' : ''}`} />
            <span className="hidden xl:inline text-[11px]">Sustain</span>
          </button>

          {/* Master Volume Slider */}
          <div className="hidden 2xl:flex items-center gap-1.5 bg-[#17181c] px-2 py-1 rounded-md border border-[#2b2d34]">
            <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="w-16 accent-amber-500 cursor-pointer h-1.5 bg-neutral-800"
              title="Ana Ses Çıkışı"
            />
          </div>

          {/* 13.1" Tablet Mode Badge / Quick Switch */}
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className={`gb-btn h-8 px-2 sm:px-2.5 rounded-md flex items-center gap-1.5 text-xs font-medium ${
              tabletLayout === 'ergo' || tabletLayout === 'fit' || isDualKeyboard ? 'gb-btn-active text-amber-300' : ''
            }`}
            title="13.1 inç Tablet Yatay Modu Ayarları"
          >
            <Tablet className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px] font-semibold">13.1"</span>
            <div className="led-dot led-amber" />
          </button>

          {/* Fullscreen Button */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className={`gb-btn h-8 px-2 rounded-md flex items-center gap-1 text-[11px] font-medium ${
                isFullscreen ? 'gb-btn-active text-amber-300' : ''
              }`}
              title={isFullscreen ? 'Normal Görünüme Dön' : '13.1" Tablet Tam Ekran Yap'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              className={`gb-btn h-8 px-2 rounded-md flex items-center gap-1 text-xs font-medium ${
                showSettings ? 'gb-btn-active' : ''
              }`}
              title="Tuş Boyutu ve Gösterim Ayarları"
            >
              <Sliders className="w-3.5 h-3.5 text-neutral-300" />
            </button>

            {/* Settings Flyout */}
            {showSettings && (
              <div className="absolute right-0 top-10 w-80 bg-[#1b1c21] border border-[#32343c] rounded-xl p-3.5 shadow-2xl z-50 text-neutral-200">
                <div className="text-xs font-semibold text-white pb-2.5 border-b border-[#2b2d35] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Tablet className="w-4 h-4 text-amber-400" />
                    <span>13.1" Tablet Yatay Modu</span>
                  </div>
                  <span className="font-mono text-amber-400 text-[11px]">{keyWidth}px</span>
                </div>

                <div className="mt-3 space-y-3.5">
                  {/* 13.1" Tablet Specific Quick Layout Presets */}
                  <div>
                    <label className="text-[11px] font-semibold text-amber-300 block mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      13.1" Tablet Düzeni:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          onChangeTabletLayout?.('ergo');
                          onChangeKeyWidth(72);
                          onChangeKeyHeightMode?.('tall');
                        }}
                        className={`p-2 rounded-lg text-left border transition-all ${
                          tabletLayout === 'ergo' && !isDualKeyboard
                            ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-xs'
                            : 'bg-black/30 border-[#32343c] text-neutral-300 hover:text-white'
                        }`}
                      >
                        <div className="text-[11px] font-bold">🖐️ 72px Ergonomik</div>
                        <div className="text-[9px] text-neutral-400 mt-0.5">Doğal parmak aralığı</div>
                      </button>

                      <button
                        onClick={() => {
                          onChangeTabletLayout?.('fit');
                          onChangeKeyHeightMode?.('tall');
                        }}
                        className={`p-2 rounded-lg text-left border transition-all ${
                          tabletLayout === 'fit' && !isDualKeyboard
                            ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-xs'
                            : 'bg-black/30 border-[#32343c] text-neutral-300 hover:text-white'
                        }`}
                      >
                        <div className="text-[11px] font-bold">📐 2 Oktav Sığdır</div>
                        <div className="text-[9px] text-neutral-400 mt-0.5">C3-C5 tam ekran (kaydırmasız)</div>
                      </button>

                      <button
                        onClick={() => {
                          onToggleDualKeyboard?.();
                        }}
                        className={`p-2 rounded-lg text-left border transition-all ${
                          isDualKeyboard
                            ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-xs'
                            : 'bg-black/30 border-[#32343c] text-neutral-300 hover:text-white'
                        }`}
                      >
                        <div className="text-[11px] font-bold">🎹 Çift Katlı Klavye</div>
                        <div className="text-[9px] text-neutral-400 mt-0.5">GarageBand 2-katlı stili</div>
                      </button>

                      <button
                        onClick={() => {
                          onChangeTabletLayout?.('stage');
                          onChangeKeyWidth(82);
                          onChangeKeyHeightMode?.('maximum');
                        }}
                        className={`p-2 rounded-lg text-left border transition-all ${
                          tabletLayout === 'stage' && !isDualKeyboard
                            ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-xs'
                            : 'bg-black/30 border-[#32343c] text-neutral-300 hover:text-white'
                        }`}
                      >
                        <div className="text-[11px] font-bold">⚡ 82px Sahne</div>
                        <div className="text-[9px] text-neutral-400 mt-0.5">Ekstra geniş tuşlar</div>
                      </button>
                    </div>
                  </div>

                  {/* Key Height (Derinlik) Setting */}
                  {!isDualKeyboard && (
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">
                        Tuş Yüksekliği (Akustik Derinlik):
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'standard', label: 'Standart (210px)' },
                          { id: 'tall', label: 'Derin (250px)' },
                          { id: 'maximum', label: 'Maksimum (280px)' },
                        ].map((h) => (
                          <button
                            key={h.id}
                            onClick={() => onChangeKeyHeightMode?.(h.id as KeyHeightMode)}
                            className={`py-1 px-1.5 rounded text-[10px] font-medium border text-center transition-all ${
                              keyHeightMode === h.id
                                ? 'bg-amber-950/80 text-amber-200 border-amber-500/80'
                                : 'bg-black/30 border-[#32343c] text-neutral-400 hover:text-white'
                            }`}
                          >
                            {h.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Manual Key Width / Finger Size Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-semibold text-neutral-300">
                        Parmak & Tuş Genişliği (Büyüt / Küçült):
                      </label>
                      <span className="font-mono text-xs text-amber-400 font-bold bg-[#141518] px-2 py-0.5 rounded border border-[#2b2d35]">
                        {keyWidth} px
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const next = Math.max(48, keyWidth - 6);
                          onChangeTabletLayout?.('custom');
                          onChangeKeyWidth(next);
                        }}
                        className="gb-btn w-7 h-7 rounded text-xs font-mono font-bold flex items-center justify-center shrink-0"
                        title="Tuşları Küçült (-6px)"
                      >
                        -
                      </button>

                      <input
                        type="range"
                        min="48"
                        max="136"
                        step="2"
                        value={keyWidth}
                        onChange={(e) => {
                          onChangeTabletLayout?.('custom');
                          onChangeKeyWidth(parseInt(e.target.value, 10));
                        }}
                        className="flex-1 accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded"
                        title="Tuş genişliğini parmaklarınıza göre büyütün"
                      />

                      <button
                        onClick={() => {
                          const next = Math.min(136, keyWidth + 6);
                          onChangeTabletLayout?.('custom');
                          onChangeKeyWidth(next);
                        }}
                        className="gb-btn w-7 h-7 rounded text-xs font-mono font-bold flex items-center justify-center shrink-0"
                        title="Tuşları Büyüt (+6px)"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex justify-between text-[9px] font-mono text-neutral-500 mt-1">
                      <span>48px (İnce)</span>
                      <span>72px (Standart)</span>
                      <span>96px (Geniş)</span>
                      <span>136px (Dev)</span>
                    </div>

                    {/* Quick Finger Size Presets */}
                    <div className="grid grid-cols-4 gap-1 mt-1.5">
                      {[
                        { label: '72px Standart', val: 72 },
                        { label: '90px Geniş', val: 90 },
                        { label: '110px Büyük', val: 110 },
                        { label: '130px Dev', val: 130 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          onClick={() => {
                            onChangeTabletLayout?.('custom');
                            onChangeKeyWidth(preset.val);
                          }}
                          className={`py-1 rounded text-[10px] font-medium border transition-all text-center ${
                            keyWidth === preset.val
                              ? 'bg-amber-950/80 text-amber-200 border-amber-500/80 shadow-xs'
                              : 'bg-black/30 border-[#32343c] text-neutral-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Label Mode */}
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">
                      Tuş Notaları:
                    </label>
                    <select
                      value={labelMode}
                      onChange={(e) => onChangeLabelMode(e.target.value as KeyLabelMode)}
                      className="w-full bg-[#131417] border border-[#32343c] text-neutral-200 text-xs rounded px-2 py-1.5 focus:outline-none"
                    >
                      <option value="solfege">Do - Re - Mi (Solfej)</option>
                      <option value="letters">C - D - E (Harf Notasyonu)</option>
                      <option value="keyboard">Klavye Tuşları (A, S, D...)</option>
                      <option value="none">Sade (Etiketsiz)</option>
                    </select>
                  </div>

                  {/* Haptic Sensitivity (Dokunsal Titreşim) Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-amber-400" />
                        <span>Haptik Titreşim Hassasiyeti:</span>
                      </label>
                      <span className="font-mono text-xs text-amber-400 font-bold">
                        {hapticSensitivity === 0 ? 'Kapalı' : `%${hapticSensitivity}`}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={hapticSensitivity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onChangeHapticSensitivity?.(val);
                        if (typeof navigator !== 'undefined' && 'vibrate' in navigator && val > 0) {
                          try {
                            navigator.vibrate(Math.max(3, Math.round((val / 100) * 35)));
                          } catch {
                            // ignore
                          }
                        }
                      }}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded"
                      title="Uyumlu tabletlerde dokunsal tuş titreşim şiddetini ayarlar"
                    />

                    <div className="flex justify-between text-[9px] font-mono text-neutral-500 mt-1">
                      <span>Kapalı (%0)</span>
                      <span>Hafif (%30)</span>
                      <span>Doğal (%65)</span>
                      <span>Güçlü (%100)</span>
                    </div>

                    {/* Quick Haptic Presets */}
                    <div className="grid grid-cols-4 gap-1 mt-1.5">
                      {[
                        { label: 'Kapalı', val: 0 },
                        { label: 'Hafif', val: 30 },
                        { label: 'Doğal', val: 65 },
                        { label: 'Güçlü', val: 100 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          onClick={() => {
                            onChangeHapticSensitivity?.(preset.val);
                            if (typeof navigator !== 'undefined' && 'vibrate' in navigator && preset.val > 0) {
                              try {
                                navigator.vibrate(Math.max(3, Math.round((preset.val / 100) * 35)));
                              } catch {
                                // ignore
                              }
                            }
                          }}
                          className={`py-1 rounded text-[10px] font-medium border transition-all text-center ${
                            hapticSensitivity === preset.val
                              ? 'bg-amber-950/80 text-amber-200 border-amber-500/80 shadow-xs'
                              : 'bg-black/30 border-[#32343c] text-neutral-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="text-[9px] text-neutral-500 mt-1 leading-tight">
                      Uyumlu tablet donanımlarında (Android vb.) tuşa dokunulduğunda gerçekçi fiziksel titreşim verir.
                    </div>
                  </div>

                  {/* Metronome Tempo */}
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">
                      Metronom Hızı (BPM):
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onChangeMetronomeBpm(Math.max(40, metronomeBpm - 5))}
                        className="gb-btn px-2.5 py-1 rounded text-xs font-mono font-bold"
                      >
                        -5
                      </button>
                      <input
                        type="range"
                        min="40"
                        max="220"
                        value={metronomeBpm}
                        onChange={(e) => onChangeMetronomeBpm(parseInt(e.target.value, 10))}
                        className="flex-1 accent-amber-500 cursor-pointer h-1.5"
                      />
                      <button
                        onClick={() => onChangeMetronomeBpm(Math.min(220, metronomeBpm + 5))}
                        className="gb-btn px-2.5 py-1 rounded text-xs font-mono font-bold"
                      >
                        +5
                      </button>
                    </div>
                  </div>

                  {/* Fullscreen Button */}
                  {onToggleFullscreen && (
                    <button
                      onClick={onToggleFullscreen}
                      className="w-full gb-btn py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 text-amber-300 border-amber-500/50"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      <span>{isFullscreen ? 'Tam Ekrandan Çık' : '13.1" Tam Ekran Modunu Başlat'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

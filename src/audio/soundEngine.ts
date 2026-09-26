/**
 * High-Fidelity Acoustic Piano Sound Engine
 * Emulates an acoustic Grand Piano (GarageBand style) using the Web Audio API.
 * Features:
 * - Multi-harmonic additive string modeling with piano inharmonicity
 * - Hammer-strike felt transient emulation
 * - Frequency-dependent natural decay & release
 * - Damper pedal (sustain) with realistic string resonance
 * - Stereo panning & room reverb simulation
 * - Metronome click generator
 * - Real-time chord detector
 */

export interface ActiveVoice {
  gainNode: GainNode;
  filterNode: BiquadFilterNode;
  stopVoice: () => void;
  midi: number;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private activeVoices: Map<number, ActiveVoice> = new Map();
  private sustainPedalDown: boolean = false;
  private sustainedNotes: Set<number> = new Set();
  private metronomeTimer: number | null = null;
  private volume: number = 0.85;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Reverb simulation network
      this.convolver = this.createSyntheticImpulseResponse(this.ctx, 1.8, 2.2);
      this.reverbGain = this.ctx.createGain();
      this.reverbGain.gain.setValueAtTime(0.28, this.ctx.currentTime); // GarageBand studio reverb level

      this.dryGain = this.ctx.createGain();
      this.dryGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      if (this.convolver) {
        this.convolver.connect(this.reverbGain);
        this.reverbGain.connect(this.masterGain);
      }
      this.dryGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Generates a smooth acoustic room impulse response for realistic grand piano body resonance
   */
  private createSyntheticImpulseResponse(ctx: AudioContext, duration: number, decay: number): ConvolverNode {
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * duration);
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const t = i / rate;
      const envelope = Math.exp(-t * decay);
      // Diffused stereo reflections
      left[i] = (Math.random() * 2 - 1) * envelope;
      right[i] = (Math.random() * 2 - 1) * envelope;
    }

    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public setSustainPedal(down: boolean) {
    this.sustainPedalDown = down;
    if (!down) {
      // Damp all sustained notes that are not physically held
      this.sustainedNotes.forEach((midi) => {
        const voice = this.activeVoices.get(midi);
        if (voice) {
          voice.stopVoice();
          this.activeVoices.delete(midi);
        }
      });
      this.sustainedNotes.clear();
    }
  }

  public getSustainPedal(): boolean {
    return this.sustainPedalDown;
  }

  /**
   * Plays a realistic acoustic piano note
   */
  public playNote(midi: number, velocity: number = 0.8) {
    this.initContext();
    if (!this.ctx || !this.dryGain || !this.convolver) return;

    // If already playing this midi note, stop the previous instance gently
    if (this.activeVoices.has(midi)) {
      const prev = this.activeVoices.get(midi)!;
      prev.stopVoice();
      this.activeVoices.delete(midi);
    }

    const now = this.ctx.currentTime;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);

    // Stereo panning based on piano keyboard layout (bass on left, treble on right)
    const panNode = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panNode) {
      // midi 21 (A0) to midi 108 (C8) mapped to -0.6 to +0.6
      const pan = Math.max(-0.65, Math.min(0.65, ((midi - 60) / 48) * 0.8));
      panNode.pan.setValueAtTime(pan, now);
    }

    // Dynamic Tone filter: Grand piano hammers hit brighter at higher velocities
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoff = Math.min(16000, freq * (3.5 + velocity * 5.0));
    filter.frequency.setValueAtTime(cutoff, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 1.8), now + 3.0);

    // Note Gain Envelope
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);
    // Instant hammer attack (3ms)
    noteGain.gain.linearRampToValueAtTime(velocity * 0.9, now + 0.004);

    // Natural decay (bass strings ring much longer than short treble strings)
    const naturalDecay = Math.max(1.8, Math.min(6.5, 7.5 - (midi / 127) * 4.5));
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + naturalDecay);

    // Route audio through pan, dry, and convolution room reverb
    if (panNode) {
      noteGain.connect(filter);
      filter.connect(panNode);
      panNode.connect(this.dryGain);
      panNode.connect(this.convolver);
    } else {
      noteGain.connect(filter);
      filter.connect(this.dryGain);
      filter.connect(this.convolver);
    }

    // Acoustic Harmonics:
    // Pianos have inharmonicity due to wire stiffness
    const harmonics = [
      { mult: 1.0, gain: 1.0, type: 'triangle' as OscillatorType },
      { mult: 2.003, gain: 0.55, type: 'sine' as OscillatorType },
      { mult: 3.01, gain: 0.35, type: 'sine' as OscillatorType },
      { mult: 4.02, gain: 0.18, type: 'sine' as OscillatorType },
      { mult: 5.035, gain: 0.08, type: 'sine' as OscillatorType },
      { mult: 6.05, gain: 0.04, type: 'sine' as OscillatorType },
    ];

    const oscs: OscillatorNode[] = [];

    harmonics.forEach((h) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = h.type;
      osc.frequency.setValueAtTime(freq * h.mult, now);

      const hGain = this.ctx.createGain();
      hGain.gain.setValueAtTime(h.gain, now);

      // Higher harmonics decay quicker than fundamental
      const hDecay = naturalDecay / (h.mult * 0.75 + 0.25);
      hGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.4, hDecay));

      osc.connect(hGain);
      hGain.connect(noteGain);
      osc.start(now);
      oscs.push(osc);
    });

    // Hammer-strike transient noise (the felt hitting the copper/steel wire)
    this.createHammerTransient(this.ctx, noteGain, now, freq, velocity);

    const stopVoice = () => {
      if (!this.ctx) return;
      const releaseTime = this.ctx.currentTime;
      // Realistic acoustic damper release: note fades out over 120ms
      noteGain.gain.cancelScheduledValues(releaseTime);
      noteGain.gain.setValueAtTime(noteGain.gain.value, releaseTime);
      noteGain.gain.exponentialRampToValueAtTime(0.00001, releaseTime + 0.14);

      setTimeout(() => {
        oscs.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch {
            // ignore if already stopped
          }
        });
        noteGain.disconnect();
      }, 200);
    };

    this.activeVoices.set(midi, {
      gainNode: noteGain,
      filterNode: filter,
      stopVoice,
      midi,
    });
  }

  /**
   * Adds the distinctive tactile hammer thump transient
   */
  private createHammerTransient(ctx: AudioContext, destination: GainNode, now: number, fundamentalFreq: number, velocity: number) {
    const bufferSize = Math.floor(ctx.sampleRate * 0.025); // 25ms thump
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(Math.min(3000, fundamentalFreq * 2.5 + 400), now);
    noiseFilter.Q.setValueAtTime(2.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.22, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destination);

    noise.start(now);
  }

  /**
   * Releases a note (stops it unless sustain pedal is currently active)
   */
  public releaseNote(midi: number) {
    if (this.sustainPedalDown) {
      // Mark as sustained so it stops when pedal releases
      this.sustainedNotes.add(midi);
      return;
    }

    const voice = this.activeVoices.get(midi);
    if (voice) {
      voice.stopVoice();
      this.activeVoices.delete(midi);
    }
  }

  /**
   * High-accuracy acoustic woodblock Metronome click
   */
  public playMetronomeTick(isAccent: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.dryGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    const freq = isAccent ? 1600 : 1050; // High woodblock for beat 1, lower for beats 2-4
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, now);
    filter.Q.setValueAtTime(5.0, now);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Helper to detect chords from active pressed midi numbers
   */
  public detectChord(pressedMidis: number[]): string | null {
    if (pressedMidis.length < 2) return null;

    const pitchClasses = Array.from(new Set(pressedMidis.map((m) => m % 12))).sort((a, b) => a - b);
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const turkishNoteNames = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

    // Try each pitch class as root
    for (let r = 0; r < 12; r++) {
      if (!pitchClasses.includes(r)) continue;

      const intervals = pitchClasses.map((p) => (p - r + 12) % 12).sort((a, b) => a - b);
      const intStr = intervals.join(',');

      // Common chord interval patterns
      const chords: Record<string, string> = {
        '0,4,7': 'Majör',
        '0,3,7': 'Minör',
        '0,4,7,10': '7 (Dominant)',
        '0,4,7,11': 'Maj7',
        '0,3,7,10': 'm7 (Minör 7)',
        '0,5,7': 'sus4',
        '0,2,7': 'sus2',
        '0,3,6': 'dim (Eksik)',
        '0,4,8': 'aug (Artmış)',
        '0,4,7,9': '6 (Majör 6)',
        '0,3,7,9': 'm6 (Minör 6)',
      };

      if (chords[intStr]) {
        return `${noteNames[r]} ${chords[intStr]} (${turkishNoteNames[r]})`;
      }
    }

    return null;
  }
}

export const soundEngine = new SoundEngine();

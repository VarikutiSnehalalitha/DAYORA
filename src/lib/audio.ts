// Web Audio API ambient sound generator and notification chimes

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle pleasant chime for task completion and reminders
export function playChime(type: 'success' | 'reminder' | 'warning' = 'success') {
  if (typeof window === 'undefined') return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    if (type === 'success') {
      // Harmonic pleasant bell chime (e.g. C6 -> E6 -> G6)
      const freqs = [1046.50, 1318.51, 1567.98];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.65);
      });
    } else if (type === 'reminder') {
      // Gentle warm double chime (A5 -> D6)
      const freqs = [880.00, 1174.66];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.15);

        gain.gain.setValueAtTime(0, now + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.15 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.85);
      });
    } else {
      // Soft amber alert tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.linearRampToValueAtTime(440.00, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    }
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

// Ambient noise generator for Focus Mode
class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private activeSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private currentMode: string = 'none';

  play(mode: 'rain' | 'forest' | 'coffee_shop' | 'white_noise' | 'waves', volume: number = 0.4) {
    this.stop();
    if (typeof window === 'undefined') return;

    try {
      this.ctx = getAudioContext();
      this.currentMode = mode;
      
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate brown/pinkish noise for calming sound
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      if (mode === 'rain') {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
        whiteNoise.connect(filter);
        filter.connect(this.gainNode);
      } else if (mode === 'waves') {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);

        this.lfo = this.ctx.createOscillator();
        this.lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // Wave period ~8s
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(300, this.ctx.currentTime);
        this.lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        this.lfo.start();

        whiteNoise.connect(filter);
        filter.connect(this.gainNode);
      } else if (mode === 'forest') {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
        whiteNoise.connect(filter);
        filter.connect(this.gainNode);
      } else {
        // white noise or coffee shop warm hum
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, this.ctx.currentTime);
        whiteNoise.connect(filter);
        filter.connect(this.gainNode);
      }

      whiteNoise.start();
      this.activeSource = whiteNoise;
    } catch (e) {
      console.warn('Ambient sound failed to start:', e);
    }
  }

  setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(vol * 0.35, this.ctx.currentTime);
    }
  }

  stop() {
    if (this.activeSource) {
      try {
        (this.activeSource as AudioBufferSourceNode).stop();
        this.activeSource.disconnect();
      } catch {}
      this.activeSource = null;
    }
    if (this.lfo) {
      try {
        this.lfo.stop();
        this.lfo.disconnect();
      } catch {}
      this.lfo = null;
    }
    this.currentMode = 'none';
  }

  getCurrentMode() {
    return this.currentMode;
  }
}

export const ambientSound = new AmbientSoundEngine();

type EraSound = "want" | "industry" | "catastrophe" | "recovery" | "acceleration" | "goals";

interface SoundConfig {
  noiseColor: "pink" | "brown" | "white";
  baseFreq: number;
  lfoFreq: number;
  lfoDepth: number;
  filterFreq: number;
  filterQ: number;
  gain: number;
}

const ERA_CONFIGS: Record<EraSound, SoundConfig> = {
  want: {
    noiseColor: "brown",
    baseFreq: 80,
    lfoFreq: 0.1,
    lfoDepth: 15,
    filterFreq: 300,
    filterQ: 0.5,
    gain: 0.12,
  },
  industry: {
    noiseColor: "pink",
    baseFreq: 110,
    lfoFreq: 2.4,
    lfoDepth: 30,
    filterFreq: 500,
    filterQ: 1.2,
    gain: 0.1,
  },
  catastrophe: {
    noiseColor: "brown",
    baseFreq: 55,
    lfoFreq: 0.05,
    lfoDepth: 10,
    filterFreq: 200,
    filterQ: 2.0,
    gain: 0.14,
  },
  recovery: {
    noiseColor: "pink",
    baseFreq: 165,
    lfoFreq: 0.3,
    lfoDepth: 20,
    filterFreq: 800,
    filterQ: 0.8,
    gain: 0.08,
  },
  acceleration: {
    noiseColor: "white",
    baseFreq: 220,
    lfoFreq: 4.0,
    lfoDepth: 50,
    filterFreq: 1200,
    filterQ: 1.5,
    gain: 0.06,
  },
  goals: {
    noiseColor: "pink",
    baseFreq: 330,
    lfoFreq: 0.5,
    lfoDepth: 25,
    filterFreq: 2000,
    filterQ: 0.6,
    gain: 0.07,
  },
};

function createNoiseBuffer(ctx: AudioContext, type: "pink" | "brown" | "white"): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  if (type === "white") {
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else if (type === "pink") {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  } else {
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
  }

  return buffer;
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentEra: EraSound | null = null;
  private activeNodes: AudioNode[] = [];
  private muted = false;
  private initialized = false;

  private rainOsc: OscillatorNode | null = null;
  private rainGain: GainNode | null = null;

  init() {
    if (this.initialized) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : 1;
    this.masterGain.connect(this.ctx.destination);
    this.initialized = true;
  }

  private ensureContext() {
    if (!this.ctx || !this.masterGain) {
      this.init();
    }
    if (this.ctx!.state === "suspended") {
      this.ctx!.resume();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(
        muted ? 0 : 1,
        this.ctx!.currentTime + 0.3
      );
    }
  }

  isMuted() {
    return this.muted;
  }

  playEra(era: EraSound) {
    this.ensureContext();
    if (this.currentEra === era) return;
    this.currentEra = era;
    this.stopAll();
    this.buildEraSound(era);
  }

  private buildEraSound(era: EraSound) {
    if (!this.ctx || !this.masterGain) return;
    const config = ERA_CONFIGS[era];
    const now = this.ctx.currentTime;

    const noiseBuffer = createNoiseBuffer(this.ctx, config.noiseColor);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = config.filterFreq;
    filter.Q.value = config.filterQ;

    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = config.lfoFreq;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = config.lfoDepth;

    const baseOsc = this.ctx.createOscillator();
    baseOsc.type = "sine";
    baseOsc.frequency.value = config.baseFreq;
    const baseGain = this.ctx.createGain();
    baseGain.gain.value = 0.03;

    const eraGain = this.ctx.createGain();
    eraGain.gain.value = 0;
    eraGain.gain.linearRampToValueAtTime(config.gain, now + 3.0);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noiseSource.connect(filter);
    filter.connect(eraGain);

    baseOsc.connect(baseGain);
    baseGain.connect(eraGain);

    eraGain.connect(this.masterGain!);

    noiseSource.start(now);
    lfo.start(now);
    baseOsc.start(now);

    this.activeNodes.push(noiseSource, filter, lfo, lfoGain, baseOsc, baseGain, eraGain);

    if (era === "want") {
      this.addRain(now);
    }
  }

  private addRain(now: number) {
    if (!this.ctx || !this.masterGain) return;

    const rainBuffer = createNoiseBuffer(this.ctx, "white");
    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = "bandpass";
    rainFilter.frequency.value = 3000;
    rainFilter.Q.value = 0.3;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = 0;
    this.rainGain.gain.linearRampToValueAtTime(0.04, now + 2.0);

    rainSource.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    rainSource.start(now);
    this.activeNodes.push(rainSource, rainFilter, this.rainGain);
  }

  playHeartbeat() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const playBeat = (time: number) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 60;

      const gain = this.ctx.createGain();
      gain.gain.value = 0;

      gain.gain.linearRampToValueAtTime(0.15, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.2);

      const osc2 = this.ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = 55;

      const gain2 = this.ctx.createGain();
      gain2.gain.value = 0;

      gain2.gain.linearRampToValueAtTime(0.1, time + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

      osc2.connect(gain2);
      gain2.connect(this.masterGain);

      osc2.start(time + 0.1);
      osc2.stop(time + 0.35);
    };

    playBeat(now);
    playBeat(now + 0.4);
    playBeat(now + 0.8);
  }

  playDeath() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const duration = 3.0;

    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 200;
    osc.frequency.linearRampToValueAtTime(40, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.value = 0.12;
    gain.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  playSurvive() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 330;
    osc.frequency.linearRampToValueAtTime(440, now + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  playClick() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 800;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  private stopAll() {
    const now = this.ctx?.currentTime ?? 0;
    this.activeNodes.forEach((node) => {
      try {
        if (node instanceof GainNode) {
          node.gain.linearRampToValueAtTime(0, now + 1.0);
        }
        if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
          node.stop(now + 1.2);
        }
      } catch {}
    });
    this.activeNodes = [];
  }

  destroy() {
    this.stopAll();
    this.ctx?.close();
    this.ctx = null;
    this.masterGain = null;
    this.initialized = false;
    this.currentEra = null;
  }
}

export const soundEngine = new SoundEngine();

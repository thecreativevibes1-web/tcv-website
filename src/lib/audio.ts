'use client';

/**
 * Restrained, fully synthesized sound layer (no audio assets).
 * Never autoplays: the AudioContext is created only on the user's
 * explicit sound-toggle gesture. Suspends when the tab is hidden.
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambGain: GainNode | null = null;
  private ambFilter: BiquadFilterNode | null = null;
  private osc2: OscillatorNode | null = null;
  private started = false;
  enabled = false;

  private ensure(): boolean {
    if (typeof window === 'undefined') return false;
    if (this.ctx) return true;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
      return true;
    } catch {
      return false;
    }
  }

  toggle(on: boolean): boolean {
    if (!this.ensure() || !this.ctx || !this.master) return false;
    this.enabled = on;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(on ? 0.5 : 0, t, 0.4);
    if (on && !this.started) {
      this.started = true;
      this.startAmbient();
    }
    return true;
  }

  private noiseBuffer(): AudioBuffer {
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  private startAmbient() {
    const ctx = this.ctx!;
    // low-frequency bed
    this.ambGain = ctx.createGain();
    this.ambGain.gain.value = 0.05;
    this.ambFilter = ctx.createBiquadFilter();
    this.ambFilter.type = 'lowpass';
    this.ambFilter.frequency.value = 220;
    this.ambFilter.Q.value = 0.6;

    const o1 = ctx.createOscillator();
    o1.type = 'sine'; o1.frequency.value = 48;
    const o2 = ctx.createOscillator();
    o2.type = 'sine'; o2.frequency.value = 72.3;
    this.osc2 = o2;
    const g1 = ctx.createGain(); g1.gain.value = 0.6;
    const g2 = ctx.createGain(); g2.gain.value = 0.22;

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer(); noise.loop = true;
    const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 640; nf.Q.value = 0.5;
    const ng = ctx.createGain(); ng.gain.value = 0.05;

    o1.connect(g1).connect(this.ambFilter);
    o2.connect(g2).connect(this.ambFilter);
    noise.connect(nf).connect(ng).connect(this.ambFilter);
    this.ambFilter.connect(this.ambGain).connect(this.master!);
    o1.start(); o2.start(); noise.start();

    // slow LFO breathing on the filter
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lg = ctx.createGain(); lg.gain.value = 90;
    lfo.connect(lg).connect(this.ambFilter.frequency);
    lfo.start();
  }

  /** scene ambience adapts to narrative position */
  setScene(f: number) {
    if (!this.enabled || !this.ctx || !this.ambFilter || !this.osc2) return;
    const t = this.ctx.currentTime;
    this.ambFilter.frequency.setTargetAtTime(160 + f * 40, t, 1.2);
    this.osc2.frequency.setTargetAtTime(72.3 + f * 2.2, t, 1.5);
  }

  /** deep activation pulse — hero moment */
  pulse() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(34, t);
    osc.frequency.exponentialRampToValueAtTime(128, t + 1.15);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.4, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    osc.connect(g).connect(this.master);
    osc.start(t); osc.stop(t + 1.7);

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer();
    const bf = ctx.createBiquadFilter(); bf.type = 'bandpass'; bf.Q.value = 1.4;
    bf.frequency.setValueAtTime(180, t);
    bf.frequency.exponentialRampToValueAtTime(2600, t + 1.1);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, t);
    ng.gain.exponentialRampToValueAtTime(0.16, t + 0.35);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
    noise.connect(bf).connect(ng).connect(this.master);
    noise.start(t); noise.stop(t + 1.6);
  }

  /** short transition tick between acts */
  blip() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(640, t);
    osc.frequency.exponentialRampToValueAtTime(210, t + 0.22);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    osc.connect(g).connect(this.master);
    osc.start(t); osc.stop(t + 0.35);
  }

  /** warm completion chord — the engine completes */
  chord() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx, t = ctx.currentTime;
    [220, 277.18, 329.63].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine'; osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.07, t + i * 0.08 + 0.25);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
      osc.connect(g).connect(this.master!);
      osc.start(t + i * 0.08); osc.stop(t + 3.4);
    });
  }

  /** tiny UI confirmation */
  uiTick() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine'; osc.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.045, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
    osc.connect(g).connect(this.master);
    osc.start(t); osc.stop(t + 0.14);
  }

  suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => {}); }
  resume() { if (this.ctx && this.enabled && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {}); }
}

export const audio = new AudioEngine();

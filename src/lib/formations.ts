'use client';
import { mulberry32, FormationId } from './store';

/**
 * Procedural particle formations. Each builder fills a Float32Array of
 * count*3 positions. Deterministic (seeded) so both scene systems agree.
 */

type Builder = (out: Float32Array, n: number, rand: () => number) => void;

function gauss(rand: () => number) {
  // Box-Muller
  const u = Math.max(rand(), 1e-6), v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const builders: Record<FormationId, Builder> = {
  /** HERO — dense nebula cloud with empty core and a filament ring */
  cloud(out, n, rand) {
    for (let i = 0; i < n; i++) {
      const j = i * 3;
      const pick = rand();
      if (pick < 0.62) { // clustered cloud, shell-biased
        const r = 3.2 + Math.pow(rand(), 0.55) * 6.5;
        const th = rand() * Math.PI * 2;
        const ph = Math.acos(2 * rand() - 1);
        out[j] = r * Math.sin(ph) * Math.cos(th) + gauss(rand) * 0.22;
        out[j + 1] = r * Math.cos(ph) * 0.82 + gauss(rand) * 0.22;
        out[j + 2] = r * Math.sin(ph) * Math.sin(th) + gauss(rand) * 0.22;
      } else if (pick < 0.85) { // equatorial filament band
        const r = 7.6 + gauss(rand) * 0.35;
        const th = rand() * Math.PI * 2;
        out[j] = Math.cos(th) * r;
        out[j + 1] = gauss(rand) * 0.55;
        out[j + 2] = Math.sin(th) * r;
      } else { // sparse halo (reduced share for negative space)
        const r = pick < 0.94 ? 10.5 + rand() * 9 : 7.6 + gauss(rand) * 0.4;
        const th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1);
        if (pick < 0.94) {
          out[j] = r * Math.sin(ph) * Math.cos(th);
          out[j + 1] = r * Math.cos(ph);
          out[j + 2] = r * Math.sin(ph) * Math.sin(th);
        } else {
          out[j] = Math.cos(th) * r;
          out[j + 1] = gauss(rand) * 0.5;
          out[j + 2] = Math.sin(th) * r;
        }
      }
    }
  },

  /** ACT I — sphere shell with revealed inner architecture */
  shell(out, n, rand) {
    for (let i = 0; i < n; i++) {
      const j = i * 3, pick = rand();
      const th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1);
      if (pick < 0.55) {
        const r = 8.4 + gauss(rand) * 0.18;
        out[j] = r * Math.sin(ph) * Math.cos(th);
        out[j + 1] = r * Math.cos(ph);
        out[j + 2] = r * Math.sin(ph) * Math.sin(th);
      } else if (pick < 0.85) { // inner geodesic-ish scaffold (icosa rings)
        const band = Math.floor(rand() * 6) - 3;
        const y = band * 1.3 + gauss(rand) * 0.05;
        const rr = Math.sqrt(Math.max(0.2, 4.4 * 4.4 - y * y));
        out[j] = Math.cos(th) * rr + gauss(rand) * 0.05;
        out[j + 1] = y;
        out[j + 2] = Math.sin(th) * rr + gauss(rand) * 0.05;
      } else { // drifting inward debris
        const r = 4.6 + rand() * 3.6;
        out[j] = r * Math.sin(ph) * Math.cos(th);
        out[j + 1] = r * Math.cos(ph);
        out[j + 2] = r * Math.sin(ph) * Math.sin(th);
      }
    }
  },

  /** ACT II — layered design planes / construction grids */
  grid(out, n, rand) {
    for (let i = 0; i < n; i++) {
      const j = i * 3, pick = rand();
      if (pick < 0.72) { // three inclined planes
        const layer = pick < 0.24 ? 0 : pick < 0.48 ? 1 : 2;
        const gx = (Math.round(rand() * 26) - 13) * 0.62;
        const gz = (Math.round(rand() * 16) - 8) * 0.62;
        const zBase = (layer - 1) * 2.6;
        out[j] = gx + gauss(rand) * 0.05;
        out[j + 1] = gz * 0.72 + Math.sin(gx * 0.5 + layer) * 0.4 + gauss(rand) * 0.05;
        out[j + 2] = zBase + gx * 0.22 + gauss(rand) * 0.08;
      } else if (pick < 0.9) { // vertical guide columns
        const gx = (Math.round(rand() * 8) - 4) * 1.9;
        out[j] = gx;
        out[j + 1] = (rand() - 0.5) * 9;
        out[j + 2] = (Math.round(rand() * 4) - 2) * 1.6;
      } else { // floating accents
        out[j] = gauss(rand) * 6;
        out[j + 1] = gauss(rand) * 4;
        out[j + 2] = gauss(rand) * 3;
      }
    }
  },

  /** ACT III — clipped FCC lattice: engineered mechanism */
  lattice(out, n, rand) {
    const s = 1.9, cells: number[][] = [];
    for (let x = -4; x <= 4; x++)
      for (let y = -4; y <= 4; y++)
        for (let z = -4; z <= 4; z++) {
          const off = (Math.abs(x + y + z) % 2) * 0.5;
          const px = (x + off) * s, py = (y - off) * s, pz = z * s;
          const r = Math.sqrt(px * px + py * py + pz * pz);
          if (r < 8.6 && r > 1.1) cells.push([px, py, pz, r]);
        }
    for (let i = 0; i < n; i++) {
      const j = i * 3;
      if (cells.length && rand() < 0.8) {
        const c = cells[Math.floor(rand() * cells.length)];
        out[j] = c[0] + gauss(rand) * 0.06;
        out[j + 1] = c[1] + gauss(rand) * 0.06;
        out[j + 2] = c[2] + gauss(rand) * 0.06;
      } else { // free electrons orbiting the structure
        const r = 4 + rand() * 6, th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1);
        out[j] = r * Math.sin(ph) * Math.cos(th);
        out[j + 1] = r * Math.cos(ph) * 0.7;
        out[j + 2] = r * Math.sin(ph) * Math.sin(th);
      }
    }
  },

  /** ACT IV — neural branching walks from core */
  neural(out, n, rand) {
    for (let i = 0; i < n; i++) {
      const j = i * 3;
      // unique random walk per particle group
      let x = gauss(rand) * 0.4, y = gauss(rand) * 0.4, z = gauss(rand) * 0.4;
      const dx = rand() * 2 - 1, dy = rand() * 2 - 1, dz = rand() * 2 - 1;
      const steps = 6 + Math.floor(rand() * 14);
      for (let k = 0; k < steps; k++) {
        x += dx * 0.5 + gauss(rand) * 0.34;
        y += dy * 0.42 + gauss(rand) * 0.34;
        z += dz * 0.5 + gauss(rand) * 0.34;
      }
      const r = Math.sqrt(x * x + y * y + z * z);
      const cap = 9.2;
      const m = r > cap ? cap / r : 1;
      out[j] = x * m; out[j + 1] = y * m; out[j + 2] = z * m;
    }
  },

  /** ACT V — expanding spiral galaxy with halo */
  galaxy(out, n, rand) {
    const arms = 4;
    for (let i = 0; i < n; i++) {
      const j = i * 3, pick = rand();
      if (pick < 0.78) {
        const arm = i % arms;
        const t = Math.pow(rand(), 0.65);
        const ang = t * 5.2 + (arm / arms) * Math.PI * 2 + gauss(rand) * 0.22;
        const r = 1.2 + t * 11.5;
        out[j] = Math.cos(ang) * r + gauss(rand) * 0.3;
        out[j + 1] = gauss(rand) * (0.35 + t * 0.5);
        out[j + 2] = Math.sin(ang) * r + gauss(rand) * 0.3;
      } else {
        const r = 3 + rand() * 9, th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1);
        out[j] = r * Math.sin(ph) * Math.cos(th) * 0.8;
        out[j + 1] = r * Math.cos(ph) * 0.8;
        out[j + 2] = r * Math.sin(ph) * Math.sin(th) * 0.8;
      }
    }
  },

  /** SVC 0 — web/app: floating screens (rounded rectangles) */
  web(out, n, rand) {
    for (let i = 0; i < n; i++) {
      const j = i * 3, pick = rand();
      const screen = Math.floor(rand() * 7);
      const sx = (screen % 3 - 1) * 5.2 + gauss(rand) * 0.4;
      const sy = (Math.floor(screen / 3) - 1) * 3.4 + gauss(rand) * 0.3;
      const sz = ((screen * 7) % 5 - 2) * 1.4;
      if (pick < 0.7) { // screen surface
        const u = rand() * 2 - 1, v = rand() * 2 - 1;
        const w = 2.1, h = 1.4;
        const r = 0.35;
        const cu = Math.sign(u) * Math.min(Math.abs(u), (w - r) / w) * w;
        // rounded rect distance approximation — pull edges inward
        out[j] = sx + cu + (Math.abs(u) > 0.82 ? (rand() - 0.5) * r : (rand() - 0.5) * 0.06);
        out[j + 1] = sy + v * h * 0.5 * 1.4;
        out[j + 2] = sz + Math.abs(u) * 0.18 + gauss(rand) * 0.05;
      } else { // connecting stream
        const t = rand();
        out[j] = sx * t + gauss(rand) * 0.35;
        out[j + 1] = sy * t + gauss(rand) * 0.35;
        out[j + 2] = sz * t + gauss(rand) * 0.35;
      }
    }
  },

  /** SVC 1 — cortex: dense core, thin shell, radial spokes */
  cortex(out, n, rand) {
    for (let i = 0; i < n; i++) {
      const j = i * 3, pick = rand();
      const th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1);
      const dx = Math.sin(ph) * Math.cos(th), dy = Math.cos(ph), dz = Math.sin(ph) * Math.sin(th);
      if (pick < 0.4) { // dense core
        const r = Math.pow(rand(), 0.5) * 3.2;
        out[j] = dx * r; out[j + 1] = dy * r; out[j + 2] = dz * r;
      } else if (pick < 0.7) { // shell membrane
        const r = 6.4 + gauss(rand) * 0.14;
        out[j] = dx * r; out[j + 1] = dy * r; out[j + 2] = dz * r;
      } else { // spokes core->shell and beyond
        const t = rand() * 1.5;
        const r = 3.4 + t * 3.4;
        out[j] = dx * r + gauss(rand) * 0.16;
        out[j + 1] = dy * r + gauss(rand) * 0.16;
        out[j + 2] = dz * r + gauss(rand) * 0.16;
      }
    }
  },

  /** SVC 2 — modules: separated cube lattice platform */
  modules(out, n, rand) {
    for (let i = 0; i < n; i++) {
      const j = i * 3;
      const mx = Math.floor(rand() * 5) - 2;
      const my = Math.floor(rand() * 3) - 1;
      const mz = Math.floor(rand() * 5) - 2;
      const gap = 2.35;
      // surface of each 1.55-module cube
      const face = Math.floor(rand() * 6);
      const u = rand() * 2 - 1, v = rand() * 2 - 1, h = 0.78;
      let px = u * h, py = v * h, pz = h;
      if (face === 0) { px = u * h; py = v * h; pz = h; }
      if (face === 1) { px = u * h; py = v * h; pz = -h; }
      if (face === 2) { px = h; py = u * h; pz = v * h; }
      if (face === 3) { px = -h; py = u * h; pz = v * h; }
      if (face === 4) { px = u * h; py = h; pz = v * h; }
      if (face === 5) { px = u * h; py = -h; pz = v * h; }
      out[j] = mx * gap + px;
      out[j + 1] = my * gap * 1.15 + py;
      out[j + 2] = mz * gap + pz;
    }
  },

  /** SVC 3 — prism: five monumental slabs / typographic monoliths */
  prism(out, n, rand) {
    for (let i = 0; i < n; i++) {
      const j = i * 3, pick = rand();
      if (pick < 0.85) {
        const slab = Math.floor(rand() * 5);
        const ang = ((slab - 2) / 5) * Math.PI * 0.66;
        const cx = Math.sin(ang) * 5.6, cz = Math.cos(ang) * 5.6 - 4.2;
        const hgt = 4.2 + (2 - Math.abs(slab - 2)) * 1.6;
        const u = rand() * 2 - 1, v = rand() * 2 - 1, w = rand() * 2 - 1;
        out[j] = cx + u * 0.9 * Math.cos(ang) + w * 0.24 * Math.sin(ang);
        out[j + 1] = v * hgt * 0.5 + (rand() < 0.08 ? gauss(rand) * 0.4 : 0);
        out[j + 2] = cz - u * 0.9 * Math.sin(ang) + w * 0.24 * Math.cos(ang);
      } else { // colour specks orbiting
        const r = 4 + rand() * 6, th = rand() * Math.PI * 2;
        out[j] = Math.cos(th) * r;
        out[j + 1] = gauss(rand) * 3;
        out[j + 2] = Math.sin(th) * r - 2;
      }
    }
  },

  /** SVC 4 — network expansion: hub and spoke audience clusters */
  network(out, n, rand) {
    const hubs: [number, number, number][] = [[0, 0, 0]];
    for (let k = 0; k < 10; k++) {
      const th = (k / 10) * Math.PI * 2 + rand() * 0.5;
      const r = 5.2 + rand() * 3.4;
      hubs.push([Math.cos(th) * r, (rand() - 0.5) * 4.4, Math.sin(th) * r]);
    }
    for (let i = 0; i < n; i++) {
      const j = i * 3, pick = rand();
      const hub = hubs[Math.floor(rand() * hubs.length)];
      if (pick < 0.55) { // cluster shell around hub
        const r = 0.9 + rand() * 0.7, th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1);
        out[j] = hub[0] + r * Math.sin(ph) * Math.cos(th);
        out[j + 1] = hub[1] + r * Math.cos(ph);
        out[j + 2] = hub[2] + r * Math.sin(ph) * Math.sin(th);
      } else { // particles along spokes to center
        const t = rand();
        out[j] = hub[0] * t + gauss(rand) * 0.14;
        out[j + 1] = hub[1] * t + gauss(rand) * 0.14;
        out[j + 2] = hub[2] * t + gauss(rand) * 0.14;
      }
    }
  },

  /** ACT VI — complete engine: torus + core + outer orbital ring */
  halo(out, n, rand) {
    for (let i = 0; i < n; i++) {
      const j = i * 3, pick = rand();
      if (pick < 0.42) { // grand torus
        const R = 6.8, r = 1.15;
        const u = rand() * Math.PI * 2, v = rand() * Math.PI * 2;
        out[j] = (R + r * Math.cos(v)) * Math.cos(u) + gauss(rand) * 0.05;
        out[j + 1] = r * Math.sin(v) * 0.7 + gauss(rand) * 0.05;
        out[j + 2] = (R + r * Math.cos(v)) * Math.sin(u) + gauss(rand) * 0.05;
      } else if (pick < 0.72) { // radiant core sphere
        const r = Math.pow(rand(), 0.4) * 2.9, th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1);
        out[j] = r * Math.sin(ph) * Math.cos(th);
        out[j + 1] = r * Math.cos(ph);
        out[j + 2] = r * Math.sin(ph) * Math.sin(th);
      } else if (pick < 0.9) { // thin far orbital ring
        const th = rand() * Math.PI * 2, r = 11.5 + gauss(rand) * 0.25;
        out[j] = Math.cos(th) * r;
        out[j + 1] = gauss(rand) * 0.35;
        out[j + 2] = Math.sin(th) * r;
      } else { // upward sparks — growth
        out[j] = gauss(rand) * 7;
        out[j + 1] = 1.5 + Math.pow(rand(), 1.6) * 8;
        out[j + 2] = gauss(rand) * 7;
      }
    }
  },
};

const cache = new Map<string, Record<FormationId, Float32Array>>();

export function buildFormations(count: number): Record<FormationId, Float32Array> {
  const key = String(count);
  const hit = cache.get(key);
  if (hit) return hit;
  const out = {} as Record<FormationId, Float32Array>;
  (Object.keys(builders) as FormationId[]).forEach((id, k) => {
    const arr = new Float32Array(count * 3);
    builders[id](arr, count, mulberry32(1337 + k * 101));
    out[id] = arr;
  });
  cache.set(key, out);
  return out;
}

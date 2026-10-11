export const pointsVertex = /* glsl */ `
attribute vec3 aPosB;
attribute float aRand;
attribute float aSize;
uniform float uMorph;
uniform float uTime;
uniform float uIntro;
uniform float uEnergy;
uniform float uWaveT;
uniform float uPixelRatio;
uniform float uSize;
uniform float uReduced;
uniform float uSpin;
uniform float uDim;
varying float vAlpha;
varying float vRand;
varying float vWave;

void main() {
  vec3 pos = mix(position, aPosB, uMorph);
  float rnd = aRand;

  // dormant state: particles scattered far away, drifting slowly
  vec3 dormant = pos * 2.6 + vec3(0.0, 3.0, -34.0);
  pos = mix(dormant, pos, smoothstep(0.02, 0.38, uIntro));

  // global slow rotation
  float ang = uTime * 0.045 * uSpin;
  float c = cos(ang); float s = sin(ang);
  pos.xz = mat2(c, -s, s, c) * pos.xz;

  // organic coherent drift
  float e = (0.07 + uEnergy * 0.38) * (1.0 - uReduced * 0.85);
  float t = uTime * (0.35 + rnd * 0.65);
  pos += e * vec3(
    sin(t * 0.9 + rnd * 17.0),
    cos(t * 0.7 + rnd * 23.0),
    sin(t * 0.5 + rnd * 31.0));

  // radial activation burst
  float wave = 0.0;
  float wt = uTime - uWaveT;
  if (wt > 0.0 && wt < 3.2) {
    float d = length(mix(position, aPosB, uMorph));
    float front = wt * 9.0;
    wave = exp(-abs(d - front) * 0.8) * exp(-wt * 1.2);
    pos += normalize(pos + 0.001) * wave * 1.7;
  }

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = max(-mv.z, 0.1);
  float ps = uSize * aSize * uPixelRatio * (92.0 / dist);
  gl_PointSize = min(ps, 26.0);
  float twinkle = 0.7 + 0.3 * sin(uTime * (1.0 + rnd * 2.0) + rnd * 40.0);
  vAlpha = (1.0 - smoothstep(15.0, 50.0, dist)) * smoothstep(1.5, 4.5, dist) * twinkle;
  vAlpha *= mix(0.3, 1.0, uIntro);
  vAlpha *= (1.0 - uDim * 0.5);
  vRand = rnd;
  vWave = wave;
}
`;

export const pointsFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uAcc;
uniform float uOpacity;
varying float vAlpha;
varying float vRand;
varying float vWave;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.04, d);
  float glow = exp(-d * 8.0);
  vec3 col = mix(uColorA, uColorB, smoothstep(0.12, 0.88, vRand));
  col = mix(col, uAcc, step(0.962, vRand) * 0.95);
  col *= 0.8 + vRand * 0.5;
  col += vec3(0.9, 0.95, 1.0) * vWave * 0.75;
  float a = (core * 0.82 + glow * 0.18) * vAlpha * uOpacity;
  gl_FragColor = vec4(col, a);
}
`;

export const coreVertex = /* glsl */ `
uniform float uTime;
uniform float uEnergy;
uniform float uFragment;
uniform float uIntro;
varying vec3 vN;
varying vec3 vP;
varying float vDisp;

vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec3 nrm = normalize(position);
  float n1 = snoise(nrm * 2.1 + uTime * 0.14);
  float n2 = snoise(nrm * 5.4 - uTime * 0.22);
  float disp = n1 * (0.2 + uEnergy * 0.52) + n2 * 0.07;
  vec3 p = position + normal * disp;
  float fi = snoise(nrm * 3.0 + 4.2);
  p += nrm * uFragment * (0.7 + fi * 2.3);
  p += normal * uFragment * sin(uTime * 2.6 + fi * 10.0) * 0.14;
  float grow = 0.06 + 0.94 * smoothstep(0.05, 0.95, uIntro);
  p *= grow;
  vDisp = disp;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vN = normalMatrix * normal;
  vP = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

export const coreFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uAcc;
uniform float uEnergy;
uniform float uFragment;
uniform float uIntro;
varying vec3 vN;
varying vec3 vP;
varying float vDisp;

void main() {
  vec3 N = normalize(vN);
  vec3 V = normalize(vP);
  float fres = pow(1.0 - abs(dot(N, V)), 2.6);
  vec3 col = mix(uColorB * 0.35, uColorA, fres);
  col += uAcc * pow(fres, 6.0) * 1.5;
  col *= 0.55 + vDisp * 0.9 + uEnergy * 0.3;
  float alpha = (0.12 + fres * 0.62) * (1.0 - uFragment * 0.4);
  alpha *= smoothstep(0.03, 0.5, uIntro);
  gl_FragColor = vec4(col, alpha);
}
`;

export const ringVertex = /* glsl */ `
uniform float uTime;
varying float vAng;
varying float vRad;
void main() {
  vAng = atan(position.y, position.x);
  vRad = length(position.xy);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
}
`;

export const ringFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uAcc;
uniform float uTime;
uniform float uOpacity;
uniform float uSpeed;
varying float vAng;
varying float vRad;
void main() {
  float pulse = pow(max(cos(vAng * 2.0 - uTime * uSpeed), 0.0), 22.0);
  float pulse2 = pow(max(cos(-vAng * 3.0 + uTime * uSpeed * 0.6), 0.0), 30.0);
  vec3 col = mix(uColorB, uColorA, 0.5 + 0.5 * sin(vAng + uTime * 0.2));
  col += uAcc * pulse * 1.6 + uColorA * pulse2;
  float a = (0.16 + pulse * 0.85 + pulse2 * 0.5) * uOpacity;
  gl_FragColor = vec4(col, a);
}
`;

export const lineVertex = /* glsl */ `
attribute float aT;
uniform float uTime;
uniform float uDraw;
varying float vT;
varying float vVis;
varying float vFade;
void main() {
  vT = aT;
  vVis = step(aT, uDraw);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vFade = 1.0 - smoothstep(16.0, 46.0, -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

export const lineFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uTime;
uniform float uOpacity;
varying float vT;
varying float vVis;
varying float vFade;
void main() {
  if (vVis < 0.5) discard;
  float trav = pow(0.5 + 0.5 * sin(6.28318 * (vT * 2.0 - uTime * 0.3)), 4.0);
  float a = (0.05 + trav * 0.4) * uOpacity * vFade;
  vec3 col = mix(uColorA, uColorB, vT);
  gl_FragColor = vec4(col, a);
}
`;

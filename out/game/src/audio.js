// Tiny sound effects made with the Web Audio API: no sound files, no network.
// A soft chime when a difference is found, a low thud for a miss, a blip for
// a hint, and a short rising fanfare when a level is cleared.

let ctx = null;
let muted = false;

function audio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, at, dur, type = 'sine', gain = 0.12) {
  if (muted) return;
  const ac = audio();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ac.currentTime + at);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + at + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

export function playFound() {
  tone(880, 0, 0.18);
  tone(1318, 0.09, 0.25);
}

export function playMiss() {
  tone(160, 0, 0.2, 'triangle', 0.14);
}

export function playHint() {
  tone(660, 0, 0.12, 'sine', 0.08);
  tone(990, 0.1, 0.12, 'sine', 0.08);
}

export function playWin() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.12, 0.3));
}

export function playLose() {
  [392, 330, 262].forEach((f, i) => tone(f, i * 0.15, 0.25, 'triangle', 0.1));
}

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

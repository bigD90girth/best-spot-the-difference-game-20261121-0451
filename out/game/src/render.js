// Everything the player sees change: markers on both panels, the counters,
// the timer bar, the message line, and the overlay cards for start, level
// complete, time up and the final win.

import { IMAGE } from './config.js';

const $ = (id) => document.getElementById(id);

export function setImages(a, b) {
  $('imgA').src = a;
  $('imgB').src = b;
}

export function setLevelName(name) {
  $('levelName').textContent = name;
}

export function setCounts(found, total) {
  $('foundCount').textContent = `${found} / ${total}`;
  $('remainCount').textContent = String(total - found);
}

export function setScore(score) {
  $('score').textContent = String(score);
}

export function setHintsLeft(n) {
  $('hintsLeft').textContent = String(n);
  $('hintBtn').disabled = n <= 0;
}

export function setTime(secondsLeft, total) {
  const mm = Math.floor(Math.max(0, secondsLeft) / 60);
  const ss = Math.floor(Math.max(0, secondsLeft) % 60);
  $('timeLeft').textContent = `${mm}:${String(ss).padStart(2, '0')}`;
  $('timeLeft').classList.toggle('low', secondsLeft <= 20);
  const fill = $('timerFill');
  fill.style.width = `${Math.max(0, (secondsLeft / total) * 100)}%`;
  fill.classList.toggle('low', secondsLeft <= 20);
}

export function setMessage(text) {
  $('message').textContent = text;
  $('status').textContent = text;
}

export function setMuteIcon(muted) {
  $('muteBtn').textContent = muted ? '🔇' : '🔊';
}

function markerElement(diff, hint = false) {
  const el = document.createElement('div');
  el.className = hint ? 'marker hint-ring' : 'marker';
  el.style.left = `${(diff.x / IMAGE.width) * 100}%`;
  el.style.top = `${(diff.y / IMAGE.height) * 100}%`;
  return el;
}

export function addMarkers(diff) {
  $('markersA').appendChild(markerElement(diff));
  $('markersB').appendChild(markerElement(diff));
}

export function showHintRing(diff, ms) {
  const a = markerElement(diff, true);
  const b = markerElement(diff, true);
  $('markersA').appendChild(a);
  $('markersB').appendChild(b);
  window.setTimeout(() => {
    a.remove();
    b.remove();
  }, ms);
}

export function showMiss(point, panel) {
  const el = document.createElement('div');
  el.className = 'miss';
  el.textContent = '✕';
  el.style.left = `${(point.x / IMAGE.width) * 100}%`;
  el.style.top = `${(point.y / IMAGE.height) * 100}%`;
  panel.querySelector('.markers').appendChild(el);
  window.setTimeout(() => el.remove(), 700);
  const boards = $('boards');
  boards.classList.remove('shake');
  void boards.offsetWidth;
  boards.classList.add('shake');
}

export function clearMarkers() {
  $('markersA').innerHTML = '';
  $('markersB').innerHTML = '';
}

export function showOverlay({ title, text, scoreLine, button, onButton }) {
  $('overlayTitle').textContent = title;
  $('overlayText').textContent = text;
  $('overlayScore').textContent = scoreLine || '';
  const btn = $('overlayBtn');
  btn.textContent = button;
  btn.onclick = onButton;
  $('overlay').classList.remove('hidden');
}

export function hideOverlay() {
  $('overlay').classList.add('hidden');
}

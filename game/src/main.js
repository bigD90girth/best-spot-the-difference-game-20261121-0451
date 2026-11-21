// Spot the Seven: two scenes, seven differences each, one timer per level.
// Boot, level flow, scoring, hints, the timer, and the screenshot presets.

import { BEST_KEY, HINTS_PER_LEVEL, POINTS, WRONG_CLICK_PENALTY_SECONDS } from './config.js';
import { LEVELS } from './levels.js';
import { isMuted, playFound, playHint, playLose, playMiss, playWin, toggleMute } from './audio.js';
import { bindKeys, bindPanels } from './input.js';
import * as view from './render.js';
import { SHOT_PRESETS, readShot } from './shots.js';

const state = {
  level: 0,
  found: new Set(),
  score: 0,
  hintsLeft: HINTS_PER_LEVEL,
  secondsLeft: 0,
  playing: false,
  timer: null,
  shot: null,
};

function level() {
  return LEVELS[state.level];
}

function stopTimer() {
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
}

function startTimer() {
  stopTimer();
  if (state.shot) return; // screenshot presets freeze the clock
  state.timer = window.setInterval(() => {
    state.secondsLeft -= 1;
    view.setTime(state.secondsLeft, level().seconds);
    if (state.secondsLeft <= 0) {
      stopTimer();
      state.playing = false;
      playLose();
      view.showOverlay({
        title: "Time's up!",
        text: `The clock ran out on ${level().name}. You found ${state.found.size} of 7 differences.`,
        scoreLine: `Score ${state.score}`,
        button: 'Try this scene again',
        onButton: () => startLevel(state.level),
      });
    }
  }, 1000);
}

function startLevel(index) {
  state.level = index;
  state.found = new Set();
  state.hintsLeft = HINTS_PER_LEVEL;
  state.secondsLeft = level().seconds;
  state.playing = true;
  view.hideOverlay();
  view.clearMarkers();
  view.setImages(level().a, level().b);
  view.setLevelName(level().name);
  view.setCounts(0, level().differences.length);
  view.setScore(state.score);
  view.setHintsLeft(state.hintsLeft);
  view.setTime(state.secondsLeft, level().seconds);
  view.setMessage(
    `${level().name}: find all 7 differences. Click on either picture — a right spot rings on both.`,
  );
  startTimer();
}

function levelComplete() {
  stopTimer();
  state.playing = false;
  const timeBonus = state.secondsLeft * POINTS.timeBonusPerSecond;
  state.score += timeBonus;
  view.setScore(state.score);
  playWin();
  const names = level().differences.map((d) => d.label).join(', ');
  if (state.level + 1 < LEVELS.length) {
    view.showOverlay({
      title: 'Scene cleared!',
      text: `Every difference in ${level().name} found: ${names}.`,
      scoreLine: `Time bonus +${timeBonus} · Score ${state.score}`,
      button: `Next scene: ${LEVELS[state.level + 1].name}`,
      onButton: () => startLevel(state.level + 1),
    });
  } else {
    const best = Math.max(state.score, Number(window.localStorage.getItem(BEST_KEY) || 0));
    window.localStorage.setItem(BEST_KEY, String(best));
    view.showOverlay({
      title: 'You found them all!',
      text: `Every difference in both scenes: ${names}. Harbor at Sunset and Mountain Village at Dawn are both solved.`,
      scoreLine: `Final score ${state.score} · Best ${best}`,
      button: 'Play again',
      onButton: () => {
        state.score = 0;
        startLevel(0);
      },
    });
  }
}

function onClick(point, panel) {
  if (!state.playing) return;
  const diff = level().differences.findIndex((d, i) => {
    if (state.found.has(i)) return false;
    const dx = point.x - d.x;
    const dy = point.y - d.y;
    return dx * dx + dy * dy <= d.r * d.r;
  });
  if (diff >= 0) {
    state.found.add(diff);
    state.score += POINTS.find;
    view.addMarkers(level().differences[diff]);
    view.setCounts(state.found.size, level().differences.length);
    view.setScore(state.score);
    view.setMessage(`Found it — ${level().differences[diff].label}. ${level().differences.length - state.found.size} to go.`);
    playFound();
    if (state.found.size === level().differences.length) levelComplete();
  } else {
    state.secondsLeft = Math.max(0, state.secondsLeft - WRONG_CLICK_PENALTY_SECONDS);
    view.setTime(state.secondsLeft, level().seconds);
    view.showMiss(point, panel);
    view.setMessage(`Not a difference — ${WRONG_CLICK_PENALTY_SECONDS} seconds off the clock.`);
    playMiss();
  }
}

function onHint() {
  if (!state.playing || state.hintsLeft <= 0) return;
  const remaining = level().differences.map((d, i) => i).filter((i) => !state.found.has(i));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - POINTS.hintCost);
  view.setHintsLeft(state.hintsLeft);
  view.setScore(state.score);
  view.showHintRing(level().differences[pick], 2000);
  view.setMessage(`Hint: look near "${level().differences[pick].label}" — that one costs ${POINTS.hintCost} points.`);
  playHint();
}

function onMute() {
  view.setMuteIcon(toggleMute());
}

function applyShot(shot) {
  const preset = SHOT_PRESETS[shot];
  if (!preset) return;
  state.shot = shot;
  state.level = preset.level;
  state.secondsLeft = preset.frozenTime;
  state.playing = true;
  view.hideOverlay();
  view.clearMarkers();
  view.setImages(level().a, level().b);
  view.setLevelName(level().name);
  view.setHintsLeft(HINTS_PER_LEVEL);
  view.setTime(state.secondsLeft, level().seconds);
  for (const i of preset.found) {
    state.found.add(i);
    view.addMarkers(level().differences[i]);
  }
  view.setCounts(state.found.size, level().differences.length);
  if (shot === 'end') {
    state.score = 1495;
    view.setScore(state.score);
    const best = Math.max(state.score, Number(window.localStorage.getItem(BEST_KEY) || 0));
    view.showOverlay({
      title: 'You found them all!',
      text: 'Every difference in both scenes: the big balloon turned red, the church clock went blank, a blue balloon appeared, a red bird appeared, a yellow flower bloomed, a sheep appeared, and a signpost appeared.',
      scoreLine: `Final score ${state.score} · Best ${best}`,
      button: 'Play again',
      onButton: () => {
        state.score = 0;
        state.shot = null;
        startLevel(0);
      },
    });
    view.setMessage('Both scenes solved — every difference found.');
  } else if (shot === 'play') {
    state.score = 300;
    view.setScore(state.score);
    view.setMessage('Three found, four remain — the hunt is on.');
  } else {
    state.score = 0;
    view.setScore(state.score);
    view.setMessage('Find all 7 differences. Click on either picture — a right spot rings on both.');
  }
}

function boot() {
  bindPanels(document.getElementById('panelA'), document.getElementById('panelB'), onClick);
  bindKeys({ onHint, onMute, onRestart: () => state.playing && startLevel(state.level) });
  document.getElementById('hintBtn').addEventListener('click', onHint);
  document.getElementById('muteBtn').addEventListener('click', onMute);
  view.setMuteIcon(isMuted());
  const shot = readShot();
  if (shot && SHOT_PRESETS[shot]) {
    applyShot(shot);
  } else {
    view.setImages(LEVELS[0].a, LEVELS[0].b);
    view.setLevelName(LEVELS[0].name);
    view.setCounts(0, 7);
    view.setTime(LEVELS[0].seconds, LEVELS[0].seconds);
    view.setScore(0);
    view.setHintsLeft(HINTS_PER_LEVEL);
    view.showOverlay({
      title: 'Spot the Seven',
      text: 'Two pictures, seven differences. One scene is a harbor at sunset, the other a mountain village at dawn. Find every difference before the clock runs out — a wrong click costs 5 seconds, a hint costs 50 points.',
      scoreLine: '',
      button: 'Start the hunt',
      onButton: () => {
        state.score = 0;
        startLevel(0);
      },
    });
  }
}

boot();

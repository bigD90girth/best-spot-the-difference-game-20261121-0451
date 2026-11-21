// Screenshot presets, the same shape as the kit starter's shots.json: the
// URL query ?shot= picks a frozen state of the game so its screenshots are
// real renders of the game itself. The timer is frozen in these states.
//   ?shot=start  level 1, nothing found yet
//   ?shot=play   level 1, three found, four remain
//   ?shot=end    both levels cleared, win screen showing

export function readShot() {
  const params = new URLSearchParams(window.location.search);
  return params.get('shot');
}

export const SHOT_PRESETS = {
  start: { level: 0, found: [], frozenTime: 150 },
  play: { level: 0, found: [0, 1, 3], frozenTime: 96 },
  end: { level: 1, found: [0, 1, 2, 3, 4, 5, 6], frozenTime: 41 },
};

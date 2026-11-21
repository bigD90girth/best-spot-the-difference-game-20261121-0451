// Every tuning number and colour in one place. The pictures are 960x640;
// hotspots are stored in those pixels and the renderer scales them to the
// panel on screen, so no rule below depends on the window size.

export const IMAGE = { width: 960, height: 640 };

/** Seconds of play per level, and how many hints each level allows. */
export const LEVEL_TIME = [150, 120];
export const HINTS_PER_LEVEL = 3;

/** Points for a find, plus one point per second left when the level ends. */
export const POINTS = { find: 100, timeBonusPerSecond: 1, hintCost: 50 };

/** Seconds taken off the clock for a wrong click. */
export const WRONG_CLICK_PENALTY_SECONDS = 5;

/** Best score kept between visits (this browser only). */
export const BEST_KEY = 'spot-the-seven.best';

export const PALETTE = {
  backdrop: '#1d2733',
  panel: '#24344a',
  accent: '#ffd166',
  found: '#7be495',
  miss: '#ff6b5e',
  text: '#f2ede3',
  muted: '#8fa6bb',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

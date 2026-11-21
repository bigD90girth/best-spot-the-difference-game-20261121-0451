// Clicks and keys. A click on either panel is translated into the picture's
// own 960x640 coordinates and handed to the game; the game decides whether it
// lands inside an unfound difference. Keyboard: H hint, M mute, R restart.

import { IMAGE } from './config.js';

export function panelPoint(event, panel) {
  const rect = panel.getBoundingClientRect();
  const img = panel.querySelector('img');
  const imgRect = img.getBoundingClientRect();
  const x = ((event.clientX - imgRect.left) / imgRect.width) * IMAGE.width;
  const y = ((event.clientY - imgRect.top) / imgRect.height) * IMAGE.height;
  return { x, y, inside: x >= 0 && x <= IMAGE.width && y >= 0 && y <= IMAGE.height };
}

export function bindPanels(panelA, panelB, onClick) {
  for (const panel of [panelA, panelB]) {
    panel.addEventListener('click', (event) => {
      const point = panelPoint(event, panel);
      if (point.inside) onClick(point, panel);
    });
  }
}

export function bindKeys({ onHint, onMute, onRestart }) {
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h') onHint();
    else if (key === 'm') onMute();
    else if (key === 'r') onRestart();
  });
}

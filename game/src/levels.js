// The two scenes and their seven differences each. Hotspot coordinates are
// in the pictures' own 960x640 pixels; x/y is the centre, r the click radius.
// Labels are the short names the level-complete screen lists back to you.

export const LEVELS = [
  {
    id: 'harbor',
    name: 'Harbor at Sunset',
    a: './assets/level1-a.jpg',
    b: './assets/level1-b.jpg',
    seconds: 150,
    blurb: 'A fishing harbor at golden hour: lighthouse, three boats, a busy dock.',
    differences: [
      { x: 125, y: 202, r: 34, label: 'the lighthouse roof turned blue' },
      { x: 520, y: 490, r: 46, label: 'the middle sail turned yellow' },
      { x: 889, y: 339, r: 26, label: 'a window in the pink house went dark' },
      { x: 700, y: 115, r: 40, label: 'a red balloon appeared in the sky' },
      { x: 305, y: 580, r: 32, label: 'a red fish jumped out of the water' },
      { x: 677, y: 459, r: 30, label: 'a yellow star appeared on the teal sail' },
      { x: 450, y: 84, r: 30, label: 'a seagull appeared in the sky' },
    ],
  },
  {
    id: 'village',
    name: 'Mountain Village at Dawn',
    a: './assets/level2-a.jpg',
    b: './assets/level2-b.jpg',
    seconds: 120,
    blurb: 'A valley village at first light: chalets, a church, a cable car, a balloon.',
    differences: [
      { x: 724, y: 128, r: 44, label: 'the big balloon turned red' },
      { x: 377, y: 399, r: 28, label: 'the church clock went blank' },
      { x: 300, y: 100, r: 36, label: 'a blue balloon appeared in the sky' },
      { x: 552, y: 199, r: 32, label: 'a red bird appeared in the sky' },
      { x: 200, y: 520, r: 30, label: 'a yellow flower bloomed in the meadow' },
      { x: 645, y: 567, r: 36, label: 'a sheep appeared in the meadow' },
      { x: 350, y: 575, r: 34, label: 'a signpost appeared on the path' },
    ],
  },
];

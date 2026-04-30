// Loads all mana SVGs at build time via Vite glob import
const _svgs = import.meta.glob('../images/mana/*.svg', { eager: true, query: '?url', import: 'default' })

function url(stem) {
  return _svgs[`../images/mana/${stem}.svg`]
}

// Maps the symbol text (inside {}) to the resolved SVG URL.
// To add or change a mapping, update this object — the url() call resolves the file at build time.
export const MANA_SYMBOLS = {
  // Basic colors
  W:         url('white-mana'),
  U:         url('blue-mana'),
  B:         url('black-mana'),
  R:         url('red-mana'),
  G:         url('green-mana'),
  C:         url('colorless-mana'),

  // Special
  T:         url('tap'),
  Q:         url('untap'),
  E:         url('energy'),
  S:         url('snow'),
  P:         url('mana-or-life'),
  X:         url('x-generic-mana'),
  Y:         url('y-generic-mana'),
  Z:         url('z-generic-mana'),
  PW:        url('planeswalker'),
  CHAOS:     url('chaos'),
  A:         url('acorn'),
  HALF:      url('half-mana'),
  INFINITY:  url('infinity-mana'),
  HR:        url('half-red'),
  HW:        url('half-white'),

  // Hybrid (slash and no-slash are the same symbol)
  'W/U': url('white-or-blue'),   WU: url('white-or-blue'),
  'W/B': url('white-or-black'),  WB: url('white-or-black'),
  'U/B': url('blue-or-black'),   UB: url('blue-or-black'),
  'U/R': url('blue-or-red'),     UR: url('blue-or-red'),
  'B/R': url('black-or-red'),    BR: url('black-or-red'),
  'B/G': url('black-or-green'),  BG: url('black-or-green'),
  'R/G': url('red-or-green'),    RG: url('red-or-green'),
  'R/W': url('red-or-white'),    RW: url('red-or-white'),
  'G/W': url('green-or-white'),  GW: url('green-or-white'),
  'G/U': url('green-or-blue'),   GU: url('green-or-blue'),

  // Phyrexian (slash and no-slash)
  'W/P': url('white-or-life'),  WP: url('white-or-life'),
  'U/P': url('blue-or-life'),   UP: url('blue-or-life'),
  'B/P': url('black-or-life'),  BP: url('black-or-life'),
  'R/P': url('red-or-life'),    RP: url('red-or-life'),
  'G/P': url('green-or-life'),  GP: url('green-or-life'),

  // Generic numeric
  0:         url('zero-mana'),
  1:         url('one-mana'),
  2:         url('two-mana'),
  3:         url('three-mana'),
  4:         url('four-mana'),
  5:         url('five-mana'),
  6:         url('six-mana'),
  7:         url('seven-mana'),
  8:         url('eight-mana'),
  9:         url('nine-mana'),
  10:        url('ten-mana'),
  11:        url('eleven-mana'),
  12:        url('twelve-mana'),
  13:        url('thirteen-mana'),
  14:        url('fourteen-mana'),
  15:        url('fifteen-mana'),
  16:        url('sixteen-mana'),
  17:        url('seventeen-mana'),
  18:        url('eighteen-mana'),
  19:        url('nineteen-mana'),
  20:        url('twenty-mana'),
  100:       url('one-hundred-mana'),
  1000000:   url('one-million-mana'),

  // Hybrid generic-2 (2 colorless or color)
  '2/W': url('two-generic-or-white'),
  '2/U': url('two-generic-or-blue'),
  '2/B': url('two-generic-or-black'),
  '2/R': url('two-generic-or-red'),
  '2/G': url('two-generic-or-green'),
}

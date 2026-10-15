/* Icons (Lucide-style outline paths, ISC licence) and the drawn illustrations.
   Everything is inline SVG so the demo needs no network. */

const ICONS = {
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  fileCheck: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  factory: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  plusCircle: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
  handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  userCheck: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
  coins: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  chevDown: '<path d="m6 9 6 6 6-6"/>',
  chevLeft: '<path d="m15 18-6-6 6-6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  road: '<rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  cap: '<path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  ship: '<path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10v4"/><path d="M12 2v3"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  listCheck: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  headset: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  flask: '<path d="M10 2v7.53a2 2 0 0 1-.21.9L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.07-10.12a2 2 0 0 1-.21-.9V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  cog: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  pipe: '<ellipse cx="6" cy="12" rx="2.5" ry="6"/><path d="M6 6h11a2.5 6 0 0 1 0 12H6"/><path d="M6 9.5h1.5"/>',
  apple: '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
  trend: '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
  filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
  eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
  note: '<path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'
};

function icon(name, cls = '') {
  return `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.info}</svg>`;
}

/* Simplified flags for the four sample target markets (hoist on the left). */
const FLAGS = {
  iq: '<rect width="30" height="20" fill="#fff"/><rect width="30" height="6.67" fill="#CE1126"/><rect y="13.33" width="30" height="6.67" fill="#000"/><path d="M9.5 11.2c1-.9 1.6.4 2.6-.3m1.6.4c.8-.8 1.5.3 2.4-.2m1.5.2c.9-.9 1.6.4 2.6-.3" stroke="#007A3D" stroke-width="1.1" fill="none" stroke-linecap="round"/>',
  ae: '<rect width="30" height="20" fill="#fff"/><rect x="8" width="22" height="6.67" fill="#00732F"/><rect x="8" y="13.33" width="22" height="6.67" fill="#000"/><rect width="8" height="20" fill="#FF0000"/>',
  qa: '<rect width="30" height="20" fill="#8A1538"/><path d="M0 0h8l3 1.11-3 1.11 3 1.11-3 1.11 3 1.11-3 1.11 3 1.11-3 1.11 3 1.11-3 1.11 3 1.11-3 1.11 3 1.11-3 1.11 3 1.11-3 1.11 3 1.11-3 1.12H0Z" fill="#fff"/>',
  om: '<rect width="30" height="20" fill="#DB161B"/><rect x="8" width="22" height="6.67" fill="#fff"/><rect x="8" y="13.33" width="22" height="6.67" fill="#008000"/>'
};
function flag(code, size = 'md') {
  return `<span class="flag flag-${size}" title="${(DEMO_MARKETS[code] || {}).name || ''}"><svg viewBox="0 0 30 20" aria-hidden="true">${FLAGS[code] || ''}</svg></span>`;
}

/* --- Hero illustrations: drawn at 960x320, anchored right (slice). --- */
function seeded(seed) { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }

function heroSky(id, top, mid, low, glow) {
  return `<defs>
    <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".62" stop-color="${mid}"/><stop offset="1" stop-color="${low}"/></linearGradient>
    <radialGradient id="glow${id}" cx=".72" cy=".86" r=".5"><stop offset="0" stop-color="${glow}" stop-opacity=".75"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>
    <filter id="blur${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>
  <rect width="960" height="320" fill="url(#sky${id})"/><rect width="960" height="320" fill="url(#glow${id})"/>`;
}

function lights(points, id) {
  const dots = points.map(([x, y, r = 1.6]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
  return `<g fill="#FFC56B" filter="url(#blur${id})" opacity=".9">${dots}</g><g fill="#FFE6B0">${dots}</g>`;
}

function artRefinery() {
  const id = 'r', rnd = seeded(7), pts = [], g = [];
  const towers = [[600, 120, 20], [640, 84, 26], [700, 58, 30], [756, 104, 20], [872, 72, 26], [912, 118, 18]];
  towers.forEach(([x, y, w]) => {
    g.push(`<rect x="${x}" y="${y}" width="${w}" height="${270 - y}" rx="${w / 2.4}" fill="#0D1B3D"/>`);
    g.push(`<rect x="${x + w * .18}" y="${y + 6}" width="${w * .12}" height="${264 - y}" fill="#1B3166" opacity=".8"/>`);
    for (let yy = y + 18; yy < 262; yy += 26) {
      g.push(`<rect x="${x - 5}" y="${yy}" width="${w + 10}" height="2.4" fill="#16295A"/>`);
      pts.push([x - 3 + rnd() * 4, yy - 2], [x + w + 1 - rnd() * 4, yy - 2]);
    }
    pts.push([x + w / 2, y - 2, 2]);
  });
  g.push('<rect x="812" y="34" width="7" height="236" fill="#0D1B3D"/><path d="M815.5 34c-6-8-1-15 0-22 3 6 7 11 0 22z" fill="#FFB24D"/><path d="M815.5 32c-3-4-.5-8 0-12 2 4 3.5 7 0 12z" fill="#FFE7A8"/>');
  g.push('<g stroke="#122453" stroke-width="2" fill="none"><path d="M770 270V150h56v120M770 180h56M770 210h56M770 240h56M770 150l56 30M826 180l-56 30M770 210l56 30"/></g>');
  for (let i = 0; i < 8; i++) pts.push([772 + rnd() * 52, 152 + rnd() * 110, 1.3]);
  g.push('<rect x="500" y="222" width="104" height="48" rx="4" fill="#0F2148"/><ellipse cx="552" cy="222" rx="52" ry="7" fill="#1A3268"/><rect x="926" y="232" width="60" height="38" rx="4" fill="#0F2148"/><ellipse cx="956" cy="232" rx="30" ry="5" fill="#1A3268"/>');
  g.push('<g stroke="#1A3268" stroke-width="3"><path d="M604 248h270M604 258h330"/></g>');
  for (let x = 508; x < 600; x += 13) pts.push([x, 238 + rnd() * 18, 1.2]);
  const ground = '<rect y="268" width="960" height="52" fill="#081330"/><rect y="268" width="960" height="2" fill="#20407F" opacity=".7"/>';
  const refl = `<g opacity=".25" fill="#FFC56B">${pts.slice(0, 26).map(([x]) => `<rect x="${x - .6}" y="${276 + rnd() * 30}" width="1.2" height="${4 + rnd() * 8}"/>`).join('')}</g>`;
  return heroSky(id, '#0A1A40', '#1B4A93', '#4D79BC', '#FFA94D') + g.join('') + ground + refl + lights(pts, id);
}

function artPort() {
  const id = 'p', rnd = seeded(3), g = [], pts = [];
  const colors = ['#E0533D', '#2F6FD6', '#F2A93B', '#3BA672', '#7E5BD8', '#C9D2E3', '#1E8C9A'];
  for (let row = 0; row < 3; row++) {
    for (let x = 520 + row * 12; x < 880 - row * 20; x += 46) {
      const y = 232 - row * 20, c = colors[Math.floor(rnd() * colors.length)];
      g.push(`<rect x="${x}" y="${y}" width="44" height="18" rx="1.5" fill="${c}" opacity=".92"/><path d="M${x + 6} ${y + 3}v12M${x + 13} ${y + 3}v12M${x + 20} ${y + 3}v12M${x + 27} ${y + 3}v12M${x + 34} ${y + 3}v12" stroke="#000" stroke-opacity=".18"/>`);
    }
  }
  g.push('<path d="M480 252h470l-26 30H510z" fill="#0B1836"/><rect x="480" y="250" width="470" height="4" fill="#1D3A75"/>');
  g.push('<g stroke="#F0B44C" stroke-width="4" fill="none" stroke-linejoin="round"><path d="M900 252V96M940 252V96M884 96h120M900 130h40M900 170h40M900 210h40M900 130l40 40M940 130l-40 40M900 170l40 40"/><path d="M884 96 820 96"/></g><path d="M832 96v40" stroke="#F0B44C" stroke-width="2"/><rect x="824" y="136" width="18" height="10" fill="#F0B44C"/>');
  for (let i = 0; i < 7; i++) pts.push([900 + rnd() * 40, 100 + rnd() * 140, 1.4]);
  pts.push([884, 92, 2], [1004, 92, 2], [496, 248], [560, 248], [640, 248], [720, 248]);
  const water = '<rect y="270" width="960" height="50" fill="#0A1A3E"/><g stroke="#3A68B4" stroke-opacity=".35" stroke-width="1.5">' +
    Array.from({ length: 14 }, (_, i) => `<path d="M${480 + i * 34} ${284 + (i % 3) * 9}h${14 + (i % 4) * 6}"/>`).join('') + '</g>';
  return heroSky(id, '#0B1C45', '#22508F', '#6A8FC6', '#FFB76B') + water + g.join('') + lights(pts, id);
}

function artPark() {
  const id = 'k', rnd = seeded(11), g = [], pts = [];
  const shed = (x, w, h) => {
    let teeth = '';
    for (let t = 0; t < w; t += 24) teeth += `l12 -14 l0 14 l12 0 `;
    g.push(`<path d="M${x} 270V${270 - h}${teeth.replace(/l12 0 $/, '')}V270z" fill="#0E1E44"/>`);
    for (let wx = x + 8; wx < x + w - 8; wx += 16) { g.push(`<rect x="${wx}" y="${270 - h + 16}" width="8" height="6" fill="#FFD58A" opacity="${rnd() > .3 ? .85 : .25}"/>`); }
  };
  shed(500, 120, 52); shed(640, 150, 66); shed(806, 96, 46);
  g.push('<g fill="#0E1E44"><rect x="574" y="120" width="44" height="40" rx="10"/><path d="M580 160l-8 110h6l8-110zm32 0 8 110h-6l-8-110z"/><rect x="584" y="200" width="24" height="3"/></g>');
  pts.push([596, 116, 2]);
  g.push('<g stroke="#9FB4DA" stroke-opacity=".55" stroke-width="2" fill="none"><path d="M914 270l18-190 18 190M920 210h24M924 150h16M916 240l30-30M948 240l-30-30M906 104h52M912 128h40"/></g><path d="M958 104C940 140 905 150 870 150M906 104C880 130 850 140 800 138" stroke="#9FB4DA" stroke-opacity=".35" fill="none"/>');
  pts.push([932, 76, 2]);
  g.push('<rect x="720" y="150" width="9" height="56" fill="#0E1E44"/><rect x="740" y="164" width="7" height="42" fill="#0E1E44"/><g fill="#B8C7E6" opacity=".22"><circle cx="726" cy="136" r="10"/><circle cx="738" cy="122" r="13"/><circle cx="756" cy="110" r="9"/></g>');
  const ground = '<rect y="268" width="960" height="52" fill="#0A1636"/><path d="M480 296h480" stroke="#2E5296" stroke-width="2" stroke-dasharray="18 14"/>';
  for (let i = 0; i < 6; i++) pts.push([520 + i * 70, 278, 1.4]);
  return heroSky(id, '#0B1A3F', '#1A4687', '#5C86C2', '#FFC27A') + g.join('') + ground + lights(pts, id);
}

const HERO_ART = { refinery: artRefinery, port: artPort, park: artPark };
function heroArt(kind) {
  return `<svg class="hero-art" viewBox="0 0 960 320" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">${HERO_ART[kind]()}</svg>`;
}

/* Faint skyline used at the bottom of the sidebar. */
const SKYLINE = '<svg class="side-skyline" viewBox="0 0 240 90" aria-hidden="true"><path d="M0 90V70h14V52h8v18h10V40h6v30h12V58h18V36l4-6 4 6v34h10V48h14v22h8V26h5v44h12V60h20V44h6v26h12V54h10v16h14V64h18v26z" fill="currentColor"/><g fill="#FFD58A" opacity=".8"><circle cx="74" cy="38" r="1.2"/><circle cx="126" cy="30" r="1.2"/><circle cx="178" cy="48" r="1.2"/><circle cx="40" cy="46" r="1"/></g></svg>';
const WAVE = '<svg class="side-wave" viewBox="0 0 240 60" aria-hidden="true"><defs><linearGradient id="wv" x1="0" x2="1"><stop offset="0" stop-color="#2B74FF" stop-opacity="0"/><stop offset=".6" stop-color="#4F8DFF"/><stop offset="1" stop-color="#2B74FF" stop-opacity=".2"/></linearGradient></defs><path d="M0 50C40 50 50 18 90 22s50 30 90 18 40-30 60-36" stroke="url(#wv)" stroke-width="2" fill="none"/></svg>';

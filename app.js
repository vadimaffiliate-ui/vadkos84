const fingerConfig = [
  ['Thumb', 'Willpower'],
  ['Index', 'Direction'],
  ['Middle', 'Balance'],
  ['Ring', 'Connection'],
  ['Pinky', 'Expression']
];

const faceMarkers = [
  ['Forehead glow', 'mental clarity'],
  ['Eye brightness', 'emotional vitality'],
  ['Cheek tone', 'circulatory flow'],
  ['Jaw tension', 'stress load'],
  ['Lips color', 'grounded presence']
];

const modalities = [
  ['Breath Resonance', '4-7-8 and box breathing cycles matched to your current stress score.'],
  ['Sound Bath', 'Binaural + solfeggio suggestion tuned to your focus area.'],
  ['Micro-Movement', 'Qi-gong inspired 6-minute reset sequence.'],
  ['Crystal Intentions', 'Symbolic crystal pairings with journaling prompts.'],
  ['Hydration Ritual', 'Electrolyte and herbal hydration rhythm planner.'],
  ['Sleep Winddown', 'Nervous-system downshift routine with lighting cues.']
];

const state = {
  finger: null,
  face: null,
  astro: null,
  numerology: null,
  memory: []
};

function createSlider(container, id, label, min = 1, max = 10, value = 5) {
  const wrapper = document.createElement('label');
  wrapper.innerHTML = `${label} <input type="range" id="${id}" min="${min}" max="${max}" value="${value}">`;
  container.appendChild(wrapper);
}

function initUI() {
  const fingerRoot = document.getElementById('finger-sliders');
  fingerConfig.forEach(([name, channel], i) => createSlider(fingerRoot, `finger-${i}`, `${name} — ${channel}`));

  const faceRoot = document.getElementById('face-markers');
  faceMarkers.forEach(([name, channel], i) => createSlider(faceRoot, `face-${i}`, `${name} — ${channel}`));

  const tools = document.getElementById('tool-grid');
  modalities.forEach(([title, text]) => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `<h4>${title}</h4><p>${text}</p>`;
    tools.appendChild(card);
  });
}

function setTabs() {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target).classList.add('active');
    });
  });
}

function average(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function runFingerScan() {
  const values = fingerConfig.map((_, i) => Number(document.getElementById(`finger-${i}`).value));
  const coherence = average(values);
  const strongest = fingerConfig[values.indexOf(Math.max(...values))][1];
  const weakest = fingerConfig[values.indexOf(Math.min(...values))][1];

  state.finger = { coherence, strongest, weakest, values };
  document.getElementById('finger-result').textContent =
    `Biofield Coherence: ${coherence.toFixed(1)}/10\n` +
    `Strongest channel: ${strongest}\n` +
    `Needs support: ${weakest}\n` +
    `Protocol seed: 3 min alternate nostril breathing + hand meridian tapping.`;
}

function runFaceScan() {
  const values = faceMarkers.map((_, i) => Number(document.getElementById(`face-${i}`).value));
  const vitality = average(values);
  const stressLoad = values[3];
  const profile = stressLoad > 7 ? 'Overclocked' : vitality > 7 ? 'Radiant' : 'Recalibrating';

  state.face = { vitality, stressLoad, profile, values };
  document.getElementById('face-result').textContent =
    `Face Energy Profile: ${profile}\n` +
    `Vitality Index: ${vitality.toFixed(1)}/10\n` +
    `Stress signal: ${stressLoad}/10\n` +
    `Prescription seed: jaw release massage, eye-palming, and 5-minute screen break.`;
}

function zodiacSign(date) {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const signs = [
    ['Capricorn', 1, 19], ['Aquarius', 2, 18], ['Pisces', 3, 20], ['Aries', 4, 19],
    ['Taurus', 5, 20], ['Gemini', 6, 20], ['Cancer', 7, 22], ['Leo', 8, 22],
    ['Virgo', 9, 22], ['Libra', 10, 22], ['Scorpio', 11, 21], ['Sagittarius', 12, 21],
    ['Capricorn', 12, 31]
  ];
  for (const [name, m, cutoff] of signs) {
    if (month === m && day <= cutoff) return name;
  }
  const idx = signs.findIndex(([, m]) => m === month);
  return signs[Math.max(0, idx + 1)][0];
}

function runAstro() {
  const date = document.getElementById('birth-date').value;
  const time = document.getElementById('birth-time').value || '12:00';
  const city = document.getElementById('birth-city').value.trim() || 'Unknown';
  const focus = document.getElementById('astro-focus').value;
  if (!date) {
    document.getElementById('astro-result').textContent = 'Please enter a birth date.';
    return;
  }
  const sign = zodiacSign(date);
  const hour = Number(time.split(':')[0]);
  const elementalBias = hour < 6 ? 'water' : hour < 12 ? 'air' : hour < 18 ? 'fire' : 'earth';

  state.astro = { sign, city, focus, elementalBias };
  document.getElementById('astro-result').textContent =
    `Sun Sign: ${sign}\nCity imprint: ${city}\nElemental bias: ${elementalBias}\n` +
    `Focus directive (${focus}): align daily action with ${elementalBias}-based rituals and ${sign} strengths.`;
}

const pythMap = Object.fromEntries('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c, i) => [c, (i % 9) + 1]));
const chaldMap = {
  A:1,I:1,J:1,Q:1,Y:1,B:2,K:2,R:2,C:3,G:3,L:3,S:3,D:4,M:4,T:4,E:5,H:5,N:5,X:5,U:6,V:6,W:6,O:7,Z:7,F:8,P:8
};

function reduceNumber(n) {
  while (n > 9 && ![11, 22, 33].includes(n)) n = String(n).split('').reduce((a, b) => a + Number(b), 0);
  return n;
}

function sumName(name, map) {
  return reduceNumber(name.toUpperCase().replace(/[^A-Z]/g, '').split('').reduce((s, ch) => s + (map[ch] || 0), 0));
}

function lifePath(date) {
  return reduceNumber(String(date).replace(/-/g, '').split('').reduce((a, b) => a + Number(b), 0));
}

function runNumerology() {
  const name = document.getElementById('full-name').value.trim();
  const date = document.getElementById('num-birth-date').value;
  if (!name || !date) {
    document.getElementById('num-result').textContent = 'Please enter full name and birth date.';
    return;
  }
  const pyth = sumName(name, pythMap);
  const chald = sumName(name, chaldMap);
  const path = lifePath(date);
  const bridge = Math.abs(pyth - path);

  state.numerology = { pyth, chald, path, bridge };
  document.getElementById('num-result').textContent =
    `Pythagorean Expression: ${pyth}\nChaldean Vibration: ${chald}\nLife Path: ${path}\nBridge number: ${bridge}\n` +
    `Integration cue: blend structure (Pythagorean) with intuition (Chaldean).`;
}

function synthesize() {
  const mood = Number(document.getElementById('mood').value);
  const energy = Number(document.getElementById('energy').value);
  const stress = Number(document.getElementById('stress').value);
  const sleep = Number(document.getElementById('sleep').value);

  const f = state.finger?.coherence ?? 5;
  const face = state.face?.vitality ?? 5;
  const astro = state.astro?.elementalBias ?? 'air';
  const sign = state.astro?.sign ?? 'your sign';
  const numPath = state.numerology?.path ?? '—';

  const index = average([mood, energy, 11 - stress, sleep, f, face]);
  const tier = index > 7 ? 'Expansion Phase' : index > 5 ? 'Stabilization Phase' : 'Recovery Phase';

  const elementalProtocol = {
    fire: 'sun salutations + invigorating breathwork',
    water: 'yin stretches + hydration + reflective journaling',
    air: 'coherent breathing + mantra + mindful walks',
    earth: 'grounding routines + weighted blanket + slow meals'
  };

  const message =
`Living AI Synthesis: ${tier}
Coherence Index: ${index.toFixed(1)}/10

Interpreted signature:
• Archetype: ${sign} aligned seeker
• Dominant element: ${astro}
• Numerology life path: ${numPath}

Today's adaptive prescription:
1) Core modality: ${elementalProtocol[astro]}
2) Nervous system support: ${stress > 6 ? 'down-regulation protocol every 3 hours' : 'maintenance reset at noon and evening'}
3) Expression ritual: write 5 lines of gratitude + 1 brave action.
4) Integration score target tonight: ${Math.min(10, Math.round(index + 1))}/10

Reassess in 8 hours and log feedback to evolve the model.`;

  document.getElementById('ai-output').textContent = message;
}

function submitFeedback() {
  const text = document.getElementById('feedback').value.trim();
  if (!text) return;
  const stamp = new Date().toLocaleString();
  state.memory.unshift({ stamp, text });
  state.memory = state.memory.slice(0, 8);

  const log = document.getElementById('memory-log');
  log.innerHTML = '';
  state.memory.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = `${entry.stamp}: ${entry.text}`;
    log.appendChild(li);
  });
  document.getElementById('feedback').value = '';
}

initUI();
setTabs();

document.getElementById('run-finger').addEventListener('click', runFingerScan);
document.getElementById('run-face').addEventListener('click', runFaceScan);
document.getElementById('run-astro').addEventListener('click', runAstro);
document.getElementById('run-num').addEventListener('click', runNumerology);
document.getElementById('synthesize').addEventListener('click', synthesize);
document.getElementById('submit-feedback').addEventListener('click', submitFeedback);

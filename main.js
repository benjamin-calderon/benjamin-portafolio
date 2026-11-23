const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

let audioCtx = null;
let masterGain = null;
let isStarted = false;

const wetHands = [
  { t: 0.0, f: 146.83, d: 4.2, v: 0.35 },
  { t: 0.1, f: 220.00, d: 3.8, v: 0.28 },
  { t: 0.3, f: 440.00, d: 2.2, v: 0.45 },
  { t: 1.25, f: 369.99, d: 2.0, v: 0.45 },
  { t: 2.2, f: 293.66, d: 2.4, v: 0.45 },

  { t: 3.3, f: 98.00, d: 4.2, v: 0.35 },
  { t: 3.4, f: 196.00, d: 3.8, v: 0.28 },
  { t: 3.6, f: 329.63, d: 2.0, v: 0.45 },
  { t: 4.5, f: 369.99, d: 2.0, v: 0.45 },
  { t: 5.45, f: 440.00, d: 2.6, v: 0.45 },

  { t: 6.6, f: 110.00, d: 4.2, v: 0.35 },
  { t: 6.7, f: 220.00, d: 3.8, v: 0.28 },
  { t: 6.9, f: 493.88, d: 2.2, v: 0.48 },
  { t: 7.85, f: 440.00, d: 2.0, v: 0.45 },
  { t: 8.8, f: 369.99, d: 2.4, v: 0.45 },

  { t: 10.0, f: 123.47, d: 4.2, v: 0.35 },
  { t: 10.1, f: 185.00, d: 3.8, v: 0.28 },
  { t: 10.3, f: 293.66, d: 2.2, v: 0.45 },
  { t: 11.4, f: 329.63, d: 3.2, v: 0.45 },

  { t: 13.5, f: 146.83, d: 4.2, v: 0.35 },
  { t: 13.6, f: 220.00, d: 3.8, v: 0.28 },
  { t: 13.8, f: 440.00, d: 2.0, v: 0.45 },
  { t: 14.7, f: 493.88, d: 2.0, v: 0.45 },
  { t: 15.65, f: 554.37, d: 2.4, v: 0.48 },

  { t: 16.9, f: 98.00, d: 4.2, v: 0.35 },
  { t: 17.0, f: 196.00, d: 3.8, v: 0.28 },
  { t: 17.2, f: 587.33, d: 2.2, v: 0.48 },
  { t: 18.2, f: 554.37, d: 2.0, v: 0.45 },
  { t: 19.2, f: 493.88, d: 2.6, v: 0.45 },

  { t: 20.6, f: 110.00, d: 4.8, v: 0.35 },
  { t: 20.7, f: 220.00, d: 4.4, v: 0.28 },
  { t: 20.9, f: 440.00, d: 2.4, v: 0.45 },
  { t: 22.0, f: 369.99, d: 2.4, v: 0.42 },
  { t: 23.2, f: 293.66, d: 5.0, v: 0.45 }
];

function initAudio() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.32, audioCtx.currentTime);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1250, audioCtx.currentTime);

  masterGain.connect(filter);
  filter.connect(audioCtx.destination);
}

function playPianoNote(freq, delaySec, durationSec, vol) {
  if (!audioCtx || !masterGain) return;

  const now = audioCtx.currentTime + delaySec;

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const noteGain = audioCtx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, now);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2, now);

  const harmGain = audioCtx.createGain();
  harmGain.gain.setValueAtTime(0.08, now);

  noteGain.gain.setValueAtTime(0.0001, now);
  noteGain.gain.linearRampToValueAtTime(vol * 0.22, now + 0.08);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  osc1.connect(noteGain);
  osc2.connect(harmGain);
  harmGain.connect(noteGain);
  noteGain.connect(masterGain);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + durationSec + 0.1);
  osc2.stop(now + durationSec + 0.1);
}

function loopMinecraftTheme() {
  if (!audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  wetHands.forEach((item) => {
    playPianoNote(item.f, item.t, item.d, item.v);
  });

  const totalLength = 29000;
  setTimeout(loopMinecraftTheme, totalLength);
}

function startAmbientSound() {
  if (isStarted) {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return;
  }
  isStarted = true;
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  loopMinecraftTheme();
}

['click', 'pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((evt) => {
  window.addEventListener(evt, startAmbientSound, { once: false, passive: true });
});

document.addEventListener('DOMContentLoaded', () => {
  startAmbientSound();
});

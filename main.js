const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

const audio = new Audio('assets/MusicaDeFondo.mp3');
audio.loop = true;
audio.volume = 0.3;

let started = false;

function startMusic() {
  if (started) return;
  started = true;
  audio.play();
}

['click', 'pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((evt) => {
  window.addEventListener(evt, startMusic, { passive: true });
});

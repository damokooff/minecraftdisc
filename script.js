const audio = document.getElementById('audio');
const jukebox = document.getElementById('jukebox');
const playlistEl = document.getElementById('playlist');
const trackTitle = document.getElementById('track-title');
const miniDisc = document.getElementById('mini-disc');
const progress = document.getElementById('progress');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');

const btnPlay = document.getElementById('btn-play');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const btnShuffle = document.getElementById('btn-shuffle');
const btnLoop = document.getElementById('btn-loop');

// Couleurs officielles de chaque disque Minecraft
const COULEURS_DISQUES = {
  "Thirteen":         { base: "#f9d849", dark: "#2a2a2a", light: "#fff7a8" },
  "Cat":              { base: "#4fd63c", dark: "#1e1e1e", light: "#a8f79b" },
  "Blocks":           { base: "#e05a2b", dark: "#2a2a2a", light: "#ffb28a" },
  "Chirp":            { base: "#d42a1f", dark: "#1a1a1a", light: "#ff8a7a" },
  "Far":              { base: "#7ee848", dark: "#1e1e1e", light: "#c8ff9c" },
  "Mall":             { base: "#8b3ed6", dark: "#2a2a2a", light: "#c99cff" },
  "Mellohi":          { base: "#e040d0", dark: "#2a2a2a", light: "#ff9bf0" },
  "Stal":             { base: "#3a3a3a", dark: "#0a0a0a", light: "#777777" },
  "Strad":            { base: "#e8e8e8", dark: "#2a2a2a", light: "#ffffff" },
  "Ward":             { base: "#3e7a2e", dark: "#1e1e1e", light: "#8fce6c" },
  "Eleven":           { base: "#9a9a9a", dark: "#1a1a1a", light: "#d0d0d0" },
  "Wait":             { base: "#5ba8e8", dark: "#1e1e1e", light: "#a8d4ff" },
  "Otherside":        { base: "#3aa8b0", dark: "#1a1a1a", light: "#8ce0e8" },
  "Five":             { base: "#3aa8a0", dark: "#1a1a1a", light: "#8ce0d8" },
  "Pistep":           { base: "#b84028", dark: "#3a1a10", light: "#ff8a5a" },
  "Relic":            { base: "#5ab8d8", dark: "#2a4a5a", light: "#a8e0f0" },
  "Creator":          { base: "#4fd68a", dark: "#1e3a2a", light: "#a8f7c8" },
  "Crator Music Box": { base: "#e09060", dark: "#3a2010", light: "#ffc8a0" },
  "Precipice":        { base: "#a8a8a8", dark: "#1a1a1a", light: "#e0e0e0" },
  "Tears":            { base: "#d8d8e8", dark: "#3a3a4a", light: "#ffffff" },
  "Lava Chicken":     { base: "#d42a2a", dark: "#1a0a0a", light: "#ff8a6a" },
  "Bounce":           { base: "#f0d8a8", dark: "#5a4a2a", light: "#fff0d0" },
  "Dog":              { base: "#c8a060", dark: "#3a2a1a", light: "#f0d0a0" }
};
const COULEUR_DEFAUT = { base: "#5a5a5a", dark: "#1a1a1a", light: "#a0a0a0" };

function getCouleurs(titre) {
  return COULEURS_DISQUES[titre] || COULEUR_DEFAUT;
}

function appliquerCouleurs(element, titre) {
  const c = getCouleurs(titre);
  element.style.setProperty('--disc-color', c.base);
  element.style.setProperty('--disc-dark', c.dark);
  element.style.setProperty('--disc-light', c.light);
}

// ---------- État ----------
let currentIndex = -1;
let isShuffle = true;
let isLooping = false;

// ---------- Construction de la grille de disques ----------
function construireGrille() {
  jukebox.innerHTML = '';
  MUSIC_FILES.forEach((musique, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'disc-wrapper';

    const disc = document.createElement('div');
    disc.className = 'disc';
    disc.title = musique.title;
    appliquerCouleurs(disc, musique.title);
    disc.innerHTML = `<div class="disc-hole"></div>`;

    const label = document.createElement('p');
    label.className = 'disc-label';
    label.textContent = musique.title;

    disc.addEventListener('click', () => {
      isShuffle = false;
      updateShuffleButton();
      jouerIndex(index);
    });

    wrapper.appendChild(disc);
    wrapper.appendChild(label);
    jukebox.appendChild(wrapper);
  });
}

// ---------- Construction de la playlist ----------
function construirePlaylist() {
  playlistEl.innerHTML = '';
  MUSIC_FILES.forEach((musique, index) => {
    const li = document.createElement('li');
    li.className = 'playlist-item';
    li.dataset.index = index;

    const mini = document.createElement('div');
    mini.className = 'playlist-mini-disc';
    appliquerCouleurs(mini, musique.title);

    const titre = document.createElement('span');
    titre.className = 'playlist-title';
    titre.textContent = musique.title;

    li.appendChild(mini);
    li.appendChild(titre);

    li.addEventListener('click', () => {
      isShuffle = false;
      updateShuffleButton();
      jouerIndex(index);
    });

    playlistEl.appendChild(li);
  });
}

// ---------- Lecture ----------
function jouerIndex(index) {
  if (index < 0 || index >= MUSIC_FILES.length) return;

  currentIndex = index;
  const musique = MUSIC_FILES[index];

  audio.src = musique.file;
  audio.play();

  trackTitle.textContent = musique.title;
  appliquerCouleurs(miniDisc, musique.title);

  // Mise en évidence dans la grille et la playlist
  document.querySelectorAll('.disc').forEach((d, i) => {
    d.classList.toggle('playing', i === index);
  });
  document.querySelectorAll('.playlist-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
}

function togglePlay() {
  if (currentIndex === -1) {
    const index = isShuffle
      ? Math.floor(Math.random() * MUSIC_FILES.length)
      : 0;
    jouerIndex(index);
    return;
  }

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function jouerSuivant() {
  if (MUSIC_FILES.length === 0) return;
  let nextIndex;
  if (isShuffle) {
    do {
      nextIndex = Math.floor(Math.random() * MUSIC_FILES.length);
    } while (nextIndex === currentIndex && MUSIC_FILES.length > 1);
  } else {
    nextIndex = (currentIndex + 1) % MUSIC_FILES.length;
  }
  jouerIndex(nextIndex);
}

function jouerPrecedent() {
  if (MUSIC_FILES.length === 0) return;
  let prevIndex;
  if (isShuffle) {
    do {
      prevIndex = Math.floor(Math.random() * MUSIC_FILES.length);
    } while (prevIndex === currentIndex && MUSIC_FILES.length > 1);
  } else {
    prevIndex = (currentIndex - 1 + MUSIC_FILES.length) % MUSIC_FILES.length;
  }
  jouerIndex(prevIndex);
}

// ---------- Mise à jour UI ----------
function updatePlayButton() {
  btnPlay.textContent = audio.paused ? '▶' : '⏸';
}

function updateShuffleButton() {
  btnShuffle.classList.toggle('active', isShuffle);
}

function updateLoopButton() {
  btnLoop.classList.toggle('active', isLooping);
}

function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ---------- Événements ----------
btnPlay.addEventListener('click', togglePlay);
btnNext.addEventListener('click', jouerSuivant);
btnPrev.addEventListener('click', jouerPrecedent);
btnShuffle.addEventListener('click', () => {
  isShuffle = !isShuffle;
  updateShuffleButton();
});
btnLoop.addEventListener('click', () => {
  isLooping = !isLooping;
  updateLoopButton();
});

audio.addEventListener('play', () => {
  updatePlayButton();
  miniDisc.classList.add('playing');
  miniDisc.classList.remove('paused');
});

audio.addEventListener('pause', () => {
  updatePlayButton();
  miniDisc.classList.remove('playing');
  miniDisc.classList.add('paused');
});

audio.addEventListener('ended', () => {
  if (isLooping) {
    audio.currentTime = 0;
    audio.play();
  } else {
    jouerSuivant();
  }
});

audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    timeCurrent.textContent = formatTime(audio.currentTime);
  }
});

progress.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

// ---------- Init ----------
construireGrille();
construirePlaylist();
updateShuffleButton();
updatePlayButton();
updateLoopButton();

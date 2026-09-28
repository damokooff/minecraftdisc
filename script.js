const jukebox = document.getElementById('jukebox');
const audio = document.getElementById('audio');
const nowPlaying = document.getElementById('nowplaying');
const loading = document.getElementById('loading');

// Couleurs officielles de chaque disque Minecraft
// { base: couleur du label, dark: ombre du vinyle, light: reflet }
const COULEURS_DISQUES = {
  "13":                    { base: "#f9d849", dark: "#2a2a2a", light: "#fff7a8" },
  "Thirteen":              { base: "#f9d849", dark: "#2a2a2a", light: "#fff7a8" },
  "Cat":                   { base: "#4fd63c", dark: "#1e1e1e", light: "#a8f79b" },
  "Blocks":                { base: "#e05a2b", dark: "#2a2a2a", light: "#ffb28a" },
  "Chirp":                 { base: "#d42a1f", dark: "#1a1a1a", light: "#ff8a7a" },
  "Far":                   { base: "#7ee848", dark: "#1e1e1e", light: "#c8ff9c" },
  "Mall":                  { base: "#8b3ed6", dark: "#2a2a2a", light: "#c99cff" },
  "Mellohi":               { base: "#e040d0", dark: "#2a2a2a", light: "#ff9bf0" },
  "Stal":                  { base: "#3a3a3a", dark: "#0a0a0a", light: "#777777" },
  "Strad":                 { base: "#e8e8e8", dark: "#2a2a2a", light: "#ffffff" },
  "Ward":                  { base: "#3e7a2e", dark: "#1e1e1e", light: "#8fce6c" },
  "Eleven":                { base: "#9a9a9a", dark: "#1a1a1a", light: "#d0d0d0" },
  "11":                    { base: "#9a9a9a", dark: "#1a1a1a", light: "#d0d0d0" },
  "Wait":                  { base: "#5ba8e8", dark: "#1e1e1e", light: "#a8d4ff" },
  "Otherside":             { base: "#3aa8b0", dark: "#1a1a1a", light: "#8ce0e8" },
  "Five":                  { base: "#3aa8a0", dark: "#1a1a1a", light: "#8ce0d8" },
  "Pigstep":               { base: "#b84028", dark: "#3a1a10", light: "#ff8a5a" },
  "Pistep":                { base: "#b84028", dark: "#3a1a10", light: "#ff8a5a" },
  "Relic":                 { base: "#5ab8d8", dark: "#2a4a5a", light: "#a8e0f0" },
  "Creator":               { base: "#4fd68a", dark: "#1e3a2a", light: "#a8f7c8" },
  "Crator Music Box":      { base: "#e09060", dark: "#3a2010", light: "#ffc8a0" },
  "Precipice":             { base: "#a8a8a8", dark: "#1a1a1a", light: "#e0e0e0" },
  "Tears":                 { base: "#d8d8e8", dark: "#3a3a4a", light: "#ffffff" },
  "Lava Chicken":          { base: "#d42a2a", dark: "#1a0a0a", light: "#ff8a6a" },
  "Bounce":                { base: "#f0d8a8", dark: "#5a4a2a", light: "#fff0d0" },
  "Dog":                   { base: "#c8a060", dark: "#3a2a1a", light: "#f0d0a0" }
};

// Couleur par défaut si un titre n'est pas dans la liste
const COULEUR_DEFAUT = { base: "#5a5a5a", dark: "#1a1a1a", light: "#a0a0a0" };

function afficherDisques(disques) {
  disques.forEach((disque) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'disc-wrapper';

    const div = document.createElement('div');
    div.className = 'disc';
    div.title = disque.title;

    const couleurs = COULEURS_DISQUES[disque.title] || COULEUR_DEFAUT;
    div.style.setProperty('--disc-color', couleurs.base);
    div.style.setProperty('--disc-dark', couleurs.dark);
    div.style.setProperty('--disc-light', couleurs.light);

    div.innerHTML = `<div class="disc-hole"></div>`;

    const label = document.createElement('p');
    label.className = 'disc-label';
    label.textContent = disque.title;

    div.addEventListener('click', () => jouerDisque(disque, div));

    wrapper.appendChild(div);
    wrapper.appendChild(label);
    jukebox.appendChild(wrapper);
  });
}

function jouerDisque(disque, element) {
  document.querySelectorAll('.disc').forEach(d => {
    d.classList.remove('playing');
    d.classList.remove('paused');
  });

  if (audio.src === disque.file && !audio.paused) {
    audio.pause();
    element.classList.remove('playing');
    element.classList.add('paused');
    nowPlaying.textContent = `⏸ ${disque.title}`;
  } else if (audio.src === disque.file && audio.paused) {
    audio.play();
    element.classList.add('playing');
    element.classList.remove('paused');
    nowPlaying.textContent = `▶ ${disque.title}`;
  } else {
    audio.src = disque.file;
    audio.play();
    element.classList.add('playing');
    nowPlaying.textContent = `▶ ${disque.title}`;
  }
}

audio.addEventListener('pause', () => {
  const playing = document.querySelector('.disc.playing');
  if (playing) {
    playing.classList.remove('playing');
    playing.classList.add('paused');
  }
});

audio.addEventListener('play', () => {
  const paused = document.querySelector('.disc.paused');
  if (paused) {
    paused.classList.remove('paused');
    paused.classList.add('playing');
  }
});

audio.addEventListener('ended', () => {
  document.querySelectorAll('.disc').forEach(d => {
    d.classList.remove('playing');
    d.classList.remove('paused');
  });
  nowPlaying.textContent = "Aucun disque en lecture";
});

loading.style.display = 'none';
afficherDisques(MUSIC_FILES);

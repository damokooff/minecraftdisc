const jukebox = document.getElementById('jukebox');
const audio = document.getElementById('audio');
const nowPlaying = document.getElementById('nowplaying');
const loading = document.getElementById('loading');

// Fonction qui lit les tags d'un MP3 et renvoie une promesse
function lireTags(url) {
  return new Promise((resolve) => {
    jsmediatags.read(url, {
      onSuccess: (tag) => resolve(tag.tags),
      onError: () => resolve({}) // Si pas de tags, on renvoie un objet vide
    });
  });
}

// Fonction pour convertir l'image binaire en URL affichable
function pictureToUrl(picture) {
  if (!picture) return null;
  const data = picture.data;
  const bytes = new Uint8Array(data);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:${picture.format};base64,${btoa(binary)}`;
}

// Chargement de tous les disques
async function chargerJukebox() {
  const disques = [];

  for (const fichier of MUSIC_FILES) {
    const tags = await lireTags(fichier);
    disques.push({
      file: fichier,
      title: tags.title || fichier.split('/').pop().replace('.mp3', ''),
      artist: tags.artist || 'Artiste inconnu',
      picture: pictureToUrl(tags.picture)
    });
  }

  loading.style.display = 'none';
  afficherDisques(disques);
}

// Affichage des disques
function afficherDisques(disques) {
  disques.forEach((disque, index) => {
    const div = document.createElement('div');
    div.className = 'disc';
    div.title = `${disque.artist} - ${disque.title}`;

    // Pochette ou fond noir par défaut
    if (disque.picture) {
      div.innerHTML = `<img src="${disque.picture}" alt="${disque.title}">`;
    } else {
      div.innerHTML = `<div class="no-cover">💿</div>`;
    }

    div.addEventListener('click', () => jouerDisque(disque, div));
    jukebox.appendChild(div);
  });
}

// Lecture d'un disque
function jouerDisque(disque, element) {
  document.querySelectorAll('.disc').forEach(d => d.classList.remove('playing'));

  if (audio.src.endsWith(disque.file) && !audio.paused) {
    audio.pause();
    element.classList.remove('playing');
    nowPlaying.textContent = "⏸ En pause";
  } else {
    audio.src = disque.file;
    audio.play();
    element.classList.add('playing');
    nowPlaying.textContent = `▶ ${disque.artist} — ${disque.title}`;
  }
}

audio.addEventListener('ended', () => {
  document.querySelectorAll('.disc').forEach(d => d.classList.remove('playing'));
  nowPlaying.textContent = "Aucun disque en lecture";
});

// Lancer le chargement
chargerJukebox();

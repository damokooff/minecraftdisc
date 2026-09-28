const jukebox = document.getElementById('jukebox');
const audio = document.getElementById('audio');
const nowPlaying = document.getElementById('nowplaying');
const loading = document.getElementById('loading');

function afficherDisques(disques) {
  disques.forEach((disque) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'disc-wrapper';

    const div = document.createElement('div');
    div.className = 'disc';
    div.title = disque.title;
    div.innerHTML = `<div class="no-cover">💿</div>`;

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
  document.querySelectorAll('.disc').forEach(d => d.classList.remove('playing'));

  if (audio.src === disque.file && !audio.paused) {
    audio.pause();
    element.classList.remove('playing');
    nowPlaying.textContent = "⏸ En pause";
  } else {
    audio.src = disque.file;
    audio.play();
    element.classList.add('playing');
    nowPlaying.textContent = `▶ ${disque.title}`;
  }
}

audio.addEventListener('ended', () => {
  document.querySelectorAll('.disc').forEach(d => d.classList.remove('playing'));
  nowPlaying.textContent = "Aucun disque en lecture";
});

loading.style.display = 'none';
afficherDisques(MUSIC_FILES);

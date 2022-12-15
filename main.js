const musicContainer = document.getElementById("music-container");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const title = document.getElementById("title");
const cover = document.getElementById("cover");

const voiceSearchBtn = document.getElementById("speech-btn");
const content = document.getElementById("content");

//Song titles
const songs = [
  "Rebel Yell Billy Idol",
  "Born to Be Wild Steppenwolf",
  "Sharp Dressed Man ZZ Top",
];

//Keep track of songs
let songIndex = 1;

//Initially load song info DOM
loadSong(songs[songIndex]);

//Update song details
function loadSong(song) {
  title.innerText = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${song}.jpg`;
}

//Play song
function playSong() {
  musicContainer.classList.add("play");
  playBtn.querySelector("i.fas").classList.remove("fa-play");
  playBtn.querySelector("i.fas").classList.add("fa-pause");

  audio.play();
}

//Pause song
function pauseSong() {
  musicContainer.classList.remove("play");
  playBtn.querySelector("i.fas").classList.add("fa-play");
  playBtn.querySelector("i.fas").classList.remove("fa-pause");

  audio.pause();
}

//functions for changing songs
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);
  playSong();
}

//Function for updating progress
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Voice Search pausing the song
voiceSearchBtn.addEventListener("click", () => {
  const isPlaying = musicContainer.classList.contains("play");

  if (isPlaying) {
    pauseSong();
  }
});

//Event listeners
playBtn.addEventListener("click", () => {
  const isPlaying = musicContainer.classList.contains("play");

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

//Change song events
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

audio.addEventListener("timeupdate", updateProgress);

progressContainer.addEventListener("click", setProgress);

audio.addEventListener("ended", nextSong);

//Speech Recognition Functions
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.onstart = function () {
  console.log("voice activated");
};

recognition.onresult = function (event) {
  console.log(event);
  const current = event.results[0][0].transcript;

  const newCurrent = current.toLowerCase();
  // content.textContent = newCurrent;
  playingChoosenSong(`Playing ${newCurrent}`);
};

voiceSearchBtn.addEventListener("click", () => {
  recognition.start();
});

// Response
function playingChoosenSong(message) {
  const speech = new SpeechSynthesisUtterance();

  speech.text = "I didn't catch that, can you repeat?";

  const contains = songs.some((element) => {
    if (message.includes(element.toLowerCase())) {
      speech.text = `Playing ${element}`;
      loadSong(element);
      playSong();
    }
  });

  speech.volume = 1;
  speech.rate = 0.9;
  speech.pitch = 1.1;

  window.speechSynthesis.speak(speech);
}

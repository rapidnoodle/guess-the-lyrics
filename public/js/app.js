const base = "http://localhost:3000";

const startSection = document.getElementById("start");
const chooseSection = document.getElementById("choose");
const lyricsSection = document.getElementById("lyrics");
const loadingSection = document.getElementById("loading");

const listOfSongs = document.getElementById("list");
const lyricsText = document.getElementById("lyrics-text");
const guess = document.getElementById("guess");

const createSession = document.getElementById("create-session");
const playHint = document.getElementById("play-hint");
const playAnswer = document.getElementById("play-answer");
const startOver = document.getElementById("start-over");

function switchSection(from, to) {
    from.classList.add("hidden");
    to.classList.remove("hidden");
}

async function chooseSong(FILE, key) {
    switchSection(chooseSection, loadingSection);

    const response = await fetch(`${base}/api/audio/${key}`);
    const data = await response.json();

    const audio = new Audio(`${base}/audio/${FILE}/${key}.mp3`);
    let isPlaying = false;

    const delay = async (ms) =>
        new Promise(resolve => setTimeout(resolve, ms));
    
    const correctLyric = data.guessing[8]["words"];

    playHint.addEventListener("click", async () => {
        if (isPlaying) return;
        isPlaying = true;
        audio.currentTime = data.hintStart;
        audio.play();
        for (let i = 0; i < data.guessing.length - 2; i++) {
            lyricsText.innerText = data.guessing[i]["words"];
            await delay(data.guessing[i + 1]["startTimeMs"] - data.guessing[i]["startTimeMs"]);
        }
        audio.pause();
        guess.setAttribute('placeholder', `Hint: ${correctLyric.split(" ").length} words`);
        guess.classList.remove("hidden");
        playAnswer.classList.remove("hidden");
        isPlaying = false;
    });

    playAnswer.addEventListener("click", async () => {
        if (isPlaying) return;
        isPlaying = true;
        audio.currentTime = data.answerStart;
        audio.play();

        const message = guess.value === correctLyric ? "Correct: " : "Incorrect: ";
        lyricsText.innerText = message + correctLyric;
        startOver.classList.remove("hidden");

        setTimeout(() => {
            audio.pause();
            isPlaying = false;
        }, (data.answerEnd - data.answerStart) * 1000);
    });

    startOver.addEventListener("click", () => {
        window.location.href = base;
    });

    switchSection(loadingSection, lyricsSection);
}

function createOption(FILE, key, song) {
    const li = document.createElement("li");
    li.innerText = song;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
        chooseSong(FILE, key);
    });
    listOfSongs.appendChild(li);
}

createSession.addEventListener("click", async () => {
    switchSection(startSection, loadingSection);

    const response = await fetch(`${base}/api/songs`);
    const data = await response.json();

    const FILE = Object.keys(data)[0];
    for (let key of Object.keys(data[FILE])) {
        createOption(FILE, key, data[FILE][key]);
    }

    switchSection(loadingSection, chooseSection);
});
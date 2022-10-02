const base = window.location.origin || "http://localhost:3000";

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

function simplifyLyric(lyric) {
	return lyric
		.toLowerCase()
		.replace(/;|\.|,|"|'|!|\?|.\(([^()]+)\)/g, "")
		.replace("-", " ")
		.trim();
}

async function chooseSong(key) {
	switchSection(chooseSection, loadingSection);

	const response = await fetch(`${base}/api/lyrics/${key}`);
	const data = await response.json();

	const audio = new Audio(`${base}/tracks/${key}.mp3`);
	let isPlaying = false;

	const delay = async (sec) =>
		new Promise((resolve) => setTimeout(resolve, sec * 1000));

	const correctLyric = data.lyricsToGuess[8]["text"];

	playHint.addEventListener("click", async () => {
		if (isPlaying) return;
		isPlaying = true;
		audio.currentTime = data.timeStamps.hintStart;
		audio.play();
		for (let i = 0; i < data.lyricsToGuess.length - 2; i++) {
			lyricsText.innerText = data.lyricsToGuess[i]["text"];
			await delay(
				data.lyricsToGuess[i + 1]["start"] -
					data.lyricsToGuess[i]["start"]
			);
		}
		audio.pause();
		guess.setAttribute(
			"placeholder",
			`Hint: ${correctLyric.split(" ").length} words`
		);
		guess.classList.remove("hidden");
		playAnswer.classList.remove("hidden");
		isPlaying = false;
	});

	playAnswer.addEventListener("click", () => {
		if (isPlaying) return;
		isPlaying = true;
		audio.currentTime = data.timeStamps.answerStart;
		audio.play();

		const guessSimplified = simplifyLyric(guess.value);
		const answerSimplified = simplifyLyric(correctLyric);
		const message =
			guessSimplified === answerSimplified ? "Correct: " : "Incorrect: ";
		lyricsText.innerText = message + correctLyric;
		startOver.classList.remove("hidden");

		setTimeout(() => {
			audio.pause();
			isPlaying = false;
		}, (data.timeStamps.answerEnd - data.timeStamps.answerStart) * 1000);
	});

	startOver.addEventListener("click", () => {
		window.location.href = base;
	});

	switchSection(loadingSection, lyricsSection);
}

function createOption(key, song) {
	const li = document.createElement("li");
	li.innerText = song;
	li.style.cursor = "pointer";
	li.addEventListener("click", () => {
		chooseSong(key);
	});
	listOfSongs.appendChild(li);
}

createSession.addEventListener("click", async () => {
	switchSection(startSection, loadingSection);

	const response = await fetch(`${base}/api/playlists`);
	const playlists = await response.json();

	for (const playlist of playlists)
		for (const song of playlist["songs"])
			createOption(song["id"], song["name"]);

	switchSection(loadingSection, chooseSection);
});

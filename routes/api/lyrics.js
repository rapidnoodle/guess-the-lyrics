const lrcParser = require("lrc-parser");
const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

function guessable(string) {
	const regex = /[^\u0000-\u00ff]/;
	return !(regex.test(string) || string.includes("("));
}

router.get("/:id", async (req, res) => {
	const id = req.params.id;

	const file = await fs.promises.readFile(
		path.join(process.cwd(), "database/lyrics", `${id}.lrc`),
		"utf-8"
	);
	const data = lrcParser(file);

	const lyrics = data["scripts"];
	const offset = Math.random() * (lyrics.length - 9);
	let guessing = lyrics.slice(offset, offset + 10);
	if (!guessable(guessing[8]["text"]))
		guessing = lyrics.slice(offset - 1, offset + 9);

	const hintStart = guessing[0]["start"];
	const answerStart = guessing[8]["start"];
	const answerEnd = guessing[9]["start"];

	const song = {
		id,
		name: data["ti"],
		artists: data["ar"],
		album: data["al"],
		timeStamps: {
			hintStart,
			answerStart,
			answerEnd,
		},
		lyricsToGuess: guessing.map((lyric) => ({
			start: lyric["start"],
			text: lyric["text"],
		})),
	};
	res.json(song);
});

module.exports = router;

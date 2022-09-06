const { readJSONData } = require("../../util/JSON");
const express = require("express");

const router = express.Router();

function guessable(string) {
    const regex = /[^\u0000-\u00ff]/;
    return !(regex.test(string) || string.includes("("))
}

router.get("/:id", async (req, res) => {
    const id = req.params.id;

    const songs = await readJSONData(process.env.FILE);
    const lyrics = songs[id]["lyrics"];
    const offset = Math.random() * (lyrics.length - 9);
    const guessing = lyrics.slice(offset, offset + 10);
    if (!guessable(guessing[8]["words"]))
        guessing = lyrics.slice(offset - 1, offset + 9);
    
    const hintStart = guessing[0]["startTimeMs"] / 1000;
    const hintEnd = guessing[8]["startTimeMs"] / 1000;
    const answerStart = hintEnd;
    const answerEnd = guessing[9]["startTimeMs"] / 1000;

    res.json({
        guessing,
        src: `/audio/${id}.mp3`,
        hintStart,
        hintEnd,
        answerStart,
        answerEnd
    });
});

module.exports = router;
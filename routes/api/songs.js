const { readJSONData } = require("../../util/JSON");
const express = require("express");

const router = express.Router();

router.get("", async (req, res) => {
    const FILE = process.env.FILE;
    const songs = await readJSONData(FILE);
    const keys = Object.keys(songs);
    const list = {};
    list[FILE] = {};
    for (let i = 0; i < keys.length; i++) {
        list[FILE][keys[i]] = songs[keys[i]]["songName"];
    }
    res.json(list);
});

module.exports = router;
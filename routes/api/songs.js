const { readJSONData } = require("../../util/JSON");
const express = require("express");

const router = express.Router();

router.get("", async (req, res) => {
    const songs = await readJSONData(process.env.FILE);
    const keys = Object.keys(songs);
    const list = {};
    for (let i = 0; i < keys.length; i++) {
        list[keys[i]] = songs[keys[i]]["songName"];
    }
    res.json(list);
});

module.exports = router;
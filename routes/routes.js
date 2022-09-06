const express = require("express");
const path = require("path");

const base = path.resolve(__dirname, '../');
const router = express.Router();

router.get("", (req, res) => {
    res.sendFile(path.join(base, "views", "index.html"));
});

module.exports = router;
const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("", async (req, res) => {
	const playlists = [];
	const base = path.join(process.cwd(), "database/playlists");
	const files = await fs.promises.readdir(base, "utf-8");
	for (const file of files) {
		if (!file.endsWith(".json")) continue;
		const data = await fs.promises.readFile(path.join(base, file), "utf-8");
		playlists.push(JSON.parse(data));
	}
	res.json(playlists);
});

router.get("/:id", async (req, res) => {
	res.json(
		await fs.promises.readFile(
			path.join(process.cwd(), "database/playlists", req.params.id),
			"utf-8"
		)
	);
});

module.exports = router;

require("dotenv").config();

const playlists = require("./routes/api/playlists");
const lyrics = require("./routes/api/lyrics");
const routes = require("./routes/routes");
const express = require("express");
const path = require("path");

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/tracks", express.static(path.join(process.cwd(), "database/tracks")));

app.use("/", routes);
app.use("/api/lyrics", lyrics);
app.use("/api/playlists", playlists);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}...`);
});

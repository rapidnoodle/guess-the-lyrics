require("dotenv").config();

const audio = require("./routes/api/audio");
const songs = require("./routes/api/songs");
const routes = require("./routes/routes");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/api/audio", audio);
app.use("/api/songs", songs);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`)
});
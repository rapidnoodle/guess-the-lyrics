const path = require("path");
const fs = require("fs");

const base = path.resolve(__dirname, '..');

function readJSONData(file) {
    return new Promise((res, rej) => {
        fs.readFile(`${base}/data/json/${file}.json`, "utf8", (err, data) => {
            if (err) rej(err);
            const songs = JSON.parse(data);
            res(songs);
        })
    });
}

function writeJSONData(file, data) {
    return new Promise((res, rej) => {
        fs.writeFile(`${base}/data/json/${file}.json`, data, err => {
            if (err) rej(err);
            res(true);
        });
    });
}

module.exports = {
    readJSONData,
    writeJSONData
};
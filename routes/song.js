const express = require("express");
const router = express.Router();
const mixup = require("../mixup");
const songData = mixup.song;

/**
 * Add song to user playlist
 */
router.post("/addSong", async (req, res) => {
    try {
        const song = await songData.addSong(req);
        console.log('song', song)
        res.json(song);
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }
});

/**
 * Search song from youtube
 */
router.post("/searchSong", async (req, res) => {
    try {
        const song = await songData.searchSongYoutube(req);
        console.log('song', song)
        res.json(song);
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }

});

module.exports = router;

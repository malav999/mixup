const express = require("express");
const router = express.Router();
const mixup = require("../mixup");
const playlistData = mixup.playlist;

router.post("/create", async (req, res) => {
    try {
        const playlist = await playlistData.createPlaylist(req);
        console.log('playlist', playlist)
        res.json(playlist);
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }
});

module.exports = router;
